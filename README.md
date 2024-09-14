# Gbase8c-Modeling-Platform

南大通用 Gbase8c 数据库建模平台，提供关系型数据库的基础建模功能。

## 功能介绍

1. 支持图形化设计表、列、数据类型、主键等功能。
2. 支持设计好的数据表生成对应的建表语句并在数据库中生成表。
3. 支持通过数据库中的表生成图形化的表关系(ER图)。

## 技术栈

前端基于 Vue3 + Naive-UI + Pinia + VueRouter + TypeScript + Vite。

后端基于 Bun + Elysia + Knex + Node-OpenGauss。

## 前置条件

1. 部署后端的服务器需要安装 Gbase8c。
2. 部署后端的服务器需要安装 Bun。

## 项目配置

在根目录下创建config文件夹，该文件夹为配置文件夹。

在config下新建client.config.ts，该文件为前端配置文件，内容格式如:

```ts
// 项目根目录/config/client.config.ts
export default {
    // 后端接口地址
    baseURL: 'http://localhost:4444'
}
```

在config下新建server.config.ts，该文件为后端配置文件，内容格式如:

```ts
// 项目根目录/config/server.config.ts
export default {
    // 访问密钥数组，用于进入平台的鉴权
    auth: ['dbf95d91e90a0daf7bcba814b0619d98211596fd'],
    // jwt密钥
    jwt: {
        secret: '9228a78b9a5e3376d5270b47a361fcc73ae71107'
    },
    // 数据库配置
    db: {
        // 数据库地址
        host: 'localhost',
        // 数据库端口
        port: 5432,
        // 数据库用户名
        username: 'gbase',
        // 数据库名称
        dbname: 'testdb',
        // 数据库密码
        password: 'Aa123@!'
    }
}
```

## 项目启动

分为前端启动和后端启动两个部分。

### 前端启动

进入/packages/client，使用任意包管理工具执行以下脚本，这里以pnpm为例:

```bash
pnpm dev
```

执行完成后，在浏览器中打开 http://localhost:3000，即可访问前端页面。

### 后端启动

进入/packages/server，使用任意包管理工具执行以下脚本，这里以pnpm为例:

```bash
pnpm dev
```

执行完成后，会在控制台输出后端启动成功的信息，即可访问后端接口。

## 项目构建

分为前端构建和后端构建两个部分。

### 前端构建

进入/packages/client，使用任意包管理工具执行以下脚本，这里以pnpm为例:

```bash
pnpm build
```

执行完成后，会在 /packages/client/dist 下生成构建好的前端文件。

### 后端构建(编译为二进制可执行文件)

进入/packages/server，使用任意包管理工具执行以下脚本，这里以pnpm为例:

```bash
pnpm compile
```

执行完成后，会在 /packages/server/dist 下生成名为 **server** 的二进制可执行文件。

### 后端构建(Bundle)

进入/packages/server，使用任意包管理工具执行以下脚本，这里以pnpm为例:

```bash
pnpm compile
```

执行完成后，会在 /packages/server/dist 下生成名为 **server.js** 的打包好的js文件。
