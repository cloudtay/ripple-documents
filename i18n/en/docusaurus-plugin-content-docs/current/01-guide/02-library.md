---
title: Module
description: All ripple support libraries are under the `Co` namespace and are divided according to the modules to which they belong. Currently, the support libraries have the following modules
keywords: ['ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

## introduce

All ripple support libraries are under the `Co` namespace and are divided according to the modules to which they belong.
Currently, the support libraries have the following modules:

- `Co\Net` network operation module
- `Co\IO` stream resource operation module
- `Co\System` system operation module
- `Co\Util` tool module
- `Co\Plugin` plug-in module
- `Co\Coroutine` coroutine module

You can access the support library and use it in the following ways, such as

```php
use \Co\IO;

$fileUtil = IO::File();
$fileUtil->getContent('file.txt');
```

> Also supports chain calls such as

```php
$channel = \Co\IO::Channel()->open('master');
$channel->send('hello world');
```
