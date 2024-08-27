---
title: 引言 - Introduction
description: PRipple是一个高性能的原生PHP协程框架，旨在处理高并发、复杂的网络通信和数据操作。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发']
---

### 环境说明 (暂不兼容Windows系统)  
  
PRipple 依赖于 PHP8.1+ 的 Fiber 特性，因此需要在PHP8.1+的环境下运行。  
  
同时我们也提倡PHPer使用更加现代化的PHP版本，以便能够更好地利用PHP的新特性和工具库。  
  
在2024年，PHP仍然是具有活力的编程语言。PHP8.1的发布，为PHP带来了全新的特性，如Fiber、静态类型、新的工具库等，这些特性使得PHP在高性能、高并发、异步编程等方面有了更好的支持。  
  
### 必要扩展  

- posix  
- sockets  
- pcntl  
- openssl  
  
### 学习前提  
  
在开始学习PRipple之前，我们假设您已经具备以下知识：  
  
- 了解PHP基础语法  
- 了解PHP的面向对象编程  
- 了解PHP的类型系统或静态类型特性  
  
### 关于 Windows 环境说明  
  
- Windows 环境下，没有 `posix` 和 `pcntl` 扩展的支持，因此理论上无法直接支持 Windows 环境。但是，如果您愿意尝试，可以使用 `cygwin` 来编译一个带有 `posix` 和 `pcntl` 支持的PHP版本。  
  
- 如果您的系统支持安装子系统，我们建议使用 [WSL](https://learn.microsoft.com/en-gb/windows/wsl/) 来作为开发环境，这样可以避免扩展支持问题。  
