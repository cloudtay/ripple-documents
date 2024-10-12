---
title: 🎓 advanced
description: ripple框架中的高级用法, 包括异步操作, 信号处理, 睡眠, 期约机制等。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发', '异步', '信号', '睡眠', '期约' ]
---

### API

```php
namespace Co;

function forked(Closure $closure): int;
function cancelForked(int $index): void;
```

### 概述

> 在ripple中, 你可以通过`forked`方法注册一个在进程fork之后发生的事件, 并在fork之后的子进程中执行指定的闭包函数。
> 所有的fork事件都会在fork之后的子进程中执行, 且注册的处理器会在执行之后被遗忘。

### 基础用法

```php
\Co\forked(function () {
    \Co\repeat(function () {
        echo 'repeat task';
    }, 1);
});

$task = \Co\System::Process()->task(function () {
    echo 'fork task';
});

$runtime = $task->run();
$runtime->await();
```

### 注意事项

> 使用task创建子进程可以将耗时任务放到子进程中执行, 以避免阻塞主进程。子进程会继承父进程的所有资源,
> 但会忘记所有事件处理器, 包括`forked`注册的事件处理器。因此子进程中需要重新注册事件处理器。
