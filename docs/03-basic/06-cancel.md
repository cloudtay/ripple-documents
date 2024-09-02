---
title: 撤销 - \Co\cancel
description: Cancel (撤销) , 用于撤销一个事件, 通常用于取消异步任务, 支持撤销所有定义的运行上下文为独立纤程的事件。如`delay`, `repeat`, `onSignal`, `defer`等
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', '撤销', '取消', '异步任务']
---

### API

```php
namespace Co;

function cancel(string $eventId): string;
```

#### 参数说明

| 参数       | 类型     | 说明    |
|----------|--------|-------|
| $eventId | string | 事件标识符 |

#### 返回值

无

### 概述

> Cancel (撤销) , 用于撤销一个事件, 通常用于取消异步任务, 支持撤销所有定义的运行上下文为独立纤程的事件。如
> `delay`, `repeat`, `onSignal`, `defer`等

### 基础用法

```php
$repeatId = \Co\repeat(function () {
    echo 'delay task' . PHP_EOL;
}, 1);

$signalId = \Co\onSignal(SIGINT, function () {
    echo 'signal task' . PHP_EOL;
});


// 在10秒后撤销信号任务
\Co\delay(fn() => \Co\cancel($signalId), 10);

// 在5秒后撤销重复任务
\Co\delay(fn() => \Co\cancel($repeatId), 5);


$delayId = \Co\delay(function () {
    echo 'delay task' . PHP_EOL;
}, 10);

// 在发生前提前撤销任务
\Co\cancel($delayId);
```

#### 注意事项

> 你无法撤销一个已经执行的事件, 你只能撤销一个未执行的事件, 除repeat/signal外,
> 其他事件都是一次性事件, 一旦执行完毕就会被自动销毁。如果没有特殊需求, 你无需手动撤销事件。
