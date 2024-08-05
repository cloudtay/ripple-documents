---
title: delay - \P\delay
description: PRipple supports delayed execution of a closure function through the \P\delay method, which is used to handle asynchronous operations.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'delay', 'asynchronous']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace P;

function delay(Closure $closure,int|float $second): string;
```

#### Parameter Description

| Parameters | Type | Description |
|----------|------------------|------------------- ---|
| $closure | Closure | Delayed execution of the closure function, running in the event context |
| $second | int \| float | Delay time, unit second, supports decimal precision of 0.1 seconds |

#### Closure parameters

none

#### return value

Returns the unique identifier of the event, allowing the event to be canceled using the \P\cancel method

### Overview

> Delay (delayed execution), executes a closure function after a certain period of time to handle asynchronous
> operations.

### Basic usage

```php
\P\delay(function () {
    echo 'delay task';
}, 1);

\P\sleep(10); // Suspend the main process for 10 seconds so that other coroutines can complete the task
```

#### hint

> In the scaffolding provided by PRipple, most framework controller requests will occur in the async space. You can use
> the `\P\delay` method in the controller.
