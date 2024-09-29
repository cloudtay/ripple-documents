---
title: 服务进程 - Worker
description: Ripple提供了常驻内存的服务模式运行，可以将你的程序作为一个服务运行，相对于传统CGI的模式工作流程, 服务模式运行能够有效的提高程序的性能，减少加载文件的无必要消耗, 在广泛的实践中，服务模式的性能要远远高于传统CGI模式。
keywords: ['Ripple', 'PHP', '协程', '高性能', '高并发', '服务模式', '服务端', '服务运行']
---

### 概述

使用Ripple,你可以从创建一个进程管理器+Worker来启动自定义服务

### 进程管理器

```php
$manager = new \Psc\Worker\Manager();

// API - 以下操作仅允许在主进程中进行

// 向指定服务发送重载信号
Manager::reload(string|null $name); 

// 添加服务
Manager::addWorker(Worker $worker); 

// 移除服务
Manager::removeWorker(string $name); 

// 停止服务
Manager::stop(); 

// 停止指定服务
Manager::stopWorker(string $name);

// 向指定服务发送命令
Manager::commandToWorker(Command $command, string $name);

// 向所有服务发送命令
Manager::commandToAll(Command $command); 
```

### 服务进程

```php
$ws = new Ws();

// API - 以下操作允许在服务进程中进行,用于跨服务通信

// 向所有服务发送命令
Worker::commandToAll(Command $command);

// 向指定服务发送命令
Worker::commandToWorker(Command $command,string $name);

// 从服务群获取一个唯一ID
Worker::syncId();
```

### 服务进程接口

```php
class Ws extends \Psc\Worker\Worker {

    public function getName(): string
    {
        //TODO: 返回服务名称
    }
    
    public function getCount(): int
    {
        //TODO: 返回工作进程数
    }
    
    public function register(Manager $manager): void
    {
        //TODO: 初始化服务,发生于主进程,通常用于端口监听/外部控制器监听等
    }
    
    public function boot(): void
    {
        //TODO: 服务启动,发生于工作进程
    }
    
    public function onCommand(Command $workerCommand): void
    {
        //TODO: 处理命令,用于服务之间通信
    }
    
    public function onReload(): void
    {
        //TODO: 工作进程收到重载信号时触发,收到此信号之后应当主动释放资源后关闭进程
    }
}
```
