---
title: \Co\sleep
description: The \Co\sleep function is used to suspend the current coroutine, giving up CPU resources, and other coroutines can continue to execute.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'sleep', 'suspend', 'CPU resources' ]
---

###API

```php
namespace Co;

function sleep(int $second): void;
```

#### Parameter description

| Parameters | Type | Description                                                        |
|------------|------|--------------------------------------------------------------------|
| $second    | int  | Sleep time, unit second, supports decimal precision of 0.1 seconds |

#### Return value

No return value

### Overview

> Sleep (sleep), the user suspends the execution of the current coroutine and lets the CPU handle other to-do tasks.

- Using the `\Co\sleep` function in `fiber space`: will suspend the current coroutine, give up CPU resources, and other
  coroutines can continue to execute.
- Using the `\Co\sleep` function outside the `fiber space`: will suspend the current main process, giving up CPU
  resources, and other coroutines can continue to execute.

`\Co\sleep` is different from `\sleep` in that it acts on the current coroutine, not the entire process.

### Basic usage

```php
\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task';
});

\Co\sleep(10); // Suspend the main process for 10 seconds so that other coroutines can complete the task
```

### Notes

> None
