---
title: \Co\wait
description: The \Co\wait function is used to trigger all events, and ripple will start executing all events until it is idle.
---

###API

```php
namespace Co;

function wait(): void;
```

#### Parameter description

none

#### Return value

none

### Overview

> After declaring a series of operations, you can use the \Co\sleep function to wait for the coroutine to execute,
> otherwise the program will end directly, or you can use
> Call the `\Co\wait` function, ripple will start executing all events until it is idle.

### Basic usage

```php
\Co\defer(function () {
    //TODO: do something
});

\Co\wait(); // Wait for all events to complete
```

### Extended example

> To use ripple in CGI/FPM mode with Laravel just declare a trigger at the end

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

### Notes

> When there is a signal processor/stream listener in the registered event, if the signal processor/stream listener is
> not released, ripple will think that there are unfinished events and will wait until all events are completed.
