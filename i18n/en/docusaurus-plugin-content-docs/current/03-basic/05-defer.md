---
title: defer - \P\defer
description: PRipple supports delayed execution of a closure function through the \P\defer method, which is used to handle asynchronous operations.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'deferred', 'asynchronous']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace P;

function defer(Closure $closure): string;
```

#### Parameter Description

| Parameters | Type    | Description                                                             |
|------------|---------|-------------------------------------------------------------------------|
| $closure   | Closure | Delayed execution of the closure function, running in the event context |

### Closure parameters

none

### return value

Returns the unique identifier of the current event, allowing the event to be canceled using the `\P\cancel` method

### Overview

> Defer (delayed execution), executes a closure function immediately after the current event ends, usually used for
> resource release and other operations.

### Basic usage

```php
\P\async(function () {
    $file = fopen('file.txt', 'w');

    \P\defer(function () use ($file) {
        //TODO: The code here will not be executed immediately
        fclose($file);
    });
    
    fwrite($file, 'hello world');
    return 'async task';
});
```

> defer is useful in actual scenarios, such as releasing resources after an asynchronous request ends.

```php
public function index(Request $request) : JsonResponse
{
    \P\defer(function() use ($request){
        $response = \P\await(
            \P\Net::HTTP()->Guzzle()->getAsync('http://example.com');
        );
    
        $channel = \P\IO::Channel()->open('websocket');
        $channel->send($response->getBody()->getContent());
        
        $channel->close();
    });
    
    return new JsonResponse(['status' => 'ok']);
}
```

#### hint

> In the scaffolding provided by PRipple, most framework controller requests will occur in the async space. You can use
> the `\P\defer` method in the controller.
