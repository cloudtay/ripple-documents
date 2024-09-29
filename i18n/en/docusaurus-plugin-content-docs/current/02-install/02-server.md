---
title: Service Mode - Server
description: Ripple provides a memory-resident service mode operation, which can run your program as a service. Compared with the traditional CGI mode workflow, service mode operation can effectively improve the performance of the program and reduce unnecessary consumption of loading files. , In widespread practice, the performance of the service mode is much higher than that of the traditional CGI mode.
keywords: ['Ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'service mode', 'server', 'service running']
---

### Overview

Ripple provides a memory-resident service mode operation, which can run your program as a service. Compared with the
traditional CGI mode workflow,
The workflow of the service mode can effectively improve the performance of the program and reduce the unnecessary
consumption of loading files. In extensive practice, the performance of the service mode is much higher than the
traditional CGI mode.

Currently the project supports ThinkPHP / Laravel / Workerman / Webman

## Installation method

> Install via Composer

```bash
composer require cclilshy/p-ripple-drive
```

## Deployment reference

### Workerman

```php
Worker::$eventLoopClass = \Psc\Drive\Workerman\PDrive::class;
Worker::runAll();
```

---

### Webman

> Modify the configuration file config/server.php service configuration file

```php
return [
    //...
    'event_loop' => \Psc\Drive\Workerman\PDrive::class,
];
```

---

### Laravel

#### Environment configuration support (ENV)

| Configuration items | Description | Default value |
|-------------------|----------------------------- ---------------------------------------|---------- ---------------|
| `PRP_HTTP_LISTEN` | HTTP service, listening address format such as `http://127.0.0.1:8008` | `http://127.0.0.1:8008` |
| `PRP_HTTP_COUNT` | HTTP service, number of worker processes | `4` |
| `PRP_ISOLATION` | Controller isolation mode, after turning on, the Controller will be re-instantiated for each
request, suitable for stateful Controller isolation $this->request | `0` |

```bash
php artisan p:server {action} {--daemon}

# action: start|stop|reload|status, default is start
# -d | --daemon Whether to run as a daemon process, the default is false
```

> open `http://127.0.0.1:8008/`
---

### ThinkPHP

```bash
php think p:server {action} {--daemon}

# action: start|stop|reload|status, default is start
# -d | --daemon Whether to run as a daemon process, the default is false
```

> open `http://127.0.0.1:8008/`
---

### Nginx Reference

```nginx
upstream backend{
 server 127.0.0.1:8008;
 keepalive 10240;
}

server{
    listen 80;
    server_name tp.xxx.cn;
    root /xp/www/tp/public;
    access_log off;
    
    location / {
       proxy_pass http://backend;
       proxy_set_header Upgrade $http_upgrade;  
       proxy_set_header Connection "Upgrade";
       proxy_set_header REMOTE-HOST $remote_addr;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header X-Forwarded-Host $host;
       proxy_set_header X-Forwarded-Port $server_port;
}
```

### Notes

> You need to have a certain understanding of the mechanism of the CLI running mode, and know what will happen during
> the running of the following functions to decide how to use them? For example
> `dd` `var_dump` `echo` `exit` `die`

## Custom service

Laravel/ThinkPHP's Http service is also implemented based on Worker, built into Drive and injected with Laravel's
dependency injection.
You can implement custom services by inheriting the Worker class and use HttpWorker to call each other, such as

### Ws.php

```php
<?php declare(strict_types=1);

namespace ApCo\Server;

use Co\Net;
use Psc\Core\WebSocket\Server\Connection;
use Psc\Core\WebSocket\Server\Server;
use Psc\Worker\Command;
use Psc\Worker\Manager;
use Psc\Worker\Worker;

class WsWorker extends Worker
{
    private Server $wsServer;

    private array $connections = [];

    public function register(Manager $manager): void
    {
        $this->wsServer = Net::WebSocket()->server('ws://127.0.0.1:8001', []);
    }

    public function boot(): void
    {
        $this->wsServer->onMessage(function (string $content, Connection $connection) {
            $connection->send("response > {$content}");
        });

        $this->wsServer->onConnect(function (Connection $connection) {
            $this->connections[$connection->getId()] = $connection;
        });

        $this->wsServer->onClose(function (Connection $connection) {
            unset($this->connections[$connection->getId()]);
        });

        $this->wsServer->listen();
    }

    public function onCommand(Command $workerCommand): void
    {
        if ($workerCommand->name === 'sendMessageToAll') {
            foreach ($this->connections as $connection) {
                $connection->send($workerCommand->arguments['message']);
            }
        }
    }

    public function getName(): string
    {
        return 'ws-server';
    }

    public function getCount(): int
    {
        return 1;
    }

    public function onReload(): void
    {
        // TODO: Implement onReload() method.
    }
}
```

### AppServiceProvider.php

```php
<?php declare(strict_types=1);

namespace ApCo\Providers;

use ApCo\Server\WsWorker;
use Illuminate\Support\ServiceProvider;
use Psc\Worker\Manager;

class AppServiceProvider extends ServiceProvider
{
    public function boot(Manager $manager): void
    {
        $manager->addWorker(new WsWorker());
    }
}
```

### Access Services

```php
class IndexController extends Controller
{
    public function notice(Request $request,\Psc\Drive\Laravel\Worker $httpWorker) : JsonResponse
    {
        $command = Command::make('sendMessageToAll', [
            'message' => 'post message ' . $request->post('message')
        ]);
        $httpWorker->commandToWorker($command, 'ws-server');
        return Response::json(['message' => 'success']);
    }
}
```
