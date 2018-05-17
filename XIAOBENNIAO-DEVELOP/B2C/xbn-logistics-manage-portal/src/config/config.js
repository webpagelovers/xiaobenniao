const config = {
    servers: {
        default: {
            baseURL: 'http://192.168.30.178:8080'
        },
        messageCenter: {
            baseURL: 'http://message.dev.xbniao.com'
        },
        userCenter: {
            baseURL: 'http://uc.dev.xbniao.com'
        },
        adminCenter: {
            baseURL: 'http://ucadmin.test.xbniao.com/api/'
        },
        captcha: {
            baseURL: 'http://message.dev.xbniao.com'
        },
        verifyCode: {
            url: 'http://message.dev.xbniao.com/captcha/get'
        },
        pay: {//支付系统
            baseURL: 'http://pay.dev.xbniao.com/api'
        },
        account: {
            baseURL: 'http://platform-gcfs.dev.xbniao.com/api'
        },
        statistics: { //统计中心
            baseURL: 'http://statistics.dev.xbniao.com'
        },
        //图片上传
        imageUpload: {
            baseURL: 'http://timage.xbniao.com/file/app/image.upload'
        },
        //图片上传
        image: {
            //测试环境
            baseURL: 'http://timage.xbniao.com'
            //开发环境
            //baseURL: 'http://uimage.xbniao.com'
        },

    }
};

export default config;
