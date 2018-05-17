# 模块说明

集货转运项目物流计划-前台

## 安装

```sh
    npm install i xbn-logistics-plan
```

## 开发

```sh
    git clone http://gitlab.xbniao.com/frontend-logistics/xbn-logistics-plan.git
    cd xbn-logistics-plan
    npm install 
    npm run dev
```
打开
    http://localhost:8081/


## 代码结构 

```dir
    build  //编译脚本， 统一
    config  //编译脚本， 统一
    dev      //单模块启动
    src
        components 
        models
            lclplan.js  (物流计划数据模型)
        pages
            planlist (物流计划列表)
                index.vue
        index.js (导出配置)
    test
    .babelrc
    .gitignore
    .eslintrc.js
    package.json

```

## 对外服务


