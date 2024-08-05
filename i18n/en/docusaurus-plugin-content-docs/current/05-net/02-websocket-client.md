---
title: websocket-client
description: PRipple supports operating WebSocket through the \P\Net::WebSocket() method, which is used to handle WebSocket client connections.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'WebSocket', 'Net']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Overview

PRipple provides an easy-to-use WebSocketClient component that can be used to create WebSocket client connections.

```php
use P\Net;
use Psc\Library\Net\WebSocket\Client\Connection;
use function P\run;

$connection = Net::WebSocket()->connect('wss://echo.websocket.org');
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
