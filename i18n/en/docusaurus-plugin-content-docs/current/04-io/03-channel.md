---
title: Channel
description: Channel in ripple is a core concept in the ripple framework and is used for communication between multiple processes. The Channel object represents a data channel for communication between multiple processes.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'channel', 'Channel' ]
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### Access components

```php
use \Co\IO;

IO::Channel();
```

###API

```php
//Access a channel
public function open(string $name): Channel;

//Create a channel
public function make(string $name): Channel;
```

### Overview

> Channel is a data channel in ripple, used for communication between multiple processes. It is worth noting that
> ripple’s Channel scope is local and global.
> You can use Channel as follows


Reading and writing of this Channel are atomic operations, ensuring data consistency.

> When multiple processes read at the same time, only one process can read the data, and other processes will be blocked
> until the data is read. If you set Channel to be a non-blocking pipe,
> will return null without throwing an exception

> When multiple processes write at the same time, the process that obtains the write lock will write the data, and other
> processes will be blocked until the data is written. Data consistency is ensured.

### example

```php
$channel = \Co\IO::Channel()->make('common');

$task = \Co\System::Process()->task(function() use ($channel){
    $channel->setBloking(true);
    
    while($task = $channel->receive()){
        //TODO: consumption task
    });
});

//Run 10 subroutines to process tasks
for($i = 0; $i < 10; $i++){
    $task->run();
}

while(1){
    // TODO: do something
    $task->send('task');
}
```

### Scenario example

You can also use Channels to work together between multiple applications, such as Workerman+Laravel

> Workerman part of the code

```php
$worker = new Worker('websocket://127.0.0.1:2346');
$worker->onWorkerStart = function() {
    $channel = \Co\IO::Channel()->make('websocket');
    $channel->setBloking(false);
    
    Timer::add(1, function() use ($channel){
        if($message = $channel->receive()){
            // TODO: consumption task
        }
    });
}

Worker::$eventLoopClass = Driver::class;
Worker::runAll();
```

> Laravel controller part code

```php
public function index(Request $request) : JsonResponse
{
    $channel = \Co\IO::Channel()->open('websocket');
    $channel->send($request->query('message'));
    
    return new JsonResponse(['status' => 'ok']);
}
```

### Precautions

Channel's communication data is serialized based on PHP serialization and supports the transmission of data types such
as objects/arrays/strings, but does not support the transmission of non-serializable data types such as resources.
Objects can be transferred, but make sure the target process has the same class definition. Otherwise, deserialization
will not succeed.
