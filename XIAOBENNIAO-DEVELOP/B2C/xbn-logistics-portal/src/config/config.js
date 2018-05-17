const config = {
    servers: {
        default: {
            baseURL: 'http://platform-gcfs.dev.xbniao.com'
        },
        tax: {
            baseURL: 'http://platform-gcfs.dev.xbniao.com'
        },
        messageCenter: {
            baseURL: 'http://message2.dev.xbniao.com'
        },
        userCenter: {
            baseURL: 'http://uc.dev.xbniao.com'
        },
        captcha: {
            baseURL: 'http://message1.dev.xbniao.com'
        },
        verifyCode: {
            url: 'http://message1.dev.xbniao.com/captcha/get'
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
        image:{
            baseURL: 'http://uimage.xbniao.com'
        },
        //图片上传
        imageUpload:{
            baseURL: 'http://timage.xbniao.com/file/app/image.upload'
        },
    }
}

export default config;
