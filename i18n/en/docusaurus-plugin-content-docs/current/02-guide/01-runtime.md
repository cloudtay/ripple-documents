---
title: Operating mechanism
description: In ripple, all defined asynchronous closures are driven by EventLoop. Ripple will specifically declare and strictly control the occurrence of any closure at runtime. All developers of plug-ins/components should also be concerned about this to prevent Closure occurs when process/fiber escapes and runs a black hole
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency' ]
---

In ripple, all defined asynchronous closures are driven by EventLoop, which will run the specified event at the
appropriate time. Normally,
Developers do not need to care too much about the processing mechanism of EventLoop. They only need to control the
process. Different closures may be executed in different context spaces.
During the development process, attention should be paid to the constraints of these context spaces.

Ripple will specifically declare and strictly control the occurrence of any closure at runtime. All senior developers
should pay special attention to this point to ensure the development of stable functional code.
Prevent closure from process/fiber escape and black hole running

### Main process running time

Users of the framework hardly need to care about this runtime, because the developer's code usually runs in the context
of `event runtime` and `coroutine runtime`
The entry point of the process. The process of building ripple is the main process runtime, which occurs before the
ripple driver.

### Event runtime

> The event runtime is a low-level runtime driven by Revolt, everything happens from here, so you need to pay attention
> to its constraints

| Constraints                  | Exception tolerance                                                 |
|------------------------------|---------------------------------------------------------------------|
| Return values are prohibited | Any exceptions are not tolerated and will cause the program to exit |

### Coroutine runtime

> Compatible with all asynchronous operations

| Constraints | Exception tolerance |
|-------------|---------------------|
| None        | All `Throwable`     |
