define(function (){
    var rootPath = "http://m.dev.weintrade.com/";
    var imgUrl = "http://img.dev.weintrade.com";
    //附件
    var generalUrl = rootPath + "api/general/file/";
    var config = {
        upload:{
            uploadUrl:generalUrl + 'upload',
            downloadUrl:imgUrl
        },
        index: {
            api:{
                ipinfo: rootPath + "api/international/ipinfo"
            }
        },
        request: {
            api:{
                sourcingRequest: rootPath + "api/international/sourcingRequest/"
            }
        },

        link : {
            home: rootPath,
            sourcingRequest : rootPath + "request/sourcing-request.html"
        },

        statusCode : {
            SUCCESS : 2000000,
            NOTPHONE : 2000309,//登录手机号码不存在
            NOTPASSWORD : 2000310, //登录密码不正确
            LOGININVALID : 2000312, //登录用户名或密码错误
            FROEENACOUNT : 2000205, //当前用户已被冻结
            SESSIONEXPIRE : 1000100,//session 失效
            NOLOGIN : 2001000,//未登录
            INVALIDPRODUCT : 2000800 //失效产品
        }
    };
    return config;
});