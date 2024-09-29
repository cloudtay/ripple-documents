---
title: defer - \Co\defer
description: Ripple supports delayed execution of a closure function through the \Co\defer method, which is used to handle asynchronous operations.
keywords: ['Ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'deferred', 'asynchronous']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace Co;

function defer(Closure $closure): string;
```

#### Parameter Description

| Parameters | Type    | Description                                                             |
|------------|---------|-------------------------------------------------------------------------|
| $closure   | Closure | Delayed execution of the closure function, running in the event context |

### Closure parameters

none

### return value

Returns the unique identifier of the current event, allowing the event to be canceled using the `\Co\cancel` method

### Overview

> Defer (delayed execution), executes a closure function immediately after the current event ends, usually used for
> resource release and other operations.

### Basic usage

```php
\Co\async(function () {
    $file = fopen('file.txt', 'w');

    \Co\defer(function () use ($file) {
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
    \Co\defer(function() use ($request){
        $response = \Co\await(
            \Co\Net::HTTP()->Guzzle()->getAsync('http://example.com');
        );
    
        $channel = \Co\IO::Channel()->open('websocket');
        $channel->send($response->getBody()->getContent());
        
        $channel->close();
    });
    
    return new JsonResponse(['status' => 'ok']);
}
```

#### hint

> In the scaffolding provided by Ripple, most framework controller requests will occur in the async space. You can use
> the `\Co\defer` method in the controller.
