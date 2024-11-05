---
title: Socket
description: The socket library in ripple is used to implement asynchronous network communication, including creating socket connections, SSL connections, etc.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'socket', 'Socket', 'SSL' ]
---

### Access components

```php
use Co\IO;

IO::Socket();
```

###API

```php
use Ripple\Socket\SocketStream;

// Create a socket connection
public function connect(string $address, int $timeout = 0, mixed $context = null): StreamSocket;

// Listen to a socket server
public function server(string $address, mixed $context = null): StreamSocket;

// Convert socket connection to SSL connection
public function enableSSL(SocketStream $stream): StreamSocket;

// Listen to an SSL socket server
public function serverWithSSL(string $address, mixed $context = null): StreamSocket;

// Create an SSL socket connection
public function connectWithSSL(string $address, int $timeout = 0, mixed $context = null): StreamSocket;

```

### Overview

Establishing a socket connection is an important function of ripple. Asynchronous network communication can be achieved
through socket connections, such as HTTP server, WebSocket server, etc.
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
    $server = IO::Socket()->server('tcp://127.0.0.1:8008');
    
    while(1){
        $server->waitForReadable();
        $client = $server->accept();
        
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
