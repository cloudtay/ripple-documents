---
title: WebSocket Service
description: Ripple supports operating WebSocket through the \Co\Net::WebSocket() method, which is used to process WebSocket services.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'WebSocket', 'Net' ]
---

### Overview

Ripple provides an easy-to-use WebSocketServer component that can be used to quickly build a WebSocket service. The
usage method is as follows

```php
use Ripple\WebSocket\Server;

use function Co\wait;

$context = \stream_context_create([
    'socket' => [
        'so_reuseport' => true,
        'so_reuseaddr' => true,
    ],
]);

$server = Net::WebSocket()->server('ws://127.0.0.1:8001', $context);
$server->listen();
$server->onConnect(function (Connection $connection) {
    $connection->send('Hello, world!');
});

$server->onMessage(function (string $data, Connection $connection) {
    echo 'Received: ' . $data . \PHP_EOL;
    $connection->send('Received: ' . $data);
});

$server->onClose(function (Connection $connection) {
    echo 'Connection closed' .\PHP_EOL;
});

wait();
```
