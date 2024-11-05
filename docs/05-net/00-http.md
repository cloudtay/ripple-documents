---
title: WEB应用服务
description: ripple中的Http服务组件, 用于构建一个Http服务
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发', 'Http', 'Server','异步Http','GuzzleHttp异步','Guzzle异步' ]
---

### Http服务 模块

### 概述

ripple提供了一个易用的HttpServer组件,可以用于快速构建一个Http服务,使用方法如下

### 用例

```php
use Ripple\Http\Server;
use Ripple\Http\Server\Request;

use function Co\wait;

$server = new Server('http://127.0.0.1:8008');
$server->onRequest(static function (Request $request) {
    $uri    = $request->SERVER['REQUEST_URI'];
    $method = $request->SERVER['REQUEST_METHOD'];
    $request->respond(
        'you are requesting ' . $uri . ' with ' . $method . ' method'
    );
});

$server->listen();
wait();
```

### 端口复用

> ripple支持配合Parallel的模块实现端口多路复用

```php
# 如上创建好HttpServer后,可以替代监听方式实现端口多路复用

$task = \Co\System::Process()->task( fn() => $server->listen() );

$task->run();   //runtime1
$task->run();   //runtime2
$task->run();   //runtime3
$task->run();   //runtime4
$task->run();   //runtime5

# 守护模式启动例子
$guardRun = function($task) use (&$guardRun){
    $task->run()->except(function() use ($task, &$guardRun){
        $guardRun($task);
    });
};

$guardRun($task);

\Co\run();
```
