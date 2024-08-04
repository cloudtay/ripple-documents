---
title: 睡眠 - \P\sleep
description: \P\sleep函数用于挂起当前协程, 让出CPU资源, 其他协程能够继续执行。
keywords: ['PRipple', 'PHP', '协程', '高性能', '高并发', '睡眠', '挂起', 'CPU资源']
---

### API

```php
namespace P;

function sleep(int $second): void;
```

#### 参数说明

| 参数      | 类型  | 说明                   |
|---------|-----|----------------------|
| $second | int | 睡眠时间,单位秒,支持小数精度为0.1秒 |

#### 返回值

无返回值

### 概述

> Sleep (睡眠),用户暂停当前协程的执行, 让出CPU处理其他代办事项。

- 在`纤程空间`内使用`\P\sleep`函数: 会挂起当前协程, 让出CPU资源, 其他协程能够继续执行。
- 在`纤程空间`外使用`\P\sleep`函数: 会挂起当前主程, 让出CPU资源, 其他协程能够继续执行。

`\P\sleep` 与 `\sleep` 不同, 它作用于当前协程, 而不是整个进程。

### 基础用法

```php
\P\async(function () {
    \P\sleep(1);
    
    echo 'async task';
});

\P\sleep(10); // 挂起主程10秒以便其他协程能够完成任务
```

### 注意事项

> 无

