---
title: websocket
description: Ripple supports operating WebSocket through the \Co\Net::WebSocket() method, which is used to handle WebSocket services.
keywords: ['Ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'WebSocket', 'Net']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Overview

Ripple provides an easy-to-use WebSocketServer component that can be used to quickly build a WebSocket service. The
usage method is as follows

```php
use Co\Net;
use Psc\Library\Net\WebSocket\Server\Connection;

use function Co\run;

include __DIR__ . '/../vendor/autoload.php';

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
    echo 'Connection closed' . \PHP_EOL;
});

run();
```
