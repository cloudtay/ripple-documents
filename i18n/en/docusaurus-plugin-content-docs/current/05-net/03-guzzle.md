---
title: Guzzle client
description: ripple provides an easy-to-use HttpClient component that can be used to create HTTP client connections. It also supports features such as long connection pool and coroutine scheduling.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'HttpClient', 'Net' ]
---

### Overview

Ripple provides an easy-to-use HttpClient component that can be used to create Http client connections.

### Usage examples

```php
$client = \Ripple\Http\Guzzle::newClient();
$client->get('https://www.baidu.com/');
wait();
```
