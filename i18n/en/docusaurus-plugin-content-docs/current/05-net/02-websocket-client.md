---
title: WebSocket Client
description: Ripple supports operating WebSocket through the \Co\Net::WebSocket() method, which is used to handle WebSocket client connections.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'WebSocket', 'Net' ]
---

### Overview

Ripple provides an easy-to-use WebSocketClient component that can be used to create WebSocket client connections.

```php
use Ripple\WebSocket\Client;
use function Co\wait;

$connection = new Client('wss://echo.websocket.org');
$connection->onOpen(function (Connection $connection) {
    $connection->send('{"action":"ping","data":[]}');
});

$connection->onMessage(function (string $data, Connection $connection) {
    echo 'Received: ' . $data . \PHP_EOL;
});

$connection->onClose(function (Connection $connection) {
    echo 'Connection closed' .\PHP_EOL;
});

wait();
```
