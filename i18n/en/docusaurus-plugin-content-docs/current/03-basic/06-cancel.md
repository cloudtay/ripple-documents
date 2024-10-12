---
title: \Co\cancel
description: Cancel (cancel), used to cancel an event, usually used to cancel asynchronous tasks, supports the cancellation of all events whose running context is defined as an independent fiber. Such as `delay`, `repeat`, `onSignal`, `defer`, etc.
keywords: ['ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'undo', 'cancel', 'asynchronous task']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### API

```php
namespace Co;

function cancel(string $eventId): string;
```

#### Parameter Description

| Parameters | Type   | Description      |
|------------|--------|------------------|
| $eventId   | string | event identifier |

#### return value

none

### Overview

> Cancel (cancel), used to cancel an event, usually used to cancel asynchronous tasks, supports the cancellation of all
> events whose running context is defined as an independent fiber. like
> `delay`, `repeat`, `onSignal`, `defer`, etc.

### Basic usage

```php
$repeatId = \Co\repeat(function () {
    echo 'delay task' .PHP_EOL;
}, 1);

$signalId = \Co\onSignal(SIGINT, function () {
    echo 'signal task' .PHP_EOL;
});


// Cancel the signal task after 10 seconds
\Co\delay(fn() => \Co\cancel($signalId), 10);

//Cancel the repeated task after 5 seconds
\Co\delay(fn() => \Co\cancel($repeatId), 5);


$delayId = \Co\delay(function () {
    echo 'delay task' .PHP_EOL;
}, 10);

// Cancel the task in advance before it occurs
\Co\cancel($delayId);
```

#### Precautions

> You cannot cancel an executed event, you can only cancel an unexecuted event, except repeat/signal,
> Other events are one-time events and will be automatically destroyed once executed. If there are no special
> requirements, you do not need to manually cancel the event.
