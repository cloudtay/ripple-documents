---
sidebar_position: 1
title: 📘 Start
description: Ripple is a high-performance native PHP coroutine engine designed to handle high-concurrency, complex network communications and data operations.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'engine', 'coroutine engine' ]
---

Ripple is a high-performance native PHP coroutine engine based on the fiber feature of PHP8.1+ + Revolt tool library.
Its original design intention is

**Extend PHP features with PHP features**

```php
<?php

include 'vendor/autoload.php';

$task = static function ($i) {
    \Co\sleep(1);
    echo 'Coroutine ', $i, \PHP_EOL;
};

for ($i = 0; $i < 100; $i++) {
    \Co\async(static fn ()=> $task($i));
}

// Wait for all coroutines to complete execution
\Co\sleep(2);
```

It doesn't replace anything or impose new constraints but simply provides a solution:

> Provides a series of standard APIs and tools, providing a reliable support library for the PHP-CLI mode, allowing
> developers to easily build high-performance PHP service mode applications

### Project Features

- Compatibility: Compatible with existing PHP engines and libraries, supports use in FPM/CLI environment
- Easy to use: 100% PHP code implementation, no more learning costs, provides more easy-to-use APIs
- Coroutine scheduling: Use standardized asynchronous mechanisms such as `Fiber`, `Promise`, and `Future` to achieve
  high-standard coroutine/thread scheduling.
- Easy to integrate: Can be seamlessly integrated with traditional projects, providing simple installation and usage
  guides.

### Get started

Through this project document, you will learn how to install, configure and use ripple, and gradually master the core
concepts and best practices of coroutine programming.
We also provide a wealth of sample code and tutorials to help you quickly get started and play. Let's start this journey
of high-performance PHP programming!
