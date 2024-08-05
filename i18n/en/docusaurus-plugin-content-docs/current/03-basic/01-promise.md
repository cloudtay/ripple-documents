---
title: Promise - \P\promise
description: Promise (commitment/expiry mechanism) is a core concept in the PRipple framework and is used to handle asynchronous operations. A Promise object represents the final completion or failure of an asynchronous operation, as well as its result value. Compared with Future, Promise provides a more intuitive API that is easier to understand and use.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'promise mechanism', 'Promise','commitment mechanism']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

###API

```php
namespace P;

function promise(Closure $closure): Promise;
```

#### Parameter Description

| Parameters | Type    | Description                                                    |
|------------|---------|----------------------------------------------------------------|
| $closure   | Closure | Entry closure function, run immediately in the current context |

#### Closure parameters

| Parameters | Type    | Description            |
|------------|---------|------------------------|
| $resolve   | Closure | Resolve contract       |
| $reject    | Closure | Reject future contract |

#### return value

Returns a `Promise` object

### Overview

Promise (promise/expiration mechanism) is a core concept in the PRipple framework and is used to handle asynchronous
operations. A Promise object represents the final completion or failure of an asynchronous operation, as well as its
result value.
Compared with Future, Promise provides a more intuitive API that is easier to understand and use.

### Usage

> Use this method to create a Promise object

```php
$promise = \P\promise(Closure $callback): Promise
```

> PRipple will provide two parameters for the closure function you submit, one is the `resolve` callback function and
> the other is the `reject` callback function.
> Use these two callback functions to resolve or reject a futures contract.

```php
$promise = \P\promise(function ($resolve, $reject) {
    $resolve('success'); // Resolve a future contract
    
    // $reject('error'); // Reject a futures contract
    
    //TODO: More actions...
});
```

### Promise status

> A Promise object has three states:

- pending: initial state, neither success nor failure state.
  -fulfilled: means the operation was completed successfully.
- rejected: means the operation failed.

> A Promise object can only be converted from the `pending` state to the `fulfilled` or `rejected` state.
> Once converted to `fulfilled` or `rejected` state, it cannot be converted to other states again.

```php
$promise = \P\promise(function ($resolve, $reject) {
    //TODO: Asynchronous operations such as reading files/network requests/database queries...

    $resolve('success'); // Resolve a future contract
});

// When the future contract is resolved, the callback function in the then method will be triggered.
$promise->then(function (mixed $result) {
    echo $value;
});

// When the futures contract is rejected, the callback function in the catch method will be triggered.
$promise->catch(function (Exception $e) {
    echo $reason;
});

$promise->await(); // Wait for the promise to be resolved
```

### Precautions

`resolve` and `reject` will only change the state and result of Promise and will not prevent subsequent code execution.
