---
title: File
description: ripple supports operating files through the \Co\IO::File() method, which is used to handle file read and write operations.
keywords: ['ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'file', 'IO']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### Access components

```php
\Co\IO::File() : File;
```

###API

```php
public function getContents(string $path): Promise;
public function open(string $path, string $mode): Stream;
```

### Overview

ripple provides asynchronous operation methods for files, allowing developers to read file contents and operate file
streams through streams that do not block the process.

### Instructions

You can read the file in the following way

```php
\Co\IO::File()->getContents(__FILE__)->then(function(string $value){
    
});
```

```php
\Co\async(function(){
    $value = \Co\await(
        \Co\IO::File()->getContents(__FILE__)
    );
});
```

You can also open a file stream in the following way

```php
$stream = \Co\IO::File()->open('file.txt','r');
```

Stream follows the StreamInterface development of PSR specifications. For Stream operations, please see the Stream
operation section.
