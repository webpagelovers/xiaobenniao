## 介绍

集货转运前台页面项目。 这个项目用于进行集成测试、发布部署等。

## 安装

```sh
    git clone http://gitlab.xbniao.com/frontend-logistics/xbn-logistics-portal.git
    cd xbn-logistics-portal
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

## 编译及部署

```sh
    npm run build
``` 

然后将 dist目录配置到nginx上、或以服务方式访问即可



