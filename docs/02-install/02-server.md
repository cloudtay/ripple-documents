---
title: 🚀 服务模式
description: ripple提供了常驻内存的服务模式运行，可以将你的程序作为一个服务运行，相对于传统CGI的模式工作流程, 服务模式运行能够有效的提高程序的性能，减少加载文件的无必要消耗, 在广泛的实践中，服务模式的性能要远远高于传统CGI模式。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发', '服务模式', '服务端', '服务运行' ]
---

### 概述

ripple提供了常驻内存的服务模式运行，可以将你的程序作为一个服务运行，相对于传统CGI的模式工作流程,
服务模式的工作流程能够有效的提高程序的性能，减少加载文件的无必要消耗, 在广泛的实践中，服务模式的性能要远远高于传统CGI模式。

目前该项目已经支持 ThinkPHP / Laravel / Workerman / Webman

## 安装方法

> 通过 Composer 安装

```bash
composer require cloudtay/ripple-driver
```

## 部署参考

### Workerman

```php
Worker::$eventLoopClass = \Psc\Drive\Workerman\PDrive::class;
Worker::runAll();
```

---

### Webman

> 修改配置文件config/server.php服务配置文件

```php
return [
    //...
    'event_loop' => \Psc\Drive\Workerman\PDrive::class,
];
```

--- 

### Laravel

#### 环境配置支持(ENV)

| 配置项               | 说明                                                                 | 默认值                     |
|-------------------|--------------------------------------------------------------------|-------------------------|
| `PRP_HTTP_LISTEN` | HTTP服务,监听地址格式如`http://127.0.0.1:8008`                              | `http://127.0.0.1:8008` |
| `PRP_HTTP_COUNT`  | HTTP服务,工作进程数                                                       | `4`                     |
| `PRP_ISOLATION`   | 控制器隔离模式,开启后每次请求都会重新实例化Controller,适用于有状态的Controller隔离$this->request | `0`                     |

```bash
php artisan p:server {action} {--daemon}

# action: start|stop|reload|status, 默认为start
# -d | --daemon     是否以守护进程运行,默认为false
```

> open `http://127.0.0.1:8008/`
--- 

### ThinkPHP

```bash
php think p:server  {action} {--daemon}

# action: start|stop|reload|status, 默认为start
# -d | --daemon     是否以守护进程运行,默认为false
```

> open `http://127.0.0.1:8008/`
---

### Nginx参考

```nginx
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://127.0.0.1:8008;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Original-Method $request_method;
    proxy_set_header X-Original-URI $request_uri;
    proxy_set_header X-Original-Query $query_string;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_set_header User-Agent $http_user_agent;
    proxy_set_header Referer $http_referer;
}
```

### 注意事项

> 你需要有一定了解CLI运行模式的机制,并知悉下列函数在运行过程中会发生什么以决定如何使用它们?如
> `dd` `var_dump` `echo` `exit` `die`

## 自定义服务

Laravel/ThinkPHP的Http服务也是基于Worker实现的,内置于Drive中并注入了Laravel的依赖注入
你可以通过继承Worker类来实现自定义服务,并使用HttpWorker于其相互调用,如

### Ws.php

```php
<?php declare(strict_types=1);

namespace App\Server;

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

### 访问服务

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

