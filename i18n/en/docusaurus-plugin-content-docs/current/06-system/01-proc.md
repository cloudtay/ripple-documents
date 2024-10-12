---
title: Proc
description: The Proc library in ripple provides a basic process manager for starting a new process in ripple and can communicate through pipes.
keywords: ['ripple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'process', 'pipeline', 'Proc']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/ripple-documents)

### Proc in ripple

ripple provides a Proc library to simplify this operation, allowing you to use pipelines more conveniently.

```php
//Open a new session, parameter 1 is the default binary file path of the session, the default is /usr/bin/php
$session = \Co\System::Proc()->open();

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

\Co\run();
```

where `$session` is a `Co\Proc\ProcSession` object
The session is executed in a separate process, and commands can be entered into the session through the `input` method,
and the input stream can be closed through the `inputEot` method.
You can also use more methods to control the behavior of the session, such as signal sending, session closing, etc.,
process kill, etc. For more methods, please refer to the documentation:
