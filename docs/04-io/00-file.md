---
title: 文件 - File
---

### 访问组件

```php
\P\IO::File() : File;
```

### API

```php
public function getContents(string $path): Promise;
public function open(string $path, string $mode): Stream;
```

### 概述

PRipple提供了对于文件的异步操作方法, 允许开发者通过不堵塞进程的stream方式读取文件内容, 操作文件流等

### 使用方法

你可以通过通过下面方式读取文件

```php
\P\IO::File()->getContents(__FILE__)->then(function(string $value){
    
});
```

```php
\P\async(function(){
    $value = \P\await(
        \P\IO::File()->getContents(__FILE__)
    );
});
```

也可以通过下面方式打开一个文件流

```php
$stream = \P\IO::File()->open('file.txt','r');
```

Stream遵循PSR规范的StreamInterface开发,对于Stream的操作请看Stream操作部分
