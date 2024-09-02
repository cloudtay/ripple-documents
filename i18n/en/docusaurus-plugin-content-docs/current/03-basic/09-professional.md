---
title: Advanced Usage - Professional
description: Advanced usage in the PRipple framework, including asynchronous operations, signal processing, sleep, futures mechanism, etc.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'asynchronous', 'signal', 'sleep', 'expiry']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace Co;

function registerForkHandler(Closure $closure): int;
function cancelForkHandler(int $index): void;
```

### Overview

> In PRipple, you can register an event that occurs after the process forks through the `registerForkHandler` method,
> and execute the specified closure function in the child process after the fork.
> All fork events will be executed in the child process after the fork, and the registered processor will be forgotten
> after execution.

### Basic usage

```php
\Co\registerForkHandler(function () {
    \Co\repeat(function () {
        echo 'repeat task';
    }, 1);
});

$task = \Co\System::Process()->task(function () {
    echo 'fork task';
});

$runtime = $task->run();
$runtime->await();
```

### Precautions

> Using task to create a sub-process can put time-consuming tasks into the sub-process for execution to avoid blocking
> the main process. The child process will inherit all resources of the parent process.
> But all event handlers, including those registered by `registerForkHandler`, will be forgotten. Therefore, the event
> handler needs to be re-registered in the child process.
