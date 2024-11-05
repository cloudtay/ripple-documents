---
sidebar_position: 2
title: 🔧 安装教程
description: ripple是一个高性能的原生PHP协程框架，旨在处理高并发、复杂的网络通信和数据操作。本文档将介绍如何手动集成ripple到Laravel项目中。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发' ]
---

### 安装引擎

```php
composer require cloudtay/ripple
```

### [FPM] 通用安装方式

以laravel为例,修改入口文件 `index.php`实现  
将Laravel的启动过程包含在了ripple的协程上下文中  
并在最后调用了`\Co\wait()`函数来创建另一个协程空间以处理Laravel中用到的异步事件

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

\Co\async(function(){
    // Bootstrap Laravel and handle the request...
    (require_once __DIR__.'/../bootstrap/app.php')
        ->handleRequest(Request::capture());
});

\Co\wait();
```

### [CLI] Laravel

```bash
composer require cloudtay/ripple-driver # 安装驱动
php artisan vendor:publish --tag=ripple-config # 发布配置文件
php artisan ripple:server # 启动服务
```

适用配置项

> 修改`.env`配置文件

| 配置项                | 说明          | 默认值                     |
|--------------------|-------------|-------------------------|
| `RIP_HTTP_LISTEN`  | HTTP服务监听地址  | `http://127.0.0.1:8008` |
| `RIP_HTTP_WORKERS` | HTTP服务进程数   | `4`                     |
| `RIP_HTTP_RELOAD`  | HTTP服务热重载开关 | `false`                 |

### [CLI] ThinkPHP

```bash
composer require cloudtay/ripple-driver # 安装驱动
php think ripple:server # 启动服务
```

> 修改`.env`配置文件

| 配置项                | 说明          | 默认值                     |
|--------------------|-------------|-------------------------|
| `RIP_HTTP_LISTEN`  | HTTP服务监听地址  | `http://127.0.0.1:8008` |
| `RIP_HTTP_WORKERS` | HTTP服务进程数   | `4`                     |
| `RIP_HTTP_RELOAD`  | HTTP服务热重载开关 | `false`                 |

### [CLI] Workerman

> 安装驱动

```bash
composer require cloudtay/workerman-ripple # 安装驱动
```

> 在启动服务前配置

```php
Worker::$eventLoopClass = \Ripple\Drive\Workerman\Driver4::class;
Worker::runAll();
```

### [CLI] Webman

> 修改配置文件`config/server.php`服务配置文件

```php
return [
    //...
    'event_loop' => \Workerman\Ripple\Driver::class,
];
```
