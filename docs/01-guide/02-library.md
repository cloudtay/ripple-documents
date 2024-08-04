---
title: 模块 - Library
description: PRipple所有的支持库都处于`P`命名空间下,并根据它所属的模块进行了划分,目前支持库有以下几个模块
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发']
---

## 介绍

PRipple所有的支持库都处于`P`命名空间下,并根据它所属的模块进行了划分,目前支持库有以下几个模块:

- `P\Net` 网络操作模块
- `P\IO` 流资源操作模块
- `P\System` 系统操作模块
- `P\Util` 工具模块
- `P\Plugin` 插件模块
- `P\Coroutine` 协程模块

你可以通过以下方式访问支持库并使用,如

```php
use \P\IO;

$fileUtil = IO::File();
$fileUtil->getContent('file.txt');
```

> 也支持链式调用如

```php
$channel = \P\IO::Channel()->open('master');
$channel->send('hello world');
```
