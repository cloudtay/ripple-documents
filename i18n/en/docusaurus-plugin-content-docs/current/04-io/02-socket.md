---
title: Socket - Socket
description: The socket library in PRipple is used to implement asynchronous network communication, including creating socket connections, SSL connections, etc.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'socket', 'Socket', 'SSL']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Access components

```php
use Co\IO;

IO::Socket();
```

###API

```php
//Create an SSL socket connection
public function streamSocketClientSSL(string $address, int $timeout = 0, mixed $context = null): Promise;

// Create a socket connection
public function streamSocketClient(string $address, int $timeout = 0, mixed $context = null): Promise;

// Convert socket connection to SSL connection
public function streamEnableCrypto(SocketStream $stream): Promise;

// Listen to an SSL socket server
public function streamSocketServerSSL(string $address, mixed $context = null): Promise;

// Listen to a socket server
public function streamSocketServer(string $address, mixed $context = null): Promise;

//Accept a socket connection
public function streamSocketAccept(SocketStream $server): Promise;
```

### Overview

Establishing a socket connection is an important function of PRipple. Asynchronous network communication can be achieved
through socket connections, such as: HTTP server, WebSocket server, etc.
All functions that access the Socket library will return a Promise object. You can wait for the result of the Promise
object through the `await` keyword. Or handle asynchronous results through the `then` method.
The Socket library hides details such as connection handshake/SSL handshake, you only need to focus on the business
logic.

### example

> A simple example illustrates the implementation of Http server, which is also a basic SocketStream application
> example.

```php
use Co\IO;
use function Co\async;
use function Co\await;

async(function(){
    $server = await(
        IO::Socket()->streamSocketServer('tcp://127.0.0.1:8008')
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

\Co\tick();
```
