---
title: Guzzle客户端
description: ripple提供了一个易用的HttpClient组件,可以用于创建HTTP客户端连接。并支持长连接池、协程调度等特性。
keywords: ['ripple', 'PHP', '协程', '高性能', '高并发', 'HttpClient', 'Net']
---

### 概述

ripple提供了一个易用的HttpClient组件,可以用于创建Http客户端连接。

### 使用例子

```php
$client = \Ripple\Http\Guzzle::newClient();
$client->get('https://www.baidu.com/');
wait();
```


