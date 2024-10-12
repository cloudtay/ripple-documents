---
title: \Co\defer
description: ripple中支持通过\Co\defer方法延迟执行一个闭包函数, 用于处理异步操作。
keywords: ['ripple', 'PHP', '协程', '高性能', '高并发', '递延', '异步']
---

### API

```php
namespace Co;

function defer(Closure $closure): string;
```

#### 参数说明

| 参数       | 类型      | 说明                  |
|----------|---------|---------------------|
| $closure | Closure | 延迟执行的闭包函数,在运行在事件上下文 |

### 闭包参数

无

### 返回值

返回当前事件唯一标识, 允许使用`\Co\cancel`方法取消事件

### 概述

> Defer (延迟执行) , 在当前事件结束后立即执行一个闭包函数, 通常用于资源释放等操作。

### 基础用法

```php
\Co\async(function () {
    $file = fopen('file.txt', 'w');

    \Co\defer(function () use ($file) {
        //TODO: 此处的代码不会立即执行
        fclose($file);
    });
    
    fwrite($file, 'hello world');
    return 'async task';
});
```

> defer在实际场景中很有用,例如在异步请求结束后,释放资源等操作。

```php
public function index(Request $request) : JsonResponse
{
    \Co\defer(function() use ($request){
        $response = \Co\await(
            \Co\Net::HTTP()->Guzzle()->getAsync('http://example.com');
        );
    
        $channel = \Co\IO::Channel()->open('websocket');
        $channel->send($response->getBody()->getContent());
        
        $channel->close();
    });
    
    return new JsonResponse(['status' => 'ok']);
}
```

#### 提示

> 在ripple提供的脚手架中,绝大多数框架的控制器请求都会发生在async空间中, 你可以在控制器中使用`\Co\defer`方法
