var log4js = require("./log4js");

var apiLogger = log4js.getLogger("api");

/**
 * Created by weijunzheng on 2017/4/21.
 */
var exports = module.exports = {
    doRequest : function(req,res,xbn,tplName,api,callback){
        var id = xbn.getId(req);
        var options = {
            hostname : xbn.config.server_name,
            port : xbn.config.server_port || 80,
            path : xbn.config.prefix + api + id
        };

        options.callback = function(data){
            try{
                var json = JSON.parse(data);
                if(json.statusCode!="2000000"){
                    apiLogger.info(JSON.stringify(options)+"@"+data);
                }
                if(callback){
                    callback(json)
                }
            }
            catch(e){
                apiLogger.error('调用服务失败'+ JSON.stringify(options) +e);
            }            
        };
        xbn.doRequest(options);
    },
    blogList: function(xbn, callback) {
        var options = {
            hostname : xbn.config.server_name,
            port : xbn.config.server_port || 80,
            path : xbn.config.prefix + xbn.config.static.blog_list.api,
            bodyData: {pageNo: 1, pageSize: 10},
            callback: res => {
                callback(JSON.parse(res))
            }
        }

        xbn.doRequest(options)
    },
    hotBlogs: function(xbn, callback) {
        var options = {
            hostname : xbn.config.server_name,
            port : xbn.config.server_port || 80,
            path : xbn.config.prefix + xbn.config.static.hot_blog.api,
            method: 'POST',
            callback: res => {
                callback(JSON.parse(res))
            }
        }

        xbn.doRequest(options)
    }
};