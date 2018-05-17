import index from '../src/index';

import BootStrap from 'nt-portal-framework';
import BootVue from './root.vue';
import 'nt-element/lib/theme-cobalt-blue/index.css';
import loginModule from  'xbn-biz-common/src/index';
import Authorize from 'xbn-biz-shop-authorize';

const booter = new BootStrap({
    mount: '#xbn-app',
    vueRoot: BootVue,
    modules: [index,loginModule,Authorize],
    authRequired: true,
    appCode: '1005',
    loginPath: '/login',
    servers: {
        default: {
            baseURL: 'http://platform-gcfs.dev.xbniao.com'
        },
        mail: {
            baseURL: 'http://192.168.30.144:8084'
        },
        tax: {
            baseURL: 'http://platform-gcfs.dev.xbniao.com'
        },
        pay: {  //这是默认写法， 如果你的模块只会访问一个后台服务器地址，则不需要修改
            baseURL: 'http://pay.dev.xbniao.com'
        },
        messageCenter:{
            baseURL: 'http://message2.dev.xbniao.com'
        },
        userCenter: {
            baseURL: 'http://uc.test.xbniao.com'
        },
        captcha: {
            baseURL: 'http://message1.dev.xbniao.com'
        },
        verifyCode: {
            url: 'http://message1.dev.xbniao.com/captcha/get'
        },
        statistics: { //统计中心
            baseURL: 'http://statistics.dev.xbniao.com'
        },
        authCenter: {
            baseURL: 'http://auth-center.test.xbniao.com/api/'
        },
        image:{
            baseURL: 'http://timage.xbniao.com'
        }
    },
    routePath: '/mail/inboxList'
});

booter.startUp();
