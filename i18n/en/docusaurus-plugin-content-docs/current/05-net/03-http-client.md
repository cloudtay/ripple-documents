---
title: http-client
description: Ripple provides an easy-to-use HttpClient component that can be used to create HTTP client connections. It also supports features such as long connection pool and coroutine scheduling.
keywords: ['Ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'HttpClient', 'Net']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Overview

Ripple provides an easy-to-use WebSocketClient component that can be used to create WebSocket client connections.

### Usage examples

```php
use GuzzleHttCo\Psr7\Request;
use Psc\Library\Net\HttCo\Client\HttpClient;
use Psr\HttCo\Message\RequestInterface;

use function Co\async;
use function Co\await;
use function Co\tick;

async(function () {
    $httpClient = new HttpClient([
        'pool' => 1 // Turn on the connection pool, which can improve performance in scenarios with frequent requests.
    ]);

    //Create a Psr\HttCo\Message\RequestInterface object
    $request = new class ('GET', 'https://www.baidu.com') extends Request implements RequestInterface {};

    //Leave it to HttpClient for processing and return a Psr\HttCo\Message\ResponseInterface object
    $response = await(
        $httpClient->request($request)
    );
});

tick();
```
