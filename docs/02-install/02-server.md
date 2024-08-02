---
title: 服务模式 - Server
---

### 概述

PRipple提供了常驻内存的服务模式运行，可以将你的程序作为一个服务运行，相对于传统CGI的模式工作流程:

> - 请求1: 加载文件->处理请求并响应
> - 请求2: 加载文件->处理请求并响应
> - 请求3: 加载文件->处理请求并响应

服务模式的工作流程:

> - 启动:           加载文件->启动服务
> - 请求1:          服务->处理请求并响应
> - 请求2:          服务->处理请求并响应
> - 请求3:          服务->处理请求并响应

能够有效的提高程序的性能，减少加载文件的无必要消耗, 在广泛的实践中，服务模式的性能要远远高于传统CGI模式。

目前，该项目已经支持 ThinkPHP 和 Laravel。以Laravel为例

### 安装过程

> 通过 Composer 安装

```bash
composer require cclilshy/p-ripple-drive
```

#### WorkerMan

```php
Worker::$eventLoopClass = Workerman::class;
Worker::runAll();
```

---

#### WebMan

> 修改配置文件config/server.php服务配置文件

```php
return [
    //...
    'event_loop' => \Psc\Drive\Workerman::class,
];
```

--- 

#### Laravel

```bash
#安装
composer require cclilshy/p-ripple-drive

#运行
php artisan p:run

# -l | --listen     服务监听地址,默认为 http://127.0.0.1:8008
# -t | --threads    服务线程数,默认为4
```

访问连接

> 访问 `http://127.0.0.1:8008/

运行效果

![display](https://raw.githubusercontent.com/cloudtay/p-ripple-drive/main/assets/display.jpg)

#### Laravel 异步文件下载使用方法

```php
Route::get('/download', function (Request $request) {
    return new BinaryFileResponse(__FILE__);
});
```

- 静态文件配置

> 传统的FPM项目在CLI运行模式下一般请求无法直接访问public路径下的文件
> 你可以通过Nginx路由方式配置代理到public路径或自行创建路由解决这一需求
> 以下是两种参考解决方案(Laravel)

* 静态文件访问解决方案(Nginx代理)

> 配置Nginx伪静态

```nginx
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://127.0.0.1:8008;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

- 静态文件访问解决方案(独立运行)

> 添加Laravel路由项

```php
if (PHP_SAPI === 'cli') {
    Route::where(['path' => '.*'])->get('/{path}', function (Request $request, \Illuminate\Http\Response $response, string $path) {
        $fullPath = public_path($path);
        if (file_exists($fullPath)) {
            $ext = pathinfo($fullPath, PATHINFO_EXTENSION);

            if (strtolower($ext) === 'php') {
                $response->setStatusCode(403);

            } elseif (str_contains(urldecode($fullPath), '..')) {
                $response->setStatusCode(403);

            } else {
                $mimeType = match ($ext) {
                    'css' => 'text/css',
                    'js' => 'application/javascript',
                    'json' => 'application/json',
                    'png' => 'image/png',
                    'jpg', 'jpeg' => 'image/jpeg',
                    'gif' => 'image/gif',
                    'svg' => 'image/svg+xml',
                    'ico' => 'image/x-icon',
                    'mp4' => 'video/mp4',
                    'webm' => 'video/webm',
                    'mp3' => 'audio/mpeg',
                    'wav' => 'audio/wav',
                    'webp' => 'image/webp',
                    'pdf' => 'application/pdf',
                    'zip' => 'application/zip',
                    'rar' => 'application/x-rar-compressed',
                    'tar' => 'application/x-tar',
                    'gz' => 'application/gzip',
                    'bz2' => 'application/x-bzip2',
                    'txt' => 'text/plain',
                    'html', 'htm' => 'text/html',
                    default => 'application/octet-stream',
                };
                $response->headers->set('Content-Type', $mimeType);
                $response->setContent(
                    P\await(P\IO::File()->getContents($fullPath))
                );
            }
            return $response;
        }
        return $response->setStatusCode(404);
    });
}
```

--- 

### ThinkPHP

```bash
#安装
composer require cclilshy/p-ripple-drive

#运行
php think p:run

# -l | --listen     服务监听地址,默认为 http://127.0.0.1:8008
# -t | --threads    服务线程数,默认为4
```

> open `http://127.0.0.1:8008/`
---

### 注意事项

> 在`Laravel`,`ThinkPHP下`的CLI模式, 整个运行过程的 `Controller` `Service`
> 等 `Container` 构建的单例,默认只会在运行时被构造一次(全局唯一控制器对象), 且在整个运行过程中不会被销毁
> 在开发过程应特别关心这一点与CLI模式在这点上与FPM截然不同, 但这也是它能够拥有火箭般速度的原因之一

> PRipple不会干涉框架的运行机制, 因此我们为上述场景提供了解决方案以Laravel例,可以创建中间件以在每次请求时重新构建控制器以保证线程安全

```php
//中间件handle部分的代码
$route = $request->route();
if ($route instanceof Route) {
    $route->controller     = app($route->getControllerClass());
}
return $next($request);
```

> 你需要有一定了解CLI运行模式的机制,并知悉下列函数在运行过程中会发生什么以决定如何使用它们?如
> `dd` `var_dump` `echo` `exit` `die`
