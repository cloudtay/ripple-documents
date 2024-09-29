---
title: 进程 - Process
description: Ripple中的Process库提供了一个基础的进程管理器, 用于在Ripple中启动一个新的进程, 并且可以通过管道进行通信。
keywords: ['Ripple', 'PHP', '协程', '高性能', '高并发', '进程', '管道', 'Process']
---

### Parallel 模块

#### 说明

> Ripple提供了 runtime 的并行运行支持,依赖于多进程,抽象了多进程的细节,使用者只需要关心并行运行的使用方式 ,
> 你可以在闭包中使用几乎所有的PHP语句, 但依然存在需要注意的事项

#### 注意事项

* 在子进程中,所有上下文资源都继承了父进程的资源,包括已打开的文件,已连接的数据库,已连接的网络,全局变量
* 所有定义的Event如`onRead`、`onWrite`等都会在子进程中被遗忘
* 你不能在async中创建子进程如

```php
async(function(){
    $task = Co\System::Process()->task(function(){
        // 子进程
    });
    $task->run();
});
```

> 这将会抛出一个异常 `ProcessException`

#### 用法

```php
$task = Co\System::Process()->task(function(){
    sleep(10);
    
    exit(0);
});

$runtime = $task->run();                // 返回一个Runtime对象

$runtime->stop();                       // 取消运行(信号SIGTERM)
$runtime->stop(true);                   // 强制终止,等同于$runtime->kill()
$runtime->kill();                       // 强制终止(信号SIGKILL)
$runtime->signal(SIGTERM);              // 发送信号,提供了更精细的控制手段
$runtime->then(function($exitCode){});  // 程序正常退出时会触发这里的代码,code为退出码
$runtime->except(function(){});         // 程序非正常退出时会触发这里的代码,可以在这里处理异常,如进程守护/task重启
$runtime->finally(function(){});        // 无论程序正常退出还是非正常退出都会触发这里的代码
$runtime->getProcessId();               // 获取子进程ID
$runtime->getPromise();                 // 获取Promise对象
```
