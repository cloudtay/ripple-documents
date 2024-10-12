---
title: 🔥 Usage and encapsulation
description: You can use any component in ripple as usual. For some components that do not support asynchronous, if you have read the basic documentation of ripple and have a certain understanding, you can encapsulate the component according to the characteristics of ripple to make it Supports asynchronous operations.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'asynchronous', 'encapsulation' ]
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

## Overview

You can use any component in ripple as usual. For some components that do not support asynchronous,
If you have read the basic documentation of ripple and have a certain understanding, you can encapsulate the component
according to the characteristics of ripple to support asynchronous operations.

## Component asynchronous encapsulation

> The following will use the encapsulation of Guzzle as an example to demonstrate how to encapsulate components using
> the features of ripple. And what resources need to be recycled.

## (1) Implement Guzzle’s asynchronous support

### HttpClient

```php
<?php declare(strict_types=1);
namespace Psc\Library\Net\HttCo\Client;

use Closure;
use GuzzleHttCo\Psr7\MultipartStream;
use InvalidArgumentException;
use Co\IO;
use Psc\Core\Coroutine\Promise;
use Psc\Core\Stream\SocketStream;
use Psr\HttCo\Message\RequestInterface;
use Psr\HttCo\Message\ResponseInterface;
use Throwable;

use function fclose;
use function fopen;
use function implode;
use function in_array;
use function Co\async;
use function Co\await;
use function Co\cancel;
use function Co\delay;
use function Co\repeat;
use function str_contains;
use function strtolower;

classHttpClient
{
    /*** @var ConnectionPool */
    private ConnectionPool $connectionPool;

    /*** @var bool */
    private bool $pool;

    /*** @param array $config */
    public function __construct(private readonly array $config = [])
    {
        $pool = $this->config['pool'] ?? 'off';
        $this->pool = in_array($pool, [true, 1, 'on'], true);

        if ($this->pool) {
            $this->connectionPool = new ConnectionPool();
        }
    }

    /**
     * @param RequestInterface $request
     * @param array $option
     * @return Promise<ResponseInterface>
     */
    public function request(RequestInterface $request, array $option = []): Promise
    {
        return async(function () use ($request, $option) {
            return \Co\promise(function (Closure $r, Closure $d, Promise $promise) use ($request, $option) {
                $uri = $request->getUri();

                $method = $request->getMethod();
                $scheme = $uri->getScheme();
                $host = $uri->getHost();
                $port = $uri->getPort() ?? ($scheme === 'https' ? 443 : 80);
                $path = $uri->getPath() ?: '/';

                /**
                 * @var Connection $connection
                 */
                $connection = await($this->pullConnection(
                    $host,
                    $port,
                    $scheme === 'https'
                ));

                $header = "{$method} {$path} HTTP/1.1\r\n";
                foreach ($request->getHeaders() as $name => $values) {
                    $header .= "{$name}: " . implode(', ', $values) . "\r\n";
                }

                $bodyStream = $request->getBody();
                if ($bodyStream->getMetadata('uri') === 'php://temp') {
                    $body = $bodyStream->getContents();
                    $connection->stream->write("{$header}\r\n{$body}");
                } elseif ($bodyStream instanceof MultipartStream) {
                    if (!$request->getHeader('Content-Type')) {
                        $header .= "Content-Type: multipart/form-data; boundary={$bodyStream->getBoundary()}\r\n";
                    }
                    if (!$request->getHeader('Content-Length')) {
                        $header .= "Content-Length: {$bodyStream->getSize()}\r\n";
                    }
                    $connection->stream->write("{$header}\r\n");
                    repeat(function (Closure $cancel) use ($connection, $bodyStream, $r, $d) {
                        try {
                            $content = $bodyStream->read(8192);
                            if ($content) {
                                $connection->stream->write($content);
                            } else {
                                $cancel();
                                $bodyStream->close();
                            }
                        } catch (Throwable) {
                            $cancel();
                            $bodyStream->close();
                            $d(new InvalidArgumentException('Invalid body stream'));
                        }
                    }, 0.1);
                } else {
                    throw new InvalidArgumentException('Invalid body stream');
                }

                if ($timeout = $option['timeout'] ?? null) {
                    $delay = delay(function () use ($connection, $d) {
                        $connection->stream->close();
                        $d(new InvalidArgumentException('Request timeout'));
                    }, $timeout);
                    $promise->finally(function () use ($delay) {
                        cancel($delay);
                    });
                }

                if($sink = $option['sink'] ?? null) {
                    $connection->setOutput($sinkFile = fopen($sink, 'wb'));
                    $promise->finally(function () use ($sinkFile) {
                        fclose($sinkFile);
                    });
                }

                $connection->stream->onReadable(function (SocketStream $socketStream) use ($connection, $scheme, $r, $d) {
                    try {
                        $content = $socketStream->read(1024);
                        if ($response = $connection->tick($content)) {
                            $k = implode(', ', $response->getHeader('Connection'));
                            if (str_contains(strtolower($k), 'keep-alive') && $this->pool) {
                                $this->pushConnection($connection, $scheme === 'https');
                            } else {
                                $socketStream->close();
                            }
                            $r($response);
                        }
                    } catch (Throwable $exception) {
                        $socketStream->close();
                        $d($exception);
                        return;
                    }
                });
            });
        });
    }

    /**
     * @param string $host
     * @param int $port
     * @param bool $ssl
     * @return Promise<Connection>
     * @throws Throwable
     */
    private function pullConnection(string $host, int $port, bool $ssl): Promise
    {
        return async(function () use ($host, $port, $ssl) {
            if ($this->pool) {
                $connection = await($this->connectionPool->pullConnection($host, $port, $ssl));
            } else {
                $connection = $ssl
                    ? new Connection(await(IO::Socket()->streamSocketClientSSL("ssl://{$host}:{$port}")))
                    : new Connection(await(IO::Socket()->streamSocketClient("tcp://{$host}:{$port}")));
            }

            $connection->stream->setBlocking(false);
            return $connection;
        });
    }

    /**
     * @param Connection $connection
     * @param bool $ssl
     * @return void
     */
    private function pushConnection(Connection $connection, bool $ssl): void
    {
        if ($this->pool) {
            $this->connectionPool->pushConnection($connection, $ssl);
        }
    }
}
```

