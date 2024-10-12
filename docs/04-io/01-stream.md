---
title: 流 (Stream)
description: ripple中支持通过\Co\IO::Stream()方法操作流, 用于处理流读写操作。
keywords: ['ripple', 'PHP', '协程', '高性能', '高并发', '流', 'IO']
---

### 概述

ripple中Stream是一个基于事件的数据流，它可以用于处理大量的数据，例如文件读取、网络请求等。
所有的Stream都实现了PSR规范下的StreamInterface, 另外封装了多个常用的监听流方法如

订阅的可读可写事件,所有闭包都所处于事件运行时上下文，并且闭包中会收到两个参数

- Stream $stream 当前流对象
- Closure $cancel 取消订阅的闭包

```php
Closure(Stream $stream,Closure $cancel);
```

### 订阅可读事件

```php
public function onReadable(Closure $closure): string;

$stream = \Co\IO::File()->open('file.txt');
$stream->onReadable(function (Stream $stream,Closure $cancel) {
    $data = $stream->read(1024);
    echo $data . PHP_EOL;
    
    //取消订阅
    $cancel();
});
```

### 订阅可写事件

```php
public function onWritable(Closure $closure): string;
```

### 订阅关闭事件

```php
public function onClose(Closure $closure): void;
```

### 注意事项

一个流允许同时存在多个订阅,并且他们都会被执行,但对于读/写操作来说,
这样做通常没有意义,因为第一个订阅者会消耗掉数据,导致后续订阅者无法读取数据。
