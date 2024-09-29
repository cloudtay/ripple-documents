---
title: Service Process - Worker
description: Ripple provides a memory-resident service mode operation, which can run your program as a service. Compared with the traditional CGI mode workflow, service mode operation can effectively improve the performance of the program and reduce unnecessary consumption of loading files. , In widespread practice, the performance of the service mode is much higher than that of the traditional CGI mode.
keywords: ['Ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'service mode', 'server', 'service running']
---

### Overview

Using Ripple, you can create a process manager + Worker to start a custom service

### Process Manager

```php
$manager = new \Psc\Worker\Manager();

// API - The following operations are only allowed in the main process

//Send a reload signal to the specified service
Manager::reload(string|null $name);

//Add service
Manager::addWorker(Worker $worker);

// Remove service
Manager::removeWorker(string $name);

// Stop service
Manager::stop();

// Stop the specified service
Manager::stopWorker(string $name);

//Send a command to the specified service
Manager::commandToWorker(Command $command, string $name);

//Send commands to all services
Manager::commandToAll(Command $command);
```

### Service process

```php
$ws = new Ws();

// API - The following operations are allowed in the service process for cross-service communication

//Send commands to all services
Worker::commandToAll(Command $command);

//Send a command to the specified service
Worker::commandToWorker(Command $command,string $name);

// Get a unique ID from the service group
Worker::syncId();
```

### Service process interface

```php
class Ws extends \Psc\Worker\Worker {

    public function getName(): string
    {
        //TODO: return service name
    }
    
    public function getCount(): int
    {
        //TODO: Return the number of working processes
    }
    
    public function register(Manager $manager): void
    {
        //TODO: Initialization service, occurs in the main process, usually used for port monitoring/external controller monitoring, etc.
    }
    
    public function boot(): void
    {
        //TODO: Service startup, occurs in the worker process
    }
    
    public function onCommand(Command $workerCommand): void
    {
        //TODO: processing command, used for communication between services
    }
    
    public function onReload(): void
    {
        //TODO: Triggered when the working process receives the reload signal. After receiving this signal, the process should be actively released and the process closed.
    }
}
```
