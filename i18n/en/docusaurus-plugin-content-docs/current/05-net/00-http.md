---
title: WEB Application Service
description: Http service component in ripple, used to build an Http service
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'Http', 'Server','asynchronous Http','GuzzleHttp asynchronous','Guzzle asynchronous' ]
---

### Http service module

### Overview

Ripple provides an easy-to-use HttpServer component that can be used to quickly build an Http service. The usage method
is as follows

### Use cases

```php
use Ripple\Http\Server;
use Ripple\Http\Server\Request;

use function Co\wait;

$server = new Server('http://127.0.0.1:8008');
$server->onRequest(static function (Request $request) {
    $uri = $request->SERVER['REQUEST_URI'];
    $method = $request->SERVER['REQUEST_METHOD'];
    $request->respond(
        'you are requesting ' . $uri . ' with ' . $method . ' method'
    );
});

$server->listen();
wait();
```

### Port reuse

> ripple supports port multiplexing with Parallel modules

```php
# After creating the HttpServer as above, you can replace the listening method to implement port multiplexing.

$task = \Co\System::Process()->task( fn() => $server->listen() );

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

\Co\run();
```
