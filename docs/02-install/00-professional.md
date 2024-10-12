---
title: 手动集成
description: ripple是一个高性能的原生PHP协程框架，旨在处理高并发、复杂的网络通信和数据操作。本文档将介绍如何手动集成ripple到Laravel项目中。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发' ]
---

### 概述

如果你已经熟悉了ripple的基本概念和使用方法，那么你可能会想要了解ripple的更多细节，或者想要对ripple进行一些定制化的配置。
这时候，你可以通过手动构建ripple来实现这些目的。该文档将以Laravel为例，介绍如何手动集成ripple。

### 安装依赖

```php
composer require cloudtay/ripple
```

### Laravel集成

> 修改入口文件 `index.php`

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

上述例子中我们将Laravel的启动过程包含在了ripple的协程上下文中,
并在最后调用了`\Co\wait()`函数来创建另一个协程空间以处理Laravel中用到的异步事件,
通过该方法即可为Laravel添加ripple的异步支持,并能够完美在FPM/CGI模式下运行,
在此环境下开发的应用,可以在需要时兼容性地以Ripple服务模式运行达到性能质的飞跃.
