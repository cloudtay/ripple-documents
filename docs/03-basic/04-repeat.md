---
title: 重做 - \P\repeat
---

### API

```php
namespace P;

function repeat(Closure $closure,int|float $second): string;
```

#### 参数说明

| 参数       | 类型      | 说明                  |
|----------|---------|---------------------|
| $closure | Closure | 重复执行的闭包函数,在运行在事件上下文 |

#### 闭包参数

| 参数      | 类型      | 说明            |
|---------|---------|---------------|
| $cancel | Closure | 取消当前重复任务的回调函数 |

### 概述

> Repeat (重复执行) , 指定频率重复做某事, 通常用于定时任务等场景。
> PRipple会为你提交的闭包函数提供一个`cancel`回调函数, 通过调用`cancel`函数可以取消当前的重复任务。

### 基础用法

```php
\P\repeat(function (Closure $cancel) {
    echo 'delay task';
    
    
    if(rand(1, 10) === 10){
        $cancel();
    }
}, 1);

\P\tick(); // 等待所有事件执行完成
```

注意: `repeat`方法会在指定的时间间隔内重复执行闭包函数, 直到`cancel`函数被调用。

```php
\P\repeat(function (Closure $cancel) {
    \P\sleep(10);
    
    echo 'delay task';
    
    $cancel();
}, 1);

\P\tick();
```

> 上述例子中, repeat中的代码会在1秒后执行, 并且在遇到`\P\sleep`时, 会自动挂起当前协程, 但`repeat`仍然会在1秒后再次执行。
