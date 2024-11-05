---
title: \Co\delay
description: ripple supports delayed execution of a closure function through the \Co\delay method, which is used to handle asynchronous operations.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'delay', 'asynchronous' ]
---

###API

```php
namespace Co;

function delay(Closure $closure,int|float $second): string;
```

#### Parameter description

| Parameters | Type | Description |
|----------|------------------|------------------- ---|
| $closure | Closure | Delayed execution of the closure function, running in the event context |
| $second | int \| float | Delay time, unit second, supports decimal precision of 0.1 seconds |

#### Closure parameters

none

#### Return value

Returns the unique identifier of the event, allowing the event to be canceled using the \Co\cancel method

### Overview

> Delay (delayed execution), executes a closure function after a certain period of time to handle asynchronous
> operations.

### Basic usage

```php
\Co\delay(function () {
    echo 'delay task';
}, 1);

\Co\sleep(10); // Suspend the main process for 10 seconds so that other coroutines can complete the task
```

#### hint

> In the scaffolding provided by ripple, most framework controller requests will occur in the async space. You can use
> the `\Co\delay` method in the controller.
