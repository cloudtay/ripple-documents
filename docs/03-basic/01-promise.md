---
title: 期约 - \P\promise
description: Promise (承诺/期约机制) 是PRipple框架中的一个核心概念，用于处理异步操作。Promise对象代表一个异步操作的最终完成或失败，以及其结果值。相对于Future, Promise提供了更直观的API, 更容易理解和使用。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', '期约机制', 'Promise','承诺机制']
---

### API

```php
namespace P;

function promise(Closure $closure): Promise;
```

#### 参数说明

| 参数       | 类型      | 说明                 |
|----------|---------|--------------------|
| $closure | Closure | 入口闭包函数,立即在当前上下文中运行 |

#### 闭包参数

| 参数       | 类型      | 说明   |
|----------|---------|------|
| $resolve | Closure | 解决期约 |
| $reject  | Closure | 拒绝期约 |

#### 返回值

返回一个`Promise`对象

### 概述

Promise (承诺/期约机制) 是PRipple框架中的一个核心概念，用于处理异步操作。Promise对象代表一个异步操作的最终完成或失败，以及其结果值。
相对于Future, Promise提供了更直观的API, 更容易理解和使用。

### 用法

> 使用该方法可以创建一个Promise对象

```php
$promise = \P\promise(Closure $callback): Promise
```

> PRipple会为你提交的闭包函数提供两个参数，一个是`resolve`回调函数，一个是`reject`回调函数。
> 通过使用这两个回调函数，来对一份期约进行解决或者拒绝。

```php
$promise = \P\promise(function ($resolve, $reject) {
    $resolve('success'); // 解决一个期约
    
    // $reject('error'); // 拒绝一个期约
    
    //TODO: 更多操作...
});
```

### Promise状态

> 一个Promise对象有三种状态：

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

> 一个Promise对象只能从`pending`状态，转换为`fulfilled`或`rejected`状态。
> 一旦转换为`fulfilled`或`rejected`状态，就不能再次转换为其他状态。

```php
$promise = \P\promise(function ($resolve, $reject) {
    //TODO: 读取文件/网络请求/数据库查询等异步操作...

    $resolve('success'); // 解决一个期约
});

// 当期约解决时, 会触发then方法中的回调函数
$promise->then(function (mixed $result) {
    echo $value;
});

// 当期约拒绝时, 会触发catch方法中的回调函数
$promise->catch(function (Exception $e) {
    echo $reason;
});

$promise->await(); // 等待期约解决
```

### 注意事项

`resolve`和`reject`只会改变Promise的状态和结果,不会阻止后续的代码执行。
