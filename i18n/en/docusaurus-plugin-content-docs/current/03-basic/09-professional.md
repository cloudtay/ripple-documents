---
title: 🎓advanced
description: Advanced usage in the ripple framework, including asynchronous operations, signal processing, sleep, futures mechanism, etc.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'asynchronous', 'signal', 'sleep', 'expiry' ]
---

## Process events

> In ripple, you can register an event that occurs after the process forks through the `forked` method, and execute the
> specified closure function in the child process after the fork.
> All fork events will be executed in the child process after the fork, and the registered processor will be forgotten
> after execution.

### API

```php
namespace Co;

function forked(Closure $closure): int;
function cancelForked(int $index): void;
```

```php
\Co\forked(function () {
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

### Notes

> Using task to create a sub-process can put time-consuming tasks into the sub-process for execution to avoid blocking
> the main process. The child process will inherit all resources of the parent process.
> But all event handlers, including those registered by `forked` will be forgotten. Therefore, the event handler needs
> to be re-registered in the child process.

## Futures contract management

> `0.7.1` and above versions support `waitGroup`, `Promise::all`, `Promise::allSettled`, `Promise::futures` and other
> futures contract management methods. Used to control the execution of multiple asynchronous tasks.

### WaitGroup

> `WaitGroup` is used to wait for a group of coroutines to complete execution. It is usually used to wait for multiple
> coroutines to complete execution before performing the next step.
> Usually you need to initialize a `WaitGroup` object with a counter, or call the `add` method on the `WaitGroup` object
> to increase the counter.

```php
use Psc\Core\Coroutine\WaitGroup;

$waitGroup = new WaitGroup(2);

\Co\async(static function () use ($waitGroup) {
    \Co\sleep(1);
    $waitGroup->done();
});

\Co\async(static function () use ($waitGroup) {
    \Co\sleep(1);
    $waitGroup->done();
});

$waitGroup->wait();
```

### Promise::all

> `Promise::all` is used to wait for a group of coroutines to complete execution and return the execution results of all
> coroutines. It is usually used to wait for multiple coroutines to finish executing before performing the next step.
> It is worth noting that `Promise::all` will wait for all coroutines to complete execution. Even if one of the
> coroutines fails to execute, a failed promise will be obtained. and
> `Promise::all` will wait for all coroutines to complete execution,
> Even if one of the coroutines fails to execute, you will get a failed promise.

```php
use Psc\Core\Coroutine\Promise;

$tasks = [];

for ($i = 0; $i < 10; $i++) {
    $tasks[] = \Co\async(static function () use ($i) {
        \Co\sleep(1);
        return $i;
    });
}

$result = Promise::all($tasks);
```

### Promise::allSettled

> `Promise::allSettled` is used to wait for a group of coroutines to complete execution and return the set of promise
> objects of all coroutines, regardless of whether the coroutine execution is successful or failed.
> Usually used to wait for multiple coroutines to complete before performing the next step.

```php
use Psc\Core\Coroutine\Promise;

$tasks = [];

for ($i = 0; $i < 10; $i++) {
    $tasks[] = \Co\async(static function () use ($i) {
        \Co\sleep(1);
        return $i;
    });
}

$promise = Promise::allSettled($tasks);
```

### Promise::futures

> `Promise::futures` does not wait for the coroutine to complete execution, but immediately returns an iterator, which
> can be used to traverse the execution results of all coroutine's future objects.
> The coroutine executed first will return the result first, but will not wait for all coroutines to complete execution.

```php
use Psc\Core\Coroutine\Promise;

$tasks = [];
for ($i = 0; $i < 10; $i++) {
    $tasks[] = \Co\async(static function () use ($i) {
        \Co\sleep(1);
        return $i;
    });
}

foreach (Promise::futures($tasks) as $future) {
    var_dump($future->await());
}
```
