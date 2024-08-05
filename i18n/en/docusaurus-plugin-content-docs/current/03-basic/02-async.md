---
title: asynchronous - \P\async
description: Async (asynchronous) in PRipple is a core concept in the PRipple framework and is used to handle asynchronous operations. Async objects represent the final completion or failure of an asynchronous operation, as well as its result value.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'asynchronous', 'Async']
tags: ['Async', 'Async']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace P;

function async(Closure $closure): Promise;
```

#### Parameter Description

| Parameters | Type    | Description                                                       |
|------------|---------|-------------------------------------------------------------------|
| $closure   | Closure | Entry closure function, immediately runs in the coroutine context |

#### Closure parameters

| Parameters | Type    | Description            |
|------------|---------|------------------------|
| $resolve   | Closure | Resolve contract       |
| $reject    | Closure | Reject future contract |

### Overview

> Async (asynchronous operation) is one of the core concepts of coroutines implemented in the PRipple framework. It
> manages state based on the Promise mechanism and expands the asynchronous operation capabilities of coroutines.

### Usage

Use this method to create a Promise object

```php
$promise = \P\async(Closure $callback): Promise
```

> PRipple will also provide two parameters for the submitted closure function, one is the `resolve` callback function
> and the other is the `reject` callback function.
> Use these two callback functions to resolve or reject a promise. Unlike the `promise` method, `async` supports more
> asynchronous operations.
> And using the `async` method usually does not require explicit processing of `resolve` and `reject`, it will
> automatically resolve the deadline during the running process,

#### Example

```php
\P\async(function () {
    \P\sleep(1);
    
    echo 'async task 1';
});

\P\async(function () {
    \P\sleep(1);
    
    echo 'async task 2';
});

\P\async(function () {
    \P\sleep(1);
    
    echo 'async task 3';
});
```

> In the above example, the code in async will be executed immediately, and when encountering `\P\sleep`, the current
> coroutine will be automatically suspended, and the processor will execute other coroutines during the suspension
> period.
> Until the suspended coroutine is awakened. without blocking the execution of other coroutines.

#### Automatically resolve appointments

> Normally, the `async` method will automatically resolve the contract

- When an exception occurs within the closure, the contract will be automatically rejected
- When a return value occurs within the closure, the contract will be automatically resolved
- When the closure completes normal execution, the expiration date (null) will be automatically resolved

```php
$promise = \P\async(function () {
    \P\sleep(1);
    
    if(rand(0,1) === 1){
        throw new Exception('error');
    }
    return 'success';
});
```

> NOTE: In some cases, you may need to manually resolve the expiration date

```php
$promise = \P\async(function ($resolve, $reject) {
    \P\sleep(1);
    
    if(rand(0,1) === 1){
        $reject(new Exception('error'));
    }
    $resolve('success');
    
    // The code here will be executed, but will not affect the status of the contract.
    return 'done';
});
```

### Await

> The implementation of sleep is the best example of coroutine, but in actual development, we may need to deal with more
> scenarios, such as

```php
function httpGet(string $url) : Promise {
    return \P\Net::Http()->Gullze()->getAsync($url);
}

\P\async(function(){
    $response = \P\await(httpGet('http://example.com'));
    
    echo $response->getBody()->getContent();
});
```

### Precautions

`await` can only be used in `async`, and can only wait for `Promise` objects. Outside the closure you can do this:

```php
function httpGet(string $url) : Promise {
   return \P\Net::Http()->Gullze()->getAsync($url);
}


httpGet('http://example.com')->then(function($response){
    echo $response->getBody()->getContent();
});
```

### hint

> In the scaffolding provided by PRipple, most framework controller requests will occur in the async space. You can use
> the `async` method in the controller to handle asynchronous operations.
