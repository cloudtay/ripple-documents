---
title: Manual Integration - Professional
description: PRipple is a high-performance native PHP coroutine framework designed to handle high-concurrency, complex network communications and data operations. This document will introduce how to manually integrate PRipple into a Laravel project.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Overview

If you are already familiar with the basic concepts and usage of PRipple, then you may want to know more details about
PRipple, or want to make some customized configurations for PRipple.
At this time, you can achieve these purposes by manually building PRipple. This document will use Laravel as an example
to introduce how to manually integrate PRipple.

### Install dependencies

```php
composer require cclilshy/p-ripple-core
```

### Laravel integration

> Modify the entry file `index.php`

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

\P\async(function(){
    // Bootstrap Laravel and handle the request...
    (require_once __DIR__.'/../bootstrap/app.php')
        ->handleRequest(Request::capture());
});

\P\tick();
```

> In the above example, we included Laravel's startup process in PRipple's coroutine context, and finally called
> the `\P\tick()` function to handle all asynchronous events triggered during Laravel's running process.
> Through this method, you can add PRipple asynchronous support to Laravel, and it can run perfectly in FPM/CGI mode.
> Applications developed in this environment can run in PRipple service mode with compatibility when needed to achieve a
> leap in performance.
