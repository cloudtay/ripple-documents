---
title: \Co\wait
description: \Co\wait函数用于触发所有事件, ripple会开始执行所有事件, 直到空闲为止。
---

### API

```php
namespace Co;

function tick(): void;
```

#### 参数说明

无

#### 返回值

无

### 概述

> 在声明一系列操作后,可以通过\Co\sleep函数来等待协程执行,否则程序将会直接结束, 又或者你可以通过
> 调用`\Co\wait`函数, ripple会开始执行所有事件, 直到空闲为止。

### 基础用法

```php
\Co\defer(function () {
    //TODO: do something
});

\Co\wait(); // 等待所有事件执行完成
```

### 扩展例子

> 在Laravel在CGI/FPM模式中中使用ripple只需要在结束时声明一个触发器即可

```php
<?php

use Illuminate\HttCo\Request;

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

### 注意事项

> 当注册的事件中存在信号处理器/流监听器时,如果没有解除信号处理器/流监听器, ripple会认为有未完成的事件,并将会一直等待,直到所有事件完成。
