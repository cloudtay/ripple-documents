---
title: 套接字 (Socket)
description: ripple中的套接字库, 用于实现异步网络通信, 包括创建套接字连接, SSL连接等。
keywords: [ 'ripple', 'PHP', '协程', '高性能', '高并发', '套接字', 'Socket', 'SSL' ]
---

### 访问组件

```php
use Co\IO;

IO::Socket();
```

### API

```php
// 创建一个套接字连接
public function connect(string $address, int $timeout = 0, mixed $context = null): Promise;

// 监听一个套接字服务器
public function server(string $address, mixed $context = null): Promise;

// 将套接字连接转换为SSL连接
public function enableSSL(SocketStream $stream): Promise;

// 监听一个SSL套接字服务器
public function serverWithSSL(string $address, mixed $context = null): Promise;

// 创建一个SSL套接字连接
public function connectWithSSL(string $address, int $timeout = 0, mixed $context = null): Promise;

```

### 概述

建立套接字连接是ripple的一个重要功能, 通过套接字连接可以实现异步的网络通信, 例如: HTTP服务器, WebSocket服务器等。
访问Socket库的函数都会返回Promise对象, 你可以通过`await`关键字等待Promise对象的结果。或通过`then`方法处理异步结果。
Socket库隐藏了连接握手/SSL握手等细节, 你只需要关注业务逻辑即可。

### 例子

> 一个简单的例子说明Http服务器的实现,也是基础的SocketStream应用例子

```php
use Co\IO;
use function Co\async;
use function Co\await;

async(function(){
    $server = await(
        IO::Socket()->server('tcp://127.0.0.1:8008')
    );
    
    while(1){
        /**
         * @var SocketStream $client
         */
        $client = await(
            IO::Socket()->streamSocketAccept($server)
        );
        
        $client->write(
            "HTTP/1.1 200 OK\r\n".
            "Content-Type: text/html; charset=UTF-8\r\n".
            "Content-Length: 11\r\n".
            "\r\n".
            "Hello World"
        );
        
        $client->close();
    }
});

\Co\wait();
```

