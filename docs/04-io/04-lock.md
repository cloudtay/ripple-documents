---
title: 文件锁 (Lock)
description: Lock (文件锁) , ripple提供了一个基础的文件锁, 用于多个进程中, 对同一资源抢占时可以错开访问时间的手段。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发', '文件锁', 'Lock' ]
---

### 访问组件

```php
use \Co\IO;

IO::Lock();
```

### API

```php
// 访问一个文件锁,不存在则创建
public function make(string $name = 'default'): Lock;
```

### 概述

> Lock (文件锁) , ripple提供了一个基础的文件锁, 用于多个进程中, 对同一资源抢占时可以错开访问时间的手段。
> 锁的权限在当前进程中全局共享, 你可以像以下方式使用Lock

### 例子

```php
$common = \Co\IO::Lock()->make('common');
$common->lock();

$task = \Co\System::Process()->task(function() use ($common){
    $common->lock();
    
    echo 'get lock success';
});

$runtime = $task->run();

\Co\delay(fn() => $common->unlock(),5);

$runtime->await();
```


