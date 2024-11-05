---
title: \Co\signal
description: Signal in ripple is a core concept in the ripple framework and is used to process system signals. The Signal object represents the trigger of a system signal and its handler.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'signal', 'Signal' ]
---

###API

```php
namespace Co;

function onSignal(int $signalCode,Closure $closure): string;
```

#### Parameter description

| Parameters  | Type    | Description                           |
|-------------|---------|---------------------------------------|
| $signalCode | int     | signal code                           |
| $closure    | Closure | Signal handler, runs in event context |

#### Closure parameters

| Parameters  | Type | Description |
|-------------|------|-------------|
| $signalCode | int  | signal code |

#### Return value

Returns the unique identifier of the event, allowing the event to be canceled using the \Co\cancel method

### Overview

> Ripple allows you to listen to system signals through the `onSignal` method and execute the specified closure function
> when the signal is triggered.

### Basic usage

```php
\Co\onSignal(SIGINT, function () {
    echo 'signal received';
    exit(0);
});
```

### Notes

> After registering any signal handler, if the signal handler is not canceled correctly, \Co\wait will think that there
> are unfinished events and will wait until all events are completed.
