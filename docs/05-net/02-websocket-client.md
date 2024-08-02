---
title: websocket-client
---

### 概述

PRipple提供了一个易用的WebSocketClient组件,可以用于创建WebSocket客户端连接。

```php
use P\Net;
use Psc\Library\Net\WebSocket\Client\Connection;
use function P\run;

$connection            = Net::WebSocket()->connect('wss://echo.websocket.org');
$connection->onOpen(function (Connection $connection) {
    $connection->send('{"action":"ping","data":[]}');
});

$connection->onMessage(function (string $data, Connection $connection) {
    echo 'Received: ' . $data . \PHP_EOL;
});

$connection->onClose(function (Connection $connection) {
    echo 'Connection closed' . \PHP_EOL;
});

run();
```


