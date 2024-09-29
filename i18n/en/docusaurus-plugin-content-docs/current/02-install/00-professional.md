---
title: Manual Integration - Professional
description: Ripple is a high-performance native PHP coroutine framework designed to handle high-concurrency, complex network communications and data operations. This document will introduce how to manually integrate Ripple into a Laravel project.
keywords: ['Ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency']
---

### Overview

If you are already familiar with the basic concepts and usage of Ripple, then you may want to know more details about
Ripple, or want to make some customized configurations for Ripple.
At this time, you can achieve these purposes by manually building Ripple. This document will use Laravel as an example
to introduce how to manually integrate Ripple.

### Install dependencies

```php
composer require cclilshy/p-ripple-core
```

### Laravel integration

> Modify the entry file `index.php`

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

\Co\tick();
```

In the above example, we included Laravel's startup process in Ripple's coroutine context.
And at the end, the `\Co\tick()` function is called to create another coroutine space to handle asynchronous events used
in Laravel.
Through this method, you can add Ripple asynchronous support to Laravel, and it can run perfectly in FPM/CGI mode.
Applications developed in this environment can run in Ripple service mode with compatibility when needed to achieve a
leap in performance.
