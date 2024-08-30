---
title: http-client
description: PRipple提供了一个易用的HttpClient组件,可以用于创建HTTP客户端连接。并支持长连接池、协程调度等特性。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', 'HttpClient', 'Net']
---

### 概述

PRipple提供了一个易用的HttpClient组件,可以用于创建Http客户端连接。

### 使用例子

```php
use GuzzleHttp\Psr7\Request;
use Psc\Library\Net\Http\Client\HttpClient;
use Psr\Http\Message\RequestInterface;

use function P\async;
use function P\await;
use function P\tick;

async(function () {
    $httpClient = new HttpClient([
        'pool' => 1 // 开启连接池,对于频繁请求的场景可以提高性能
    ]);

    // 创建一个 Psr\Http\Message\RequestInterface 对象
    $request = new class ('GET', 'https://www.baidu.com') extends Request implements RequestInterface {};

    // 交由 HttpClient 处理,返回一个 Psr\Http\Message\ResponseInterface 对象
    $response = await(
        $httpClient->request($request)
    );
});

tick();
```


