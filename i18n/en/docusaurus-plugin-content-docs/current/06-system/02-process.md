---
title: Multi-process (Process)
description: The Process library in ripple provides a basic process manager for starting a new process in ripple and can communicate through pipes.
keywords: [ 'ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'process', 'pipeline', 'Process' ]
---

### Parallel module

#### illustrate

> Ripple provides parallel running support of runtime, which relies on multiple processes and abstracts the details of
> multiple processes. Users only need to care about how to use parallel running.
> You can use almost any PHP statement in a closure, but there are still things you need to pay attention to

#### Notes

* In the child process, all context resources inherit the resources of the parent process, including open files,
  connected databases, connected networks, and global variables
* All defined events such as `onRead`, `onWrite`, etc. will be forgotten in the child process
* You cannot create subprocesses in async such as

```php
async(function(){
    $task = Co\System::Process()->task(function(){
        // child process
    });
    $task->run();
});
```

> This will throw an exception `ProcessException`

#### Usage

```php
$task = Co\System::Process()->task(function(){
    sleep(10);
    
    exit(0);
});

$runtime = $task->run(); // Return a Runtime object

$runtime->stop(); // Cancel the run (signal SIGTERM)
$runtime->stop(true); // Forced termination, equivalent to $runtime->kill()
$runtime->kill(); // Forced termination (signal SIGKILL)
$runtime->signal(SIGTERM); //Send a signal, providing a more refined control method
$runtime->then(function($exitCode){}); // The code here will be triggered when the program exits normally, code is the exit code
$runtime->except(function(){}); // The code here will be triggered when the program exits abnormally. You can handle exceptions here, such as process daemon/task restart
$runtime->finally(function(){}); // This code will be triggered whether the program exits normally or abnormally.
$runtime->getProcessId(); // Get the child process ID
$runtime->getPromise(); // Get the Promise object
```
