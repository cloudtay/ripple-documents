---
sidebar_position: 1
title: 📘 开始
description: ripple是一个高性能的原生PHP协程引擎，旨在处理高并发、复杂的网络通信和数据操作。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发', '引擎', '协程引擎' ]
---

ripple是基于PHP8.1+的纤程特性 + Revolt工具库实现的一个高性能的原生PHP协程引擎，它的设计初衷即

**以PHP的特性扩展PHP的特性**

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

它不会取代任何东西也不会附加新的约束而只是提供了一种解决方案:

> 提供一系列标准的API和工具,为PHP-CLI模式提供了可靠的支持库,使得开发者可以轻松地构建高性能的PHP服务模式应用

### 项目特点

- 兼容性: 兼容现有的PHP引擎和库, 支持在FPM/CLI环境下使用
- 易于使用: 100%的PHP代码实现,无需更多的学习成本,提供了更多易用的API
- 协程调度: 使用 `Fiber` , `Promise` , `Future` 这类规范的异步机制实现高标准的协程/线程调度。
- 易于集成: 可以与传统项目无缝集成，提供简单的安装和使用指南。

### 开始使用

通过本项目文档，你将了解如何安装、配置和使用ripple，并逐步掌握协程编程的核心概念和最佳实践。
我们还提供了丰富的示例代码和教程，帮助您快速上手并发挥,让我们开始这段高性能PHP编程之旅吧！
