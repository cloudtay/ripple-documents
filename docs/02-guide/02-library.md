---
title: 模块
description: ripple所有的支持库都处于`Co`命名空间下,并根据它所属的模块进行了划分,目前支持库有以下几个模块
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发' ]
---

## 介绍

ripple所有的支持库都处于`Co`命名空间下,并根据它所属的模块进行了划分,目前支持库有以下几个模块:

- `Co\IO` 流资源操作模块
- `Co\System` 系统操作模块

你可以通过以下方式访问支持库并使用,如

```php
use \Co\IO;

$fileUtil = IO::File();
$content = $fileUtil->getContent('file.txt');
```

```php
$channel = \Co\IO::Socket()->connect('tcp://www.baidu.com:80');
$channel->send('hello world');
```
