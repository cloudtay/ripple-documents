---
title: websocket-client
description: ripple supports operating WebSocket through the \Co\Net::WebSocket() method, which is used to handle WebSocket client connections.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'WebSocket', 'Net' ]
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### Overview

ripple provides an easy-to-use WebSocketClient component that can be used to create WebSocket client connections.

```php
use Co\Net;
use Ripple\Library\Net\WebSocket\Client\Connection;
use function Co\run;

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
