---
title: Module - Library
description: All PRipple support libraries are under the `P` namespace and are divided according to the modules to which they belong. Currently, the support libraries have the following modules
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

## introduce

All PRipple support libraries are under the `P` namespace and are divided according to the modules to which they belong.
Currently, the support libraries have the following modules:

- `P\Net` network operation module
- `P\IO` stream resource operation module
- `P\System` system operation module
- `P\Util` tool module
- `P\Plugin` plug-in module
- `P\Coroutine` coroutine module

You can access the support library and use it in the following ways, such as

```php
use \P\IO;

$fileUtil = IO::File();
$fileUtil->getContent('file.txt');
```

> Also supports chain calls such as

```php
$channel = \P\IO::Channel()->open('master');
$channel->send('hello world');
```
