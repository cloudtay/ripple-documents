---
title: http
description: Http service component in PRipple, used to build an Http service
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'Http', 'Server','asynchronous Http','GuzzleHttp asynchronous','Guzzle asynchronous']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Http service module

### Overview

PRipple provides an easy-to-use HttpServer component that can be used to quickly build an Http service. The usage method
is as follows

Among them, Request and Response inherit and implement the `RequestInterface` and `ResponseInterface` interface
specifications of `Symfony`.
You can use them just like the HttpFoundation component in Symfony/Laravel

### Example

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
        $data = [];
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
            $template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Upload</title></head><body><form action=" /upload" method="post" enctype="multipart/form-data"><input type="file" name="file"><button type="submit">Upload</button></form></ body>';
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

### Port reuse

> PRipple supports port multiplexing with Parallel modules

```php
# After creating HttpServer as above, you can replace the listening method to implement port multiplexing.

$task = Co\System::Process()->task( fn() => $server->listen() );

$task->run(); //runtime1
$task->run(); //runtime2
$task->run(); //runtime3
$task->run(); //runtime4
$task->run(); //runtime5

# Guardian mode startup example
$guardRun = function($task) use (&$guardRun){
    $task->run()->except(function() use ($task, &$guardRun){
        $guardRun($task);
    });
};

$guardRun($task);

Co\run();
```
