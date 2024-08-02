---
title: 启动器 - Proc
---

### PRipple中的Proc

PRipple中的提供了Proc库来简化这个操作,让你可以更加方便的使用管道

```php
//打开一个新会话,参数1为会话的默认二进制文件路径,默认为/usr/bin/php
$session = \P\System::Proc()->open();

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

\P\run();
```

其中`$session`是一个`P\Proc\ProcSession`对象
该会话在一个独立的进程中执行,并且可以通过`input`方法向会话输入命令,通过`inputEot`方法关闭输入流
还可以通过更多方法来控制会话的行为,例如信号发送,会话关闭等,进程kill等等更多方法欢迎从文档查阅:
