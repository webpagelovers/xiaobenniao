const config = {
    servers: {
        default: { 
            baseURL: 'http://ebay-admin.test.xbniao.com/api'
        },
        messageCenter: {
            baseURL: 'http://message.test.xbniao.com'
        },
        userCenter: {
            baseURL: 'http://uc.test.xbniao.com'
        },
        adminCenter: {
            baseURL: 'http://ucadmin.test.xbniao.com/api/'
        },
        captcha: {
            baseURL: 'http://message.test.xbniao.com'
        },
        verifyCode: {
            url: 'http://message.test.xbniao.com/captcha/get'
        },
        pay: {//支付系统
            baseURL: 'http://pay.test.xbniao.com/api'
        },
        account: {
            baseURL: 'http://platform-gcfs.test.xbniao.com/api'
        },
        //统计中心
        statistics: { 
            baseURL: 'http://statistics.test.xbniao.com'
        },
        //图片上传
        imageUpload: {
            baseURL: 'http://timage.xbniao.com/file/app/image.upload'
        },
        //图片上传
        image: {
            baseURL: 'http://timage.xbniao.com'
        }
    }
};

export default config;