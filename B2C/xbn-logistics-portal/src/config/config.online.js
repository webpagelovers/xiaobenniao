const config = {
    servers: {
        default: {
            baseURL: 'http://logistics.xbniao.com/api'
        },
        tax: {
            baseURL: 'http://logistics.xbniao.com/api'
        },
        messageCenter: {
            baseURL: 'http://message.xbniao.com'
        },
        userCenter: {
            baseURL: 'http://uc.xbniao.com'
        },
        captcha: {
            baseURL: 'http://message.xbniao.com'
        },
        verifyCode: {
            url: 'http://message.xbniao.com/captcha/get'
        },
        pay: {//支付系统
            baseURL: 'http://pay.xbniao.com/api'
        },
        account: {
            baseURL: 'http://logistics.xbniao.com/api'
        },
        //统计中心
        statistics: {
            baseURL: 'http://statistics.xbniao.com'
        },
        //图片上传
        imageUpload:{
            baseURL: 'http://image.xbniao.com/file/app/image.upload'
        },
        //图片上传
        image: {
            baseURL: 'http://image.xbniao.com'
        }
    }
};

export default config;