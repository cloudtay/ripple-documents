---
title: Stream
description: ripple supports operating streams through the \Co\IO::Stream() method, which is used to process stream read and write operations.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'stream', 'IO' ]
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### Overview

Stream in ripple is an event-based data stream, which can be used to process large amounts of data, such as file
reading, network requests, etc.
All Streams implement StreamInterface under the PSR specification, and also encapsulate multiple commonly used
monitoring stream methods such as

Subscribed readable and writable events, all closures are in the event runtime context, and the closure will receive two
parameters

- Stream $stream current stream object
- Closure $cancel cancels the subscription closure

```php
Closure(Stream $stream,Closure $cancel);
```

### Subscribe to readable events

```php
public function onReadable(Closure $closure): string;

$stream = \Co\IO::File()->open('file.txt');
$stream->onReadable(function (Stream $stream,Closure $cancel) {
    $data = $stream->read(1024);
    echo $data .PHP_EOL;
    
    //unsubscribe
    $cancel();
});
```

### Subscribe to writable events

```php
public function onWritable(Closure $closure): string;
```

### Subscribe to the closing event

```php
public function onClose(Closure $closure): void;
```

### Precautions

A stream allows multiple subscriptions to exist at the same time, and they will all be executed, but for read/write
operations,
This usually doesn't make sense because the first subscriber will consume the data, making it impossible for subsequent
subscribers to read it.
