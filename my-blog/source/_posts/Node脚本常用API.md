---
title: Node脚本常用API
date: 2023-01-17
keywords: JavaScript, Node
cover: https://s2.loli.net/2023/01/17/cQqD2HUCWafjGMB.png
tags:
  - JavaScript
---

## 前言

日常中，当要写一些脚本或者 webpack 配置的时候，需要用到一些 Node 的 API。这里整理了一下常用的 Node 相关模块 API，供快速熟悉使用。

<br/>

## path

{% note info no-icon %}
path 模块文档：http://nodejs.cn/api/path.html
{% endnote %}

### **dirname，**filename

- \_\_dirname：可以看作是 nodejs 中的全局变量，它始终表示当前执行文件所在目录的完整目录名（绝对路径）
- \_\_filename：可以看作是 nodejs 中的全局变量，它始终表示当前执行文件的完整文件名(完整绝对路)

### path.parse(path)

解析路径返回一个对象，对象的属性表示 path 的元素。

例子：

```javascript
path.parse('/home/user/dir/file.txt');
// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }


// 图式
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

### path.join([...paths])

使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。

例子：

```javascript
path.join("/foo", "bar", "baz/asdf", "quux", "..");
// 返回: '/foo/bar/baz/asdf'

path.join("foo", {}, "bar");
// 抛出 'TypeError: Path must be a string. Received {}'
```

### path.resolve([...paths])

把一个路径或路径片段的序列解析为一个绝对路径。

例子：

```javascript
path.resolve("/foo/bar", "./baz");
// 返回: '/foo/bar/baz'

path.resolve("/foo/bar", "/tmp/file/");
// 返回: '/tmp/file'

path.resolve("wwwroot", "static_files/png/", "../gif/image.gif");
// 如果当前工作目录为 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

### path.join 和 path.resolve 的区别

1. join 是把各个 path 片段连接在一起， resolve 把‘／’当成根目录

```javascript
path.join("/a", "/b");
// /a/b
path.resolve("/a", "/b");
// /b
```

2. resolve 在传入非/路径时，会自动加上当前目录形成一个绝对路径，而 join 仅仅用于路径拼接

```javascript
// 当前路径为
/Users/xiao/work/test
path.join('a', 'b', '..', 'd');
// a/d
path.resolve('a', 'b', '..', 'd');
// /Users/xiao/work/test/a/d
```

### 当前路径

1. 获取当前 NodeJS 文件所在目录：\_\_dirname
2. 获取启动脚本所在目录：path.resolve()

<br/>

## fs-extra

{% note info no-icon %}
fs 模块文档：http://nodejs.cn/api/fs.html
fs-extra 文档：https://www.npmjs.com/package/fs-extra
{% endnote %}

fs 模块的功能强大，单 API 比较繁杂。fs-extra 是 fs 的一个扩展，提供了非常多的便利 API，并且继承了 fs 所有方法和为 fs 方法添加了 promise 的支持。
下列方法都是异步的，在方法后面加 Sync 后缀即对应同步方法。

### ensureDir(dir: string, [callback: func])

如果目录结构不存在，则创建它，如果目录存在，则不进行创建，类似 mkdir -p。

例子：

```javascript
const fs = require("fs-extra");
const dir = "/tmp/this/path/does/not/exist";

fs.ensureDir(dir)
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error(err);
  });
```

### ensureFile(file: string, [callback: func])

确保文件存在。如果请求创建的文件位于不存在的目录中，则会创建这些目录。如果该文件已存在，则不进行修改。

例子：

```javascript
const fs = require("fs-extra");
const file = "/tmp/this/path/does/not/exist/file.txt";

fs.ensureFile(file)
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error(err);
  });
```

### remove(path: string, [callback: func])

删除文件或目录。该目录可以包含内容, 类似 rm -rf

例子：

```javascript
const fs = require("fs-extra");

fs.remove("/tmp/myfile")
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error(err);
  });
```

### emptyDir(dir: string, [callback: function])

确保目录为空。如果目录不为空，则删除目录内容。如果该目录不存在，则创建该目录。目录本身不会被删除。

例子：

```javascript
const fs = require("fs-extra");

fs.emptyDir("/tmp/some/dir")
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error(err);
  });
```

### readFile | readJson(file: string, [options: object, callback: func])

读取文件内容 ｜ 读取 JSON 文件，然后将其解析为对象

例子：

```javascript
const path = require("path");
const fs = require("fs-extra");

fs.readFile(path.resolve("data.txt"), {
  encoding: "utf8",
})
  .then((content) => {
    console.log(content); // 这是一篇文章
  })
  .catch((err) => {
    console.error(err);
  });

fs.readJson(path.resolve("data.json"))
  .then((content) => {
    console.log(content); // { name: 'shane' }
  })
  .catch((err) => {
    console.error(err);
  });
```

### writeFile | writeJson(file: string, [options: object, callback: func])

将内容写入文件 ｜ 将对象写入 JSON 文件，必须保证目录存在外。
另外有 outputFile ｜ outputJson 方法，如果父目录不存在，则会自动创建它。

例子：

```javascript
const path = require("path");
const fs = require("fs-extra");

fs.writeFile(path.resolve("data.txt"), "哈哈哈哈哈", {
  encoding: "utf8",
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

fs.writeJSON(
  path.resolve("data.json"),
  { age: 18 },
  {
    spaces: 2, // 缩进的空格数
  }
)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
```

### copy | move(src: string, dest: string, [options: object, callback: func])

复制文件或目录，目录可以包含内容，类似 cp -r
移动文件或目录，甚至跨设备。 类似 mv

例子：

```javascript
const fs = require("fs-extra");

fs.copy("/tmp/myfile", "/tmp/mynewfile")
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error(err);
  });

fs.move("/tmp/file.txt", "/tmp/this/path/does/not/exist/file.txt", {
  overwrite: true,
})
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error(err);
  });
```

<br/>

## 环境变量

环境变量是 Nodejs 最重要的概念之一，它允许应用程序在开发、阶段和生产等不同环境中表现不同。

它通常被用于：

- 保护秘密（数据库配置、API 密钥等）
- 分配动态的系统资源，如 port_name、host_name 等

### 简单使用

1. package.json 运行脚本中添加环境变量

   ```json
   {
     "scripts": {
       "dev": "NODE_ENV=development node src/index.js"
     }
   }
   ```

2. js 逻辑中获取环境变量

   ```javascript
   console.log(process.env.NODE_ENV);
   ```

### .env 文件配置环境变量

1. 安装 dotenv 包

   ```bash
   npm install dotenv --save
   ```

2. 根目录创建.env 文件

   ```env
   name=shane
   age=25
   ```

3. index.js 添加逻辑，加载配置

   ```javascript
   const dotenv = require("dotenv");

   dotenv.config();

   console.log(process.env); // 可获取到name, age配置
   ```
