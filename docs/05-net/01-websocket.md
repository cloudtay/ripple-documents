---
title: websocket
---

### 概述

PRipple提供了一个易用的WebSocketServer组件,可以用于快速构建一个WebSocket服务,使用方法如下

```php
use P\Net;
use Psc\Library\Net\WebSocket\Server\Connection;

use function P\run;

include __DIR__ . '/../vendor/autoload.php';

$context = \stream_context_create([
    'socket' => [
        'so_reuseport' => true,
        'so_reuseaddr' => true,
    ],
]);

$server            = Net::WebSocket()->server('ws://127.0.0.1:8001', $context);
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


