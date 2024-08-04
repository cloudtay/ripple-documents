---
title: 运行机制 - Runtime
description: 在PRipple中,所有define的异步闭包都由EventLoop驱动, PRipple对任何一个闭包的发生运行时都会特别声明与严格把控, 所有对于插件/组件的开发者也应该关心这点,防止闭包发生进程/纤程逃逸,运行黑洞的情况
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发']
---

### 介绍

在PRipple中,所有define的异步闭包都由EventLoop驱动, EventLoop将会在恰当的时候运行指定事件, 开发者无需过于关心EventLoop的处理机制,
只需做好流程的控制, 不同的闭包可能会在不同的`上下文空间`中被执行, 开发过程中应该注意这些上下文空间的约束

PRipple对任何一个闭包的发生运行时都会特别声明与严格把控, 所有对于插件/组件的开发者也应该关心这点,防止闭包发生进程/纤程逃逸,
运行黑洞的情况

### 主程运行时

> 框架的的使用者几乎不用关心该运行时,因为开发者的代码通常运行在`事件运行时`与`协程运行时`上下文

进程的入口点, 构建PRipple的过程即是主程运行时, 它发生在PRipple驱动机之前, 以Laravel的入口文件为例子

```php
<?php
use Illuminate\Http\Request;
define('LARAVEL_START', microtime(true));
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}
require __DIR__.'/../vendor/autoload.php';

//TODO: 主程运行时
\P\async(function(){
    //TODO: 协程运行时,包括 Laravel中间件/服务提供者/控制器 等运行过程都处于协程序空间中
    (require_once __DIR__.'/../bootstrap/app.php')
        ->handleRequest(Request::capture());
});

# 启动PRipple
\P\tick();
```

---

### 事件运行时

> 兼容所有异步操作

### 协程运行时

> 兼容所有异步操作
