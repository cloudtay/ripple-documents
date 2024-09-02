---
title: 异步 - \Co\async
description: PRipple中Async (异步) 是PRipple框架中的一个核心概念，用于处理异步操作。Async对象代表一个异步操作的最终完成或失败，以及其结果值。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', '异步', 'Async']
tags: ['异步', 'Async']
---

### API

```php
namespace Co;

function async(Closure $closure): Promise;
```

#### 参数说明

| 参数       | 类型      | 说明                 |
|----------|---------|--------------------|
| $closure | Closure | 入口闭包函数,立即在协程上下文中运行 |

#### 闭包参数

| 参数       | 类型      | 说明   |
|----------|---------|------|
| $resolve | Closure | 解决期约 |
| $reject  | Closure | 拒绝期约 |

### 概述

> Async (异步操作) 是PRipple框架实现中协程的核心概念之一, 基于Promise机制管理状态, 扩展了协程的异步操作能力。

### 用法

使用该方法可以创建一个Promise对象

```php
$promise = \Co\async(Closure $callback): Promise
```

> PRipple同样会为提交的闭包函数提供两个参数，一个是`resolve`回调函数，一个是`reject`回调函数。
> 通过使用这两个回调函数，来对一份承诺进行解决或者拒绝。 不同于`promise`方法, `async`中支持更多的异步操作。
> 并且使用`async`方法通常不需要显性地处理`resolve`,`reject`, 它会在运行过程中自动解决期约,

#### 示例

```php
\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task 1';
});

\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task 2';
});

\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task 3';
});
```

> 上述例子中, async中的代码会立即执行,并且在遇到`\Co\sleep`时, 会自动挂起当前协程, 处理器会在挂起期间执行其他协程,
> 直到挂起的协程被唤醒。而不会阻塞其他协程的执行。

#### 自动解决期约

> 通常情况下, `async`方法会自动解决期约

- 当闭包内发生异常时, 会自动拒绝期约
- 当闭包内发生返回值时, 会自动解决期约
- 当闭包正常执行完毕时, 会自动解决期约(null)

```php
$promise = \Co\async(function () {
    \Co\sleep(1);
    
    if(rand(0,1) === 1){
        throw new Exception('error');
    }
    return 'success';
});
```

> 注意:在某些情况下, 你可能需要手动解决期约

```php
$promise = \Co\async(function ($resolve, $reject) {
    \Co\sleep(1);
    
    if(rand(0,1) === 1){
        $reject(new Exception('error'));
    }
    $resolve('success');
    
    // 此处的代码会被执行, 但不会影响期约的状态
    return 'done';
});
```

### Await

> sleep的实现是最好的协程序例子, 但是在实际开发中, 我们可能需要应对更多场景, 如

```php
function httpGet(string $url) : Promise {
    return \Co\Net::Http()->Gullze()->getAsync($url);
}

\Co\async(function(){
    $response = \Co\await(httpGet('http://example.com'));
    
    echo $response->getBody()->getContent();
});
```

### 注意事项

`await`只能在`async`中使用, 且只能等待`Promise`对象。在闭包之外你可以这样:

```php
function httpGet(string $url) : Promise {
   return \Co\Net::Http()->Gullze()->getAsync($url);
}


httpGet('http://example.com')->then(function($response){
    echo $response->getBody()->getContent();
});
```

### 提示

> 在PRipple提供的脚手架中,绝大多数框架的控制器请求都会发生在async空间中, 你可以在控制器中使用`async`方法来处理异步操作。

