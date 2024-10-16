---
title: 🎓 advanced
description: ripple框架中的高级用法, 包括异步操作, 信号处理, 睡眠, 期约机制等。
keywords: [ 'ripple', 'PHP', '期约', '高性能', '高并发', '异步', '信号', '睡眠', '期约' ]
---

## 进程事件

> 在ripple中, 你可以通过`forked`方法注册一个在进程fork之后发生的事件, 并在fork之后的子进程中执行指定的闭包函数。
> 所有的fork事件都会在fork之后的子进程中执行, 且注册的处理器会在执行之后被遗忘。

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

### 注意事项

> 使用task创建子进程可以将耗时任务放到子进程中执行, 以避免阻塞主进程。子进程会继承父进程的所有资源,
> 但会忘记所有事件处理器, 包括`forked`注册的事件处理器。因此子进程中需要重新注册事件处理器。

## 期约管理

> `0.7.1`以上版本支持`waitGroup`、`Promise::all`、`Promise::allSettled`、`Promise::futures`等期约管理方法。用于控制多个异步任务的执行。

### WaitGroup

> `WaitGroup`用于等待一组期约执行完毕, 通常用于等待多个期约执行完毕后再执行下一步操作。
> 通常需要初始化一个带有计数器的`WaitGroup`对象, 或在`WaitGroup`对象上调用`add`方法增加计数器。

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

> `Promise::all`用于等待一组期约执行完毕, 并返回所有期约的执行结果。通常用于等待多个期约执行完毕后再执行下一步操作。
> 值得注意的是, `Promise::all`会等待所有期约执行完毕, 即使其中一个期约执行失败, 将会得到一个失败的期约。并且
> `Promise::all`会等待所有期约执行完毕,
> 即使其中一个期约执行失败, 将会得到一个失败的期约。

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

> `Promise::allSettled`用于等待一组期约执行完毕, 并返回所有期约的期约对象集, 无论期约执行成功或失败。
> 通常用于等待多个期约执行完毕后再执行下一步操作

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

> `Promise::futures`不会等待期约执行完毕, 而是立即返回一个迭代器, 可以用于遍历所有期约的期约对象的执行结果。
> 先执行完成的任务会在迭代器中优先弹出

```php
use Psc\Core\Coroutine\Promise;
use function Co\async;

$tasks = [];

for ($i = 0; $i < 10; $i++) {
    $tasks[] = async(static function () use ($i) {
        \Co\sleep(\mt_rand(1, 10));
        return $i;
    });
}

foreach (Promise::futures($tasks) as $future) {
    echo 'Coroutine is done ', $future, \PHP_EOL;
}

\Co\wait();
```

### Promise::any

> `Promise::any`用于等待一组期约中的任意一个期约执行完毕, 并返回第一个执行完毕的期约的执行结果。

```php
use Psc\Core\Coroutine\Promise;

use function Co\async;

$tasks = [];

for ($i = 0; $i < 10; $i++) {
    $tasks[] = async(static function () use ($i) {
        \Co\sleep(\mt_rand(1, 10));
        return $i;
    });
}

$promise = Promise::any($tasks)->then(function ($value) {
    echo 'Coroutine is done ', $value, \PHP_EOL;
});

```

### Promise::race

> `Promise::race`用于等待一组期约中的任意一个期约执行完毕, 并返回第一个执行完毕的期约的执行结果。

```php
use Psc\Core\Coroutine\Promise;

$tasks = [];

for ($i = 0; $i < 10; $i++) {
    $tasks[] = \Co\async(static function () use ($i) {
        \Co\sleep(\mt_rand(1, 10));
        return $i;
    });
}


Promise::race($tasks)->then(function ($value) {
    echo 'Coroutine is done ', $value, \PHP_EOL;
});
```
