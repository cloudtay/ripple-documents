---
title: 使用与封装
---

### 概述

PRipple中你可以像往常一样使用任何组件, 对于一些未支持异步的组件,
如果你已经阅读了PRipple的基础文档并有一定的了解,你可以根据PRipple的特性对该组件进行封装,使其支持异步操作。

以经过封装的GuzzleHttp为例

```php
namespace Psc\Plugins\Guzzle;

use Closure;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\CurlMultiHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Promise\PromiseInterface;
use GuzzleHttp\Psr7\Response;
use Psc\Core\Coroutine\Promise;
use Psc\Core\LibraryAbstract;

use function array_merge;
use function P\cancel;
use function P\registerForkHandler;
use function P\repeat;

/**
 *
 */
class Guzzle extends LibraryAbstract
{
    /**
     * @var LibraryAbstract
     */
    protected static LibraryAbstract $instance;

    /**
     * @var CurlMultiHandler
     */
    private CurlMultiHandler $curlMultiHandler;

    /**
     * @var HandlerStack
     */
    private HandlerStack $handlerStack;

    /**
     * 快转齿轮
     * @var string|null
     */
    private string|null $timerFast = null;

    /**
     *
     */
    public function __construct()
    {
        $this->install();
        $this->registerOnFork();
    }

    /**
     * @return void
     */
    private function registerOnFork(): void
    {
        registerForkHandler(function () {
            $this->install();
            $this->registerOnFork();
        });
    }

    /**
     * @param array|null $config
     * @return Client
     */
    public function client(array|null $config = []): Client
    {
        $config = array_merge(['handler' => $this->handlerStack], $config);
        return new Client($config);
    }

    /**
     * @return void
     */
    private function install(): void
    {
        $this->curlMultiHandler = new CurlMultiHandler();
        $this->handlerStack     = HandlerStack::create($this->curlMultiHandler);
    }

    /**
     * @param string $method
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function requestAsync(string $method, string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($method, $uri, $options) {
            $this->client()->requestAsync($method, $uri, $options)->then($r, $d);
        });
    }

    /**
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function getAsync(string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($uri, $options) {
            $this->translatePromise(
                $this->client()->getAsync($uri, $options),
                $r,
                $d
            );
        });
    }

    /**
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function postAsync(string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($uri, $options) {
            $this->translatePromise(
                $this->client()->postAsync($uri, $options),
                $r,
                $d
            );
        });
    }

    /**
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function putAsync(string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($uri, $options) {
            $this->translatePromise(
                $this->client()->putAsync($uri, $options),
                $r,
                $d
            );
        });
    }

    /**
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function deleteAsync(string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($uri, $options) {
            $this->translatePromise(
                $this->client()->deleteAsync($uri, $options),
                $r,
                $d
            );
        });
    }

    /**
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function headAsync(string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($uri, $options) {
            $this->translatePromise(
                $this->client()->headAsync($uri, $options),
                $r,
                $d
            );
        });
    }

    /**
     * @param string $uri
     * @param array  $options
     * @return Promise<Response>
     */
    public function patchAsync(string $uri, array $options = []): Promise
    {
        $this->refreshTimer();
        return new Promise(function (Closure $r, Closure $d) use ($uri, $options) {
            $this->translatePromise(
                $this->client()->patchAsync($uri, $options),
                $r,
                $d
            );
        });
    }

    private int $delay = 0;

    /**
     * @return void
     */
    private function refreshTimer(): void
    {
        if ($this->timerFast === null) {
            $this->timerFast = repeat(function () {
                $this->curlMultiHandler->tick();
            }, 0.1);
        }

        $this->delay++;
    }

    /**
     * @param PromiseInterface $guzzlePromise
     * @param Closure          $localR
     * @param Closure          $localD
     * @return void
     */
    private function translatePromise(PromiseInterface $guzzlePromise, Closure $localR, Closure $localD): void
    {
        $guzzlePromise->then(
            fn (mixed $result) => $this->onCallback($result, $localR),
            fn (mixed $reason) => $this->onCallback($reason, $localD)
        );
    }

    /**
     * @param mixed   $result
     * @param Closure $localCallback
     * @return void
     */
    private function onCallback(mixed $result, Closure $localCallback): void
    {
        $localCallback($result);
        if(--$this->delay === 0) {
            cancel($this->timerFast);
            $this->timerFast = null;
        }
    }
}
```

> 经过封装后,你可以像使用其他PRipple组件一样使用Guzzle

```php
\P\async(function () {
    $response  = \P\await(
        \P\Plugin::Guzzle()->getAsync('https://www.baidu.com')
    );

    \var_dump($response->getStatusCode());
});
```

```php
\P\Plugin::Guzzle()->getAsync('https://www.baidu.com')->then(function ($response) {
    \var_dump($response->getStatusCode());
});
```

### AMP支持

> PRipple与AMPHP使用的都是ReactPHP的EventLoop, 所以你可以在PRipple中使用AMPHP的组件,以MySQL为例

#### 安装

```bash
composer require amphp/mysql
```

```php
use Amp\Mysql\MysqlConfig;
use Amp\Mysql\MysqlConnectionPool;
use function P\async;
use function P\run;

$config = MysqlConfig::fromString(
    "host=localhost user=root password=aa123456 db=mysql"
);

$pool = new MysqlConnectionPool($config);

async(function ($r) use ($pool) {
    $statement = $pool->prepare("SELECT * FROM db WHERE Host = :host");
    $result    = $statement->execute(['host' => 'localhost']);
    foreach ($result as $row) {
        var_dump($row);
    }
});

async(function ($r) use ($pool) {
    $statement = $pool->prepare("SELECT * FROM db WHERE Host = :host");
    $result    = $statement->execute(['host' => 'localhost']);
    foreach ($result as $row) {
        var_dump($row);
    }
});

\P\tick();
```
