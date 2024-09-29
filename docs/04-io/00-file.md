---
title: 文件 - File
description: Ripple中支持通过\Co\IO::File()方法操作文件, 用于处理文件读写操作。
keywords: ['Ripple', 'PHP', '协程', '高性能', '高并发', '文件', 'IO']
---

### 访问组件

```php
\Co\IO::File() : File;
```

### API

```php
public function getContents(string $path): Promise;
public function open(string $path, string $mode): Stream;
```

### 概述

Ripple提供了对于文件的异步操作方法, 允许开发者通过不堵塞进程的stream方式读取文件内容, 操作文件流等

### 使用方法

你可以通过通过下面方式读取文件

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

也可以通过下面方式打开一个文件流

```php
$stream = \Co\IO::File()->open('file.txt','r');
```

Stream遵循PSR规范的StreamInterface开发,对于Stream的操作请看Stream操作部分
