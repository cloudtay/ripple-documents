---
title: http-client
description: PRipple provides an easy-to-use HttpClient component that can be used to create HTTP client connections. It also supports features such as long connection pool and coroutine scheduling.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'HttpClient', 'Net']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Overview

PRipple provides an easy-to-use WebSocketClient component that can be used to create WebSocket client connections.

### Usage examples

```php
use GuzzleHttp\Psr7\Request;
use Psc\Library\Net\Http\Client\HttpClient;
use Psr\Http\Message\RequestInterface;

use function P\async;
use function P\await;
use function P\tick;

async(function () {
    $httpClient = new HttpClient([
        'pool' => 1 // Turn on the connection pool, which can improve performance in scenarios with frequent requests.
    ]);

    //Create a Psr\Http\Message\RequestInterface object
    $request = new class ('GET', 'https://www.baidu.com') extends Request implements RequestInterface {};

    //Leave it to HttpClient for processing and return a Psr\Http\Message\ResponseInterface object
    $response = await(
        $httpClient->request($request)
    );
});

tick();
```
