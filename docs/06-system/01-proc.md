---
title: 启动器 - Proc
description: Ripple中的Proc库提供了一个基础的进程管理器, 用于在Ripple中启动一个新的进程, 并且可以通过管道进行通信。
keywords: ['Ripple', 'PHP', '协程', '高性能', '高并发', '进程', '管道', 'Proc']
---

### Ripple中的Proc

Ripple中的提供了Proc库来简化这个操作,让你可以更加方便的使用管道

```php
//打开一个新会话,参数1为会话的默认二进制文件路径,默认为/usr/bin/php
$session = \Co\System::Proc()->open();

//向会话输入命令
$session->input($command);

//关闭输入流
$session->inputEot();

$session->onClose = function () {
    //TODO: 会话关闭时执行的操作
};

$session->onErrorMessage = function ($message) {
    //TODO: 消息会从该回调函数中输出
};

$session->onMessage = function ($message) {
    //TODO: 消息会从该回调函数中输出
};

\Co\run();
```

其中`$session`是一个`Co\Proc\ProcSession`对象
该会话在一个独立的进程中执行,并且可以通过`input`方法向会话输入命令,通过`inputEot`方法关闭输入流
还可以通过更多方法来控制会话的行为,例如信号发送,会话关闭等,进程kill等等更多方法欢迎从文档查阅:
