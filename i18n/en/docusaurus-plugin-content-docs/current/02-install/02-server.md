---
title: Service Mode - Server
description: PRipple provides a memory-resident service mode operation, which can run your program as a service. Compared with the traditional CGI mode workflow, service mode operation can effectively improve the performance of the program and reduce unnecessary consumption of loading files. , In widespread practice, the performance of the service mode is much higher than that of the traditional CGI mode.
keywords: ['PRipple', 'PHP', 'coroutine', 'high performance', 'high concurrency', 'service mode', 'server', 'service running']
---

> ⚠️ This page was initialized by AI translation and may contain outdated or inaccurate information. If there are
> inaccuracies, please submit changes to correct these errors [Correct](https://github.com/cloudtay/p-ripple-documents)

### Overview

PRipple provides a memory-resident service mode operation, which can run your program as a service, compared to the
traditional CGI mode workflow:

> - Request 1: Load file -> Process request and respond
> - Request 2: Load file -> Process request and respond
> - Request 3: Load file -> Process request and respond

Service mode workflow:

> - Start: Load file->Start service
> - Request 1: Service->Process the request and respond
> - Request 2: Service->Process the request and respond
> - Request 3: Service->Process the request and respond

It can effectively improve the performance of the program and reduce unnecessary consumption of loading files. In
widespread practice, the performance of the service mode is much higher than the traditional CGI mode.

Currently, the project already supports ThinkPHP and Laravel. Take Laravel as an example

### installation method

> Install via Composer

```bash
composer require cclilshy/p-ripple-drive
```

### Deployment Reference

#### Workerman

```php
Worker::$eventLoopClass = Workerman::class;
Worker::runAll();
```

---

#### Webman

> Modify the configuration file config/server.php service configuration file

```php
return [
    //...
    'event_loop' => \Psc\Drive\Workerman::class,
];
```

---

#### Laravel

```bash
#Install
composer require cclilshy/p-ripple-drive

#run
php artisan p:server {action} {--listen=} {--threads=} {--daemon}

# action: start|stop|status, default is start

# -l | --listen Service listening address, the default is http://127.0.0.1:8008
# -t | --threads Number of service threads, default is 4
# -d | --daemon Whether to run as a daemon process, the default is false
```

access connection

> Visit `http://127.0.0.1:8008/

running result

![display](https://raw.githubusercontent.com/cloudtay/p-ripple-drive/main/assets/display.jpg)

#### How to use Laravel asynchronous file download

```php
Route::get('/download', function (Request $request) {
    return new BinaryFileResponse(__FILE__);
});
```

- Static file configuration

> Traditional FPM projects cannot directly access files under the public path in CLI running mode.
> You can configure the proxy to the public path through Nginx routing or create your own route to solve this need
> The following are two reference solutions (Laravel)

* Static file access solution (Nginx proxy)

> Configure Nginx pseudo-static

```nginx
location/{
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

- Static file access solution (standalone operation)

> Add Laravel routing items

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
#Install
composer require cclilshy/p-ripple-drive

#run
php think p:server

# -l | --listen Service listening address, the default is http://127.0.0.1:8008
# -t | --threads Number of service threads, default is 4
```

> open `http://127.0.0.1:8008/`
---

### Precautions

> In the CLI mode of `Laravel`, `ThinkPHP`, the `Controller` `Service` of the entire running process
> The singleton constructed by `Container` will only be constructed once at runtime by default (a globally unique
> controller object), and will not be destroyed during the entire running process.
> This should be of particular concern during the development process and the CLI mode is completely different from FPM
> in this regard, but this is one of the reasons why it can be as fast as rockets

> PRipple will not interfere with the operating mechanism of the framework, so we provide a solution for the above
> scenario. Taking Laravel as an example, middleware can be created to rebuild the controller on each request to ensure
> thread safety.

```php
//The code of the middleware handle part
$route = $request->route();
if ($route instanceof Route) {
    $route->controller = app($route->getControllerClass());
}
return $next($request);
```

> You need to have a certain understanding of the mechanism of CLI running mode, and know what will happen during the
> running process of the following functions to decide how to use them? For example
> `dd` `var_dump` `echo` `exit` `die`