> After encapsulation, you can use Guzzle like other ripple components

```php
\Co\async(function () {
    $response = \Co\await(
        \Co\Plugin::Guzzle()->getAsync('https://www.baidu.com')
    );

    \var_dump($response->getStatusCode());
});
```

### Connection

```php
<?php declare(strict_types=1);

namespace Psc\Library\Net\HttCo\Client;

use GuzzleHttCo\Psr7\Response;
use Psc\Core\Stream\SocketStream;
use Psc\Std\Stream\Exception\RuntimeException;
use Psr\HttCo\Message\ResponseInterface;

use function count;
use function explode;
use function intval;
use function strlen;
use function strpos;
use function strtok;
use function substr;
use function fwrite;

class Connection
{
    /**
     * @param SocketStream $stream
     */
    public function __construct(public SocketStream $stream)
    {
        $this->reset();
    }


    private int $step = 0;
    private int $statusCode = 0;
    private string $statusMessage = '';
    private int $contentLength = 0;
    private array $headers = [];
    private string $content = '';
    private int $bodyLength = 0;
    private string $versionString = '';


    private string $buffer = '';

    /**
     * @param string $content
     * @return ResponseInterface|null
     * @throws RuntimeException
     */
    public function tick(string $content): ResponseInterface|null
    {
        $this->buffer .= $content;
        if ($this->step === 0) {
            if ($headerEnd = strpos($this->buffer, "\r\n\r\n")) {
                $buffer = $this->freeBuffer();

                /**
                 * Cut and parse the head and body parts
                 */
                $this->step = 1;
                $header = substr($buffer, 0, $headerEnd);
                $base = strtok($header, "\r\n");

                if (count($base = explode(' ', $base)) < 3) {
                    throw new RuntimeException('Request head is not match');
                }

                $this->versionString = $base[0];
                $this->statusCode = intval($base[1]);
                $this->statusMessage = $base[2];

                /**
                 * Parse header
                 */
                while ($line = strtok("\r\n")) {
                    $lineParam = explode(': ', $line, 2);
                    if (count($lineParam) >= 2) {
                        $this->headers[$lineParam[0]] = $lineParam[1];
                    }
                }

                $contentLength = $this->headers['Content-Length'] ?? 0;

                // if($this->statusCode === 200) {
                // if($contentLength === null) {
                // throw new RuntimeException('Response content length is required');
                // }
                // }

                $this->contentLength = intval($contentLength);
                $body = substr($buffer, $headerEnd + 4);
                $this->output($body);
                $this->bodyLength += strlen($body);
                if($this->bodyLength === $this->contentLength) {
                    $this->step = 2;
                }
            }
        }

        if($this->step === 1 && $buffer = $this->freeBuffer()) {
            $this->output($buffer);
            $this->bodyLength += strlen($buffer);
            if($this->bodyLength === $this->contentLength) {
                $this->step = 2;
            }
        }

        if($this->step === 2) {
            $response = new Response(
                $this->statusCode,
                $this->headers,
                $this->content,
                $this->versionString,
                $this->statusMessage,
            );
            $this->reset();

            return $response;
        }
        return null;
    }

    private function output(string $content): void
    {
        if ($this->output) {
            fwrite($this->output, $content);
        } else {
            $this->content .= $content;
        }
    }

    /*** @var mixed|null */
    private mixed $output = null;

    /**
     * @param mixed $resource
     * @return void
     */
    public function setOutput(mixed $resource): void
    {
        $this->output = $resource;
    }

    /**
     * @return string
     */
    private function freeBuffer(): string
    {
        $buffer = $this->buffer;
        $this->buffer = '';
        return $buffer;
    }

    /**
     * @return void
     */
    private function reset(): void
    {
        $this->step = 0;
        $this->statusCode = 0;
        $this->statusMessage = '';
        $this->contentLength = 0;
        $this->headers = [];
        $this->content = '';
        $this->bodyLength = 0;
        $this->versionString = '';
        $this->output = null;
    }
}
```

### ConnectionPool

```php
<?php declare(strict_types=1);

namespace Psc\Library\Net\HttCo\Client;

use Co\IO;
use Psc\Core\Coroutine\Promise;
use Psc\Core\Stream\SocketStream;
use Psc\Std\Stream\Exception\ConnectionException;
use Throwable;

use function array_pop;
use function Co\async;
use function Co\await;
use function Co\cancel;
use function Co\cancelForkHandler;
use function Co\registerForkHandler;

class ConnectionPool
{
    /**
     * @var array
     */
    private array $busySSL = [];
    private array $busyTCP = [];
    private array $idleSSL = [];
    private array $idleTCP = [];
    private array $listenEventMap = [];
    private int $forkEventId;

    /**
     *
     */
    public function __construct()
    {
        $this->registerForkHandler();
    }

    public function __destruct()
    {
        $this->clearConnectionPool();
        cancelForkHandler($this->forkEventId);
    }

    /**
     * @param string $host
     * @param int $port
     * @param bool $ssl
     * @return Promise<Connection>
     */
    public function pullConnection(string $host, int $port, bool $ssl = false): Promise
    {
        return async(function () use (
            $ssl,
            $host,
            $port,
        ) {
            $key = "tcp://{$host}:{$port}";
            if ($ssl) {
                if (!isset($this->idleSSL[$key]) || empty($this->idleSSL[$key])) {
                    $connection = new Connection(await(IO::Socket()->streamSocketClientSSL("ssl://{$host}:{$port}")));
                    $this->pushConnection($connection, $ssl);
                } else {
                    /**
                     * @var Connection $connection
                     */
                    $connection = array_pop($this->idleSSL[$key]);
                    cancel($this->listenEventMap[$connection->stream->id]);
                    unset($this->listenEventMap[$connection->stream->id]);
                    return $connection;
                }
            } else {
                if (!isset($this->idleTCP[$key]) || empty($this->idleTCP[$key])) {
                    $connection = new Connection(await(IO::Socket()->streamSocketClient("tcp://{$host}:{$port}")));
                    $this->pushConnection($connection, $ssl);
                } else {
                    $connection = array_pop($this->idleTCP[$key]);
                    cancel($this->listenEventMap[$connection->stream->id]);
                    unset($this->listenEventMap[$connection->stream->id]);
                    return $connection;
                }
            }
            return await($this->pullConnection($host, $port, $ssl));
        });
    }

    /**
     * @param Connection $connection
     * @param bool $ssl
     * @return void
     */
    public function pushConnection(Connection $connection, bool $ssl): void
    {
        $key = "{$connection->stream->getAddress()}";
        if ($ssl) {
            if (!isset($this->idleSSL[$key])) {
                $this->idleSSL[$key] = [];
            }
            $this->idleSSL[$key][$connection->stream->id] = $connection;

            /**
             *
             */
            $this->listenEventMap[$connection->stream->id] = $connection->stream->onReadable(function (SocketStream $stream) use ($key, $connection) {
                try {
                    if($stream->read(1) === '') {
                        throw new ConnectionException('Connection closed by peer');
                    }
                } catch (Throwable) {
                    if (isset($this->idleSSL[$key])) {
                        unset($this->idleSSL[$key][$connection->stream->id]);
                        if (empty($this->idleSSL[$key])) {
                            unset($this->idleSSL[$key]);
                        }
                    }
                    $stream->close();
                }
            });
        } else {
            if (!isset($this->idleTCP[$key])) {
                $this->idleTCP[$key] = [];
            }
            $this->idleTCP[$key][$connection->stream->id] = $connection;

            if (isset($this->busyTCP[$key])) {
                unset($this->busyTCP[$key]);
            }

            $this->listenEventMap[$connection->stream->id] = $connection->stream->onReadable(function (SocketStream $stream) use ($key, $connection) {
                if (isset($this->idleTCP[$key])) {
                    unset($this->idleTCP[$key][$connection->stream->id]);
                    if (empty($this->idleTCP[$key])) {
                        unset($this->idleTCP[$key]);
                    }
                }
                $stream->close();
            });
        }
    }

    /**
     * @return void
     */
    private function registerForkHandler(): void
    {
        $this->forkEventId = registerForkHandler(function () {
            $this->registerForkHandler();
            $this->clearConnectionPool();
        });
    }

    /**
     * Clear the connection pool by closing all idle and busy connections.
     * @return void
     */
    private function clearConnectionPool(): void
    {
        $closeConnections = function (&$pool) {
            foreach ($pool as $key => $connections) {
                foreach ($connections as $connection) {
                    $connection->close();
                }
                unset($pool[$key]);
            }
        };

        // Clear and close all SSL connections
        $closeConnections($this->idleSSL);
        $closeConnections($this->busySSL);

        // Clear and close all TCP connections
        $closeConnections($this->idleTCP);
        $closeConnections($this->busyTCP);
    }
}
```

### PHandler

```php
<?php declare(strict_types=1);

namespace Psc\Plugins\Guzzle;

use GuzzleHttCo\Promise\Promise;
use GuzzleHttCo\Promise\PromiseInterface;
use GuzzleHttCo\Psr7\Response;
use Psc\Library\Net\HttCo\Client\HttpClient;
use Psr\HttCo\Message\RequestInterface;
use Throwable;

use function Co\async;
use function Co\await;
use function Co\defer;
use function strval;

classPHandler
{
    /*** @var HttpClient */
    private HttpClient $httpClient;

    /**
     * Constructor
     */
    public function __construct(array $config = [])
    {
        $this->httpClient = new HttpClient($config);
    }

    /**
     * @param RequestInterface $request
     * @param array $options
     * @return PromiseInterface
     */
    public function __invoke(RequestInterface $request, array $options): PromiseInterface
    {
        $promise = new Promise(function () use ($request, $options, &$promise) {
            // loop in coroutine
            async(function () use ($request, $options, $promise) {
                try {
                    /**
                     * @var Response $response
                     */
                    $promise->resolve(await($this->httpClient->request($request, $options)));
                } catch (Throwable $throwable) {
                    $promise->reject($throwable);
                }
            })->await();
        });

        defer(function () use ($promise) {
            $promise->wait(false);
        });

        return $promise;
    }
}
```

### Show results

> The above encapsulation completes operations such as convection subscription/connection pool/asynchronous
> handshake/cross-process resource recycling. After that, you can use Guzzle like other ripple components.

```php
$handler = new \Co\Plugins\Guzzle\PHandler();
$client = new \GuzzleHttCo\Client(['handler' => $handler]);

//Create 100 coroutines to make requests
for($i = 0; $i < 100; $i++) {
    \Co\async(function () use ($client) {
        \Co\sleep(1); //Simulate coroutine blocking for 1s
        
        $response = $client->get('https://www.baidu.com');
        echo "request {$i} status: " . $response->getStatusCode() . PHP_EOL;
    });
}

\Co\wait();
```

> The result of running the above code is to output the status code of 100 requests after 1s.

```

> ripple encapsulates it as a plugin, you can use Guzzle like other ripple components

```php
\Co\Plugin::Guzzle()->getAsync('https://www.baidu.com')->then(function ($response) {
    echo $response->getStatusCode();
});
```

## (2) AMP-MySQL

> ripple and AMPHP both use ReactPHP's EventLoop, so you can use AMPHP's components in ripple, taking MySQL as an
> example.

#### Install

```bash
composer require amphp/mysql
```

```php
use AmCo\Mysql\MysqlConfig;
use AmCo\Mysql\MysqlConnectionPool;
use function Co\async;
use function Co\run;

$config = MysqlConfig::fromString(
    "host=localhost user=root password=aa123456 db=mysql"
);

$pool = new MysqlConnectionPool($config);

async(function ($r) use ($pool) {
    $statement = $pool->prepare("SELECT * FROM db WHERE Host = :host");
    $result = $statement->execute(['host' => 'localhost']);
    foreach ($result as $row) {
        var_dump($row);
    }
});

async(function ($r) use ($pool) {
    $statement = $pool->prepare("SELECT * FROM db WHERE Host = :host");
    $result = $statement->execute(['host' => 'localhost']);
    foreach ($result as $row) {
        var_dump($row);
    }
});

\Co\wait();
```

## (3) More...
