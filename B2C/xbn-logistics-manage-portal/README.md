## 介绍

数据分析管理端项目。这个项目用于进行集成测试、发布部署等。

## 安装

```sh
    git clone http://gitlab.xbniao.com/frontend-analysis/xbn-logistics-manage-portal.git
    cd xbn-logistics-manage-portal
    npm install
```

## 代码结构

```dir
    src
        config
            menu.json  (菜单项配置)
        views
            app-root.vue  (系统框架页面)
            boot.vue  (启动首屏页面)
        boot.js   (启动脚本)
        modules.js   (引入的模块列表)
        index.html   (html页面模板)
```

## 主要命令

1. 生成部署包
```sh
    npm run build
``` 
然后将dist目录配置到nginx上、或以服务方式访问即可。

2. 代码检查
```sh
    npm run lint
```
3. 开发检查
```sh
    npm run dev
```

