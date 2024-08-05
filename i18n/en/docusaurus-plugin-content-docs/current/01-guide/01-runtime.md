---
title: Runtime - Runtime
description: In PRipple, all defined asynchronous closures are driven by EventLoop. PRipple will specifically declare and strictly control the occurrence of any closure during runtime. All developers of plug-ins/components should also be concerned about this to prevent Closure occurs when process/fiber escapes and runs a black hole
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### introduce

In PRipple, all defined asynchronous closures are driven by EventLoop. EventLoop will run the specified event at the
appropriate time. Developers do not need to care too much about the processing mechanism of EventLoop.
As long as you control the process, different closures may be executed in different context spaces. You should pay
attention to the constraints of these context spaces during the development process.

PRipple will specifically declare and strictly control the occurrence of any closure at runtime. All developers of
plug-ins/components should also be concerned about this to prevent process/fiber escape of closures.
Running a black hole

### Main process running time

> Users of the framework hardly need to care about the runtime, because the developer's code usually runs in the context
> of `event runtime` and `coroutine runtime`

The entry point of the process. The process of building PRipple is the main process runtime. It occurs before the
PRipple driver. Take Laravel's entry file as an example.

```php
<?php
use Illuminate\Http\Request;
define('LARAVEL_START', microtime(true));
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}
require __DIR__.'/../vendor/autoload.php';

//TODO: When the main process is running
\P\async(function(){
    //TODO: When the coroutine is running, including Laravel middleware/service provider/controller and other running processes, they are all in the coroutine space.
    (require_once __DIR__.'/../bootstrap/app.php')
        ->handleRequest(Request::capture());
});

# Start PRipple
\P\tick();
```

---

### Event runtime

> Compatible with all asynchronous operations

### Coroutine runtime

> Compatible with all asynchronous operations
