---
title: sleep - \P\sleep
description: The \P\sleep function is used to suspend the current coroutine, giving up CPU resources, and other coroutines can continue to execute.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'sleep', 'suspend', 'CPU resources']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

###API

```php
namespace P;

function sleep(int $second): void;
```

#### Parameter Description

| Parameters | Type | Description                                                        |
|------------|------|--------------------------------------------------------------------|
| $second    | int  | Sleep time, unit second, supports decimal precision of 0.1 seconds |

#### return value

No return value

### Overview

> Sleep (sleep), the user suspends the execution of the current coroutine and lets the CPU handle other to-do tasks.

- Using the `\P\sleep` function in `fiber space`: will suspend the current coroutine, giving up CPU resources, and other
  coroutines can continue to execute.
- Using the `\P\sleep` function outside the `fiber space`: will suspend the current main process, giving up CPU
  resources, and other coroutines can continue to execute.

`\P\sleep` is different from `\sleep` in that it acts on the current coroutine, not the entire process.

### Basic usage

```php
\P\async(function () {
    \P\sleep(1);
    
    echo 'async task';
});

\P\sleep(10); // Suspend the main process for 10 seconds so that other coroutines can complete the task
```

### Precautions

> None
