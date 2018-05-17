
//1 获取所有导入的模块
import modules from './modules';

//2.引入页面根框架组件 一般最少包括登录页、首页框架。也可能含有其他种框架页
import BootVue from './views/boot.vue';

//3.引用启动框架
import BootStrap from 'nt-portal-framework';

import Login from './views/login.vue';
import Register from './views/register.vue';

// ECMAScript 2015
// import 'babel-polyfill';

import 'nt-element/lib/theme-lake-blue/index.css';
import config from './config/config.js';

const routes = [
    { path: '/login',component: Login},
    { path: '/register',component: Register },
    { path: '/', component:BootVue, name: 'main' }
];


const booter = new BootStrap({
    mount: '#xbn-app',
    vueRoot: {},
    modules: modules,
    loginPath: '/login',
    authRequired: true,
    appCode: '2015',
    servers: config.servers,
    routePath: '/settled/settledList',
    topRoutes :routes
});


booter.startUp();
