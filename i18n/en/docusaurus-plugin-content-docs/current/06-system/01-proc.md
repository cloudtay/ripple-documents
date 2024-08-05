---
title: Launcher - Proc
description: The Proc library in PRipple provides a basic process manager for starting a new process in PRipple and can communicate through pipes.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'process', 'pipeline', 'Proc']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Proc in PRipple

PRipple provides a Proc library to simplify this operation, allowing you to use pipelines more conveniently.

```php
//Open a new session, parameter 1 is the default binary file path of the session, the default is /usr/bin/php
$session = \P\System::Proc()->open();

//Enter commands into the session
$session->input($command);

//Close the input stream
$session->inputEot();

$session->onClose = function () {
    //TODO: Operations to be performed when the session is closed
};

$session->onErrorMessage = function ($message) {
    //TODO: The message will be output from this callback function
};

$session->onMessage = function ($message) {
    //TODO: The message will be output from this callback function
};

\P\run();
```

where `$session` is a `P\Proc\ProcSession` object
The session is executed in a separate process, and commands can be entered into the session through the `input` method,
and the input stream can be closed through the `inputEot` method.
You can also use more methods to control the behavior of the session, such as signal sending, session closing, etc.,
process kill, etc. For more methods, please refer to the documentation:
