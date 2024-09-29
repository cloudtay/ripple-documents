---
title: http
description: Ripple中的Http服务组件, 用于构建一个Http服务
keywords: ['Ripple', 'PHP', '协程', '高性能', '高并发', 'Http', 'Server','异步Http','GuzzleHttp异步','Guzzle异步']
---

### Http服务 模块

### 概述

Ripple提供了一个易用的HttpServer组件,可以用于快速构建一个Http服务,使用方法如下

其中Request和Response继承并实现了`Symfony`的`RequestInterface`和`ResponseInterface`接口规范
可以像使用Symfony / Laravel中的 HttpFoundation 组件一样使用他们

### 用例

```php
use Co\IO;
use Psc\Store\Net\HttCo\Server\Request;
use Psc\Store\Net\HttCo\Server\Response;
use function Co\await;
use function Co\run;

$server = Co\Net::Http()->server('http://127.0.0.1:8008');
$handler = function (Request $request, Response $response) {
    if ($request->getMethod() === 'POST') {
        $files = $request->files->get('file');
        $data  = [];
        foreach ($files as $file) {
            $data[] = [
                'name' => $file->getClientOriginalName(),
                'path' => $file->getPathname(),
            ];
        }
        $response->headers->set('Content-Type', 'application/json');
        $response->setContent(json_encode($data));
        $response->respond();
    }

    if ($request->getMethod() === 'GET') {
        if ($request->getPathInfo() === '/') {
            $response->setContent('Hello World!');
            $response->respond();
        }

        if ($request->getPathInfo() === '/download') {
            $response->setContent(
                IO::File()->open(__FILE__, 'r')
            );
            $response->respond();
        }

        if ($request->getPathInfo() === '/upload') {
            $template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Upload</title></head><body><form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file"><button type="submit">Upload</button></form></body>';
            $response->setContent($template);
            $response->respond();
        }

        if ($request->getPathInfo() === '/qq') {
            $qq = await(Co\Net::Http()->Guzzle()->getAsync(
                'https://www.qq.com/'
            ));

            $response->setContent($qq->getBody()->getContents());
            $response->respond();
        }
    }
};

$server->onRequest($handler);
$server->listen();

run();
```

### 端口复用

> Ripple支持配合Parallel的模块实现端口多路复用

```php
# 如上创建好HttpServer后,可以替代监听方式实现端口多路复用

$task = Co\System::Process()->task( fn() => $server->listen() );

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

Co\run();
```
