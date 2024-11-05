---
title: \Co\async
description: Async in ripple is a core concept in the ripple framework and is used to handle asynchronous operations. Async objects represent the final completion or failure of an asynchronous operation, as well as its result value.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'asynchronous', 'Async' ]
tags: [ 'Async', 'Async' ]
---

###API

```php
namespace Co;

function async(Closure $closure): Promise;
```

#### Parameter description

| Parameters | Type    | Description                                                       |
|------------|---------|-------------------------------------------------------------------|
| $closure   | Closure | Entry closure function, immediately runs in the coroutine context |

#### Closure parameters

| Parameters | Type    | Description            |
|------------|---------|------------------------|
| $resolve   | Closure | Resolve contract       |
| $reject    | Closure | Reject future contract |

### Overview

> Async (asynchronous operation) is one of the core concepts of coroutines implemented in the ripple framework. It
> manages state based on the Promise mechanism and expands the asynchronous operation capabilities of coroutines.

### Usage

Use this method to create a Promise object

```php
$promise = \Co\async(Closure $callback): Promise
```

> Ripple will also provide two parameters for the submitted closure function, one is the `resolve` callback function and
> the other is the `reject` callback function.
> Use these two callback functions to resolve or reject a promise. Unlike the `promise` method, `async` supports more
> asynchronous operations.
> And using the `async` method usually does not require explicit processing of `resolve` and `reject`, it will
> automatically resolve the deadline during the running process,

#### Example

```php
\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task 1';
});

\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task 2';
});

\Co\async(function () {
    \Co\sleep(1);
    
    echo 'async task 3';
});
```

> In the above example, the code in async will be executed immediately, and when encountering `\Co\sleep`, the current
> coroutine will be automatically suspended, and the processor will execute other coroutines during the suspension
> period.
> Until the suspended coroutine is awakened. without blocking the execution of other coroutines.

#### Automatically resolve appointments

> Normally, the `async` method will automatically resolve the contract

- When an exception occurs within the closure, the contract will be automatically rejected
- When a return value occurs within the closure, the contract will be automatically resolved
- When the closure completes normal execution, the expiration date (null) will be automatically resolved

```php
$promise = \Co\async(function () {
    \Co\sleep(1);
    
    if(rand(0,1) === 1){
        throw new Exception('error');
    }
    return 'success';
});
```

> NOTE: In some cases, you may need to manually resolve the expiration date

```php
$promise = \Co\async(function ($resolve, $reject) {
    \Co\sleep(1);
    
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
    return \Co\Net::Http()->Gullze()->getAsync($url);
}

\Co\async(function(){
    $response = \Co\await(httpGet('http://example.com'));
    
    echo $response->getBody()->getContent();
});
```

### Notes

`await` can only be used in `async`, and can only wait for `Promise` objects. Outside the closure you can do this:

```php
function httpGet(string $url) : Promise {
   return \Co\Net::Http()->Gullze()->getAsync($url);
}


httpGet('http://example.com')->then(function($response){
    echo $response->getBody()->getContent();
});
```

### hint

> In the scaffolding provided by ripple, most framework controller requests will occur in the async space. You can use
> the `async` method in the controller to handle asynchronous operations.
