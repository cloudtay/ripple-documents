---
title: \Co\repeat
description: ripple supports repeatedly executing a closure function through the \Co\repeat method, which is used to handle scenarios such as scheduled tasks. ripple will provide a `cancel` callback function for the closure function you submit. By calling the `cancel` function, you can cancel the current repeated task.
keywords: ['ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'redo', 'scheduled task']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### API

```php
namespace Co;

function repeat(Closure $closure,int|float $second): string;
```

#### Parameter Description

| Parameters | Type    | Description                                                                |
|------------|---------|----------------------------------------------------------------------------|
| $closure   | Closure | Closure function that is executed repeatedly, running in the event context |

#### Closure parameters

| Parameters | Type    | Description                                            |
|------------|---------|--------------------------------------------------------|
| $cancel    | Closure | Callback function to cancel the current recurring task |

### Overview

> Repeat (repeated execution), specify the frequency to do something repeatedly, usually used in scenarios such as
> scheduled tasks.
> ripple will provide a `cancel` callback function for the closure function you submitted. The current repeated task
> can be canceled by calling the `cancel` function.

### Basic usage

```php
\Co\repeat(function (Closure $cancel) {
    echo 'delay task';
    
    
    if(rand(1, 10) === 10){
        $cancel();
    }
}, 1);

\Co\wait(); // Wait for all events to complete
```

Note: The `repeat` method will repeatedly execute the closure function within the specified time interval until
the `cancel` function is called.

```php
\Co\repeat(function (Closure $cancel) {
    \Co\sleep(10);
    
    echo 'delay task';
    
    $cancel();
}, 1);

\Co\wait();
```

> In the above example, the code in repeat will be executed after 1 second, and when encountering `\Co\sleep`, the
> current coroutine will be automatically suspended, but `repeat` will still be executed again after 1 second.
