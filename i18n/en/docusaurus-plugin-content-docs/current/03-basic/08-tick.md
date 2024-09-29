---
title: trigger - \Co\tick
description: The \Co\tick function is used to trigger all events. Ripple will start executing all events until it is idle.
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace Co;

function tick(): void;
```

#### Parameter Description

none

#### return value

none

### Overview

> After declaring a series of operations, you can use the \Co\sleep function to wait for the coroutine to execute,
> otherwise the program will end directly, or you can use
> Call the `\Co\tick` function, Ripple will start executing all events until it is idle.

### Basic usage

```php
\Co\defer(function () {
    //TODO: do something
});

\Co\tick(); // Wait for all events to complete
```

### Extended example

> To use Ripple in CGI/FPM mode with Laravel just declare a trigger at the end

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

### Precautions

> When there is a signal processor/stream listener in the registered event, if the signal processor/stream listener is
> not released, Ripple will consider that there are unfinished events and will wait until all events are completed.
