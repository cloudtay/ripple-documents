---
title: 信号 - \Co\signal
description: PRipple中Signal (信号) 是PRipple框架中的一个核心概念，用于处理系统信号。Signal对象代表一个系统信号的触发，以及其处理器。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', '信号', 'Signal']
---

### API

```php
namespace Co;

function onSignal(int $signalCode,Closure $closure): string;
```

#### 参数说明

| 参数          | 类型      | 说明              |
|-------------|---------|-----------------|
| $signalCode | int     | 信号码             |
| $closure    | Closure | 信号处理器,在事件上下文中运行 |

#### 闭包参数

| 参数          | 类型  | 说明  |
|-------------|-----|-----|
| $signalCode | int | 信号码 |

#### 返回值

返回事件唯一标识, 允许使用\Co\cancel方法取消事件

### 概述

> PRipple允许你通过`onSignal`方法监听系统信号, 并在信号触发时执行指定的闭包函数。

### 基础用法

```php
\Co\onSignal(SIGINT, function () {
    echo 'signal received';
    exit(0);
});
```

### 注意事项

> 注册任何信号处理器之后,如未正确取消信号处理器的情况下, \Co\tick会认为有未完成的事件,并将会一直等待,直到所有事件完成。
