import index from '../src/index';
import BootStrap from 'nt-portal-framework';
import BootVue from './root.vue';
import 'nt-element/lib/theme-lake-blue/index.css';
import loginModule from 'xbn-biz-common/src/index';

const booter = new BootStrap({
    mount: '#xbn-app',
    vueRoot: BootVue,
    modules: [index,loginModule],
    appCode: '1005',
    authRequired: true,
    loginPath: '/login',
    servers: {
        default: {  //这是默认写法， 如果你的模块只会访问一个后台服务器地址，则不需要修改
            baseURL: 'http://admin-gcfs.dev.xbniao.com'
            //baseURL:'/api'
        },
        analysis: { //数据分析系统
            baseURL: 'http://marketing.dev.xbniao.com'
        },
        logistics: {  //集货转运系统
            baseURL: 'http://admin-gcfs.dev.xbniao.com'
        },
        userCenter: {  //用户中心
            baseURL: 'http://uc.dev.xbniao.com'
        },
        front: {
            baseURL: '/fapi'
        }
        /*image: {    //这里定义了另一个服务器， 通过修改baseURL浏览器会跨域访问到这里
         baseURL: 'https://api.github.com/',
         }*/
    },
    routePath: '/storehouse/list/'
});

booter.startUp();
