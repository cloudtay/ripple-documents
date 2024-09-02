---
title: signal - \Co\signal
description: Signal in PRipple is a core concept in the PRipple framework and is used to process system signals. The Signal object represents the trigger of a system signal and its handler.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'signal', 'Signal']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### API

```php
namespace Co;

function onSignal(int $signalCode,Closure $closure): string;
```

#### Parameter Description

| Parameters  | Type    | Description                           |
|-------------|---------|---------------------------------------|
| $signalCode | int     | signal code                           |
| $closure    | Closure | Signal handler, runs in event context |

#### Closure parameters

| Parameters  | Type | Description |
|-------------|------|-------------|
| $signalCode | int  | signal code |

#### return value

Returns the unique identifier of the event, allowing the event to be canceled using the \Co\cancel method

### Overview

> PRipple allows you to listen to system signals through the `onSignal` method and execute the specified closure
> function when the signal is triggered.

### Basic usage

```php
\Co\onSignal(SIGINT, function () {
    echo 'signal received';
    exit(0);
});
```

### Precautions

> After registering any signal handler, if the signal handler is not canceled correctly, \Co\tick will consider that
> there are unfinished events and will wait until all events are completed.
