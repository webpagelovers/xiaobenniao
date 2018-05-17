/*
   cg 入口文件
*/

var App = require("../common/common.js");
var app = new App("cg");
var url = require("url");

var model = require("../common/model.js");

//新闻详情需要特殊处理
app.exp.get(/\/purchases\/[0-9]\d*\.html$/, function(req, res) {
    console.log(req.url);
    var config = app.xbn.config;
    var fileName = config.location+ url.parse(req.url).pathname;
    app.xbn.renderStaticPage(req,res,fileName,function(){
        model.doRequest(req,res,app.xbn,config.static.purchase.tplName,
            app.xbn.config.static.purchase.api,function(data){
                var json = getJson(data);
                if(json.statusCode=="2000000"){
                    app.xbn.renderPage(req,res,config.static.purchase.tplName,json.data,config.static.purchase.targetPath);
                }else{
                    //返回404
                    var pathname = app.xbn.config.location +"/404.html";
                    app.xbn.render(res, pathname);
                }
            });
    });

    var getJson = function(json){
        var summary = json.data.summary ;
        if( summary && summary.length > 150) {
            var newSun = summary.substr(0, 150) ;
            json.data.summary = newSun;
        }

        json.data.title += '-寰贸云外贸综合云服务平台'
        return json;
    }

});


module.exports = app.exp;
