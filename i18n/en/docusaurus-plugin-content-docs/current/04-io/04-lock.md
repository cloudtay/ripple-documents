---
title: Lock
description: Lock (file lock), ripple provides a basic file lock, which is used in multiple processes to stagger the access time when seizing the same resource.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'file lock', 'Lock' ]
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### Access components

```php
use \Co\IO;

IO::Lock();
```

###API

```php
//Access a file lock, create it if it does not exist
public function access(string $name = 'default'): Lock;
```

### Overview

> Lock (file lock), ripple provides a basic file lock, which is used in multiple processes to stagger the access time
> when seizing the same resource.
> The permissions of the lock are shared globally in the current process. You can use Lock as follows

### example

```php
$common = \Co\IO::Lock()->access('common');
$common->lock();

$task = \Co\System::Process()->task(function() use ($common){
    $common->lock();
    
    echo 'get lock success';
});

$runtime = $task->run();

\Co\delay(fn() => $common->unlock(),5);

$runtime->await();
```
