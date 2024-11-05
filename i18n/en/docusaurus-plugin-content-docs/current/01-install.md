---
sidebar_position: 2
title: 🔧 Installation Tutorial
description: ripple is a high-performance native PHP coroutine framework designed to handle high-concurrency, complex network communications and data operations. This document will introduce how to manually integrate ripple into a Laravel project.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency' ]
---

### Install engine

```php
composer require cloudtay/ripple
```

### [FPM] Universal installation method

Taking laravel as an example, modify the entry file `index.php` to achieve
Include Laravel's startup process in ripple's coroutine context
And at the end, the `\Co\wait()` function is called to create another coroutine space to handle asynchronous events used
in Laravel

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
composer require cloudtay/ripple-driver # Install driver
php artisan vendor:publish --tag=ripple-config # Publish configuration file
php artisan ripple:server # Start service
```

Applicable configuration items

> Modify `.env` configuration file

| Configuration items | Description | Default value |
|--------------------|-------------|-------------- ----------|
| `RIP_HTTP_LISTEN` | HTTP service listening address | `http://127.0.0.1:8008` |
| `RIP_HTTP_WORKERS` | Number of HTTP service processes | `4` |
| `RIP_HTTP_RELOAD` | HTTP service hot reload switch | `false` |

### [CLI] ThinkPHP

```bash
composer require cloudtay/ripple-driver # Install driver
php think ripple:server # Start service
```

> Modify `.env` configuration file

| Configuration items | Description | Default value |
|--------------------|-------------|-------------- ----------|
| `RIP_HTTP_LISTEN` | HTTP service listening address | `http://127.0.0.1:8008` |
| `RIP_HTTP_WORKERS` | Number of HTTP service processes | `4` |
| `RIP_HTTP_RELOAD` | HTTP service hot reload switch | `false` |

### [CLI] Workerman

> Install driver

```bash
composer require cloudtay/workerman-ripple # Install driver
```

> Configure before starting the service

```php
Worker::$eventLoopClass = \Ripple\Drive\Workerman\Driver4::class;
Worker::runAll();
```

### [CLI] Webman

> Modify the configuration file `config/server.php` service configuration file

```php
return [
    //...
    'event_loop' => \Workerman\Ripple\Driver::class,
];
```
