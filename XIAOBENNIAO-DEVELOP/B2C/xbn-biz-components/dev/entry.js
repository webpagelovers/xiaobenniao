import index from '../src/test';

import BootStrap from 'nt-portal-framework';
import BootVue from './root.vue';

import 'nt-element/lib/theme-cobalt-blue/index.css';

const booter = new BootStrap({
    mount: '#xbn-app',
    vueRoot: BootVue,
    modules: [index],
    servers: {
        default: {  //这是默认写法， 如果你的模块只会访问一个后台服务器地址，则不需要修改
            baseURL: 'https://api.github.com/'
        },
        github : {    //这里定义了另一个服务器， 通过修改baseURL浏览器会跨域访问到这里
            baseURL: 'https://api.github.com/',
        },
        webSocket :{
            baseURL: 'ws://192.168.30.191:60001/ws'
        }
    },
    routePath: '/header',
    authRequired: true
});

booter.startUp();
