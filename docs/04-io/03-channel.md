---
title: 信道 (Channel)
description: ripple中的Channel (信道) 是ripple框架中的一个核心概念，用于多个进程之间之间的通信。Channel对象代表一个数据通道, 用于多个进程之间之间的通信。
keywords: ['ripple', 'PHP', '协程', '高性能', '高并发', '信道', 'Channel']
---

### 访问组件

```php
use \Co\IO;

IO::Channel();
```

### API

```php
// 创建一个信道
public function make(string $name): Channel;
```

### 概述

> Channel (信道) , 是ripple中的一个数据通道，用于多个进程之间的通信。值得注意的是, ripple的Channel作用域为本机全局,
> 你可以像以下方式使用Channel


该Channel的读写是原子操作, 保证了数据的一致性

> 多个进程同时读时, 只有一个进程能够读取到数据, 其他进程会被阻塞, 直到数据被读取。若设定Channel为非堵塞管道,
> 则会返回null而不会抛出异常

> 多个进程同时写时,拿到写入锁的进程会将数据写入, 其他进程会被阻塞, 直到数据被写入。保证了数据的一致性。

### 例子

```php
$channel = \Co\IO::Channel()->make('common');

$task = \Co\System::Process()->task(function() use ($channel){
    $channel->setBloking(true);
    
    while($task = $channel->receive()){
        //TODO: consumption task
    });
});

// 运行10个子程序处理任务
for($i = 0; $i < 10; $i++){
    $task->run();
}

while(1){
    // TODO: do something
    $task->send('task');
}
```

### 场景举例

你还可以在多个应用程序之间使用Channel互相配合工作,如 Workerman+Laravel

> Workerman部分代码

```php
$worker = new Worker('websocket://127.0.0.1:2346');
$worker->onWorkerStart = function() {
    $channel = \Co\IO::Channel()->make('websocket');
    $channel->setBloking(false);
    
    Timer::add(1, function() use ($channel){
        if($message = $channel->receive()){
            // TODO: consumption task
        }
    });
}

Worker::$eventLoopClass = Driver::class;
Worker::runAll();
```

> Laravel控制器部分代码

```php
public function index(Request $request) : JsonResponse
{
    $channel = \Co\IO::Channel()->make('websocket');
    $channel->send($request->query('message'));
    return new JsonResponse(['status' => 'ok']);
}
```

### 注意事项

Channel的通信数据基于PHP序列化序列化, 支持传输对象/数组/字符串等数据类型, 但不支持传输资源等不可序列化的数据类型。
可以传输对象,但要确保目标进程有相同的类定义。否则将无法反序列化成功。
