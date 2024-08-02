---
title: 文件锁 - Lock
---

### 访问组件

```php
use \P\IO;

IO::Lock();
```

### API

```php
// 访问一个文件锁,不存在则创建
public function access(string $name = 'default'): Lock;
```

### 概述

> Lock (文件锁) , PRipple提供了一个基础的文件锁, 用于多个进程中, 对同一资源抢占时可以错开访问时间的手段。
> 锁的权限在当前进程中全局共享, 你可以像以下方式使用Lock

### 例子

```php
$common = \P\IO::Lock()->access('common');
$common->lock();

$task = \P\System::Process()->task(function() use ($common){
    $common->lock();
    
    echo 'get lock success';
});

$runtime = $task->run();

\P\delay(fn() => $common->unlock(),5);

$runtime->await();
```


