---
title: 延迟 - \P\delay
description: PRipple中支持通过\P\delay方法延迟执行一个闭包函数, 用于处理异步操作。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', '延迟', '异步']
---

### API

```php
namespace P;

function delay(Closure $closure,int|float $second): string;
```

#### 参数说明

| 参数       | 类型               | 说明                   |
|----------|------------------|----------------------|
| $closure | Closure          | 延迟执行的闭包函数,在运行在事件上下文  |
| $second  | int     \| float | 延迟时间,单位秒,支持小数精度为0.1秒 |

#### 闭包参数

无

#### 返回值

返回事件唯一标识, 允许使用\P\cancel方法取消事件

### 概述

> Delay (延迟执行) , 在一定时间后执行一个闭包函数, 用于处理异步操作。

### 基础用法

```php
\P\delay(function () {
    echo 'delay task';
}, 1);

\P\sleep(10); // 挂起主程10秒以便其他协程能够完成任务
```

#### 提示

> 在PRipple提供的脚手架中,绝大多数框架的控制器请求都会发生在async空间中, 你可以在控制器中使用`\P\delay`方法
