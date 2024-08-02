---
title: 信号 - \P\signal
---

### API

```php
namespace P;

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

返回事件唯一标识, 允许使用\P\cancel方法取消事件

### 概述

> PRipple允许你通过`onSignal`方法监听系统信号, 并在信号触发时执行指定的闭包函数。

### 基础用法

```php
\P\onSignal(SIGINT, function () {
    echo 'signal received';
    exit(0);
});
```

### 注意事项

> 注册任何信号处理器之后,如未正确取消信号处理器的情况下, \P\tick会认为有未完成的事件,并将会一直等待,直到所有事件完成。
