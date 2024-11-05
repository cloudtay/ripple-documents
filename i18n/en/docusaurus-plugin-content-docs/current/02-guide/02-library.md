---
title: module
description: All ripple support libraries are under the `Co` namespace and are divided according to the modules to which they belong. Currently, the support libraries have the following modules
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency' ]
---

## introduce

All support libraries of ripple are under the `Co` namespace and are divided according to the modules to which they
belong. Currently, the support libraries have the following modules:

- `Co\IO` stream resource operation module
- `Co\System` system operation module

You can access the support library and use it in the following ways, such as

```php
use \Co\IO;

$fileUtil = IO::File();
$content = $fileUtil->getContent('file.txt');
```

```php
$channel = \Co\IO::Socket()->connect('tcp://www.baidu.com:80');
$channel->send('hello world');
```
