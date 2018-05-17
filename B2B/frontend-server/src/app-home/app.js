/*
   home 入口文件
*/

var App = require("../common/common.js");
var app = new App("home");
var url = require("url");

var model = require("../common/model.js");

//新闻详情需要特殊处理
app.exp.get(/\/informations\/[0-9]\d*\.html$/, function(req, res) {
    console.log(req.url);
    var config = app.xbn.config;
    var fileName = config.location+ url.parse(req.url).pathname;
    app.xbn.renderStaticPage(req,res,fileName,function(){
        app.xbn.renderStaticPage(req,res,fileName,function() {
            model.doRequest(req,res,app.xbn,config.static.information.tplName,
                config.static.information.api,function(json){
                    if(json.statusCode=="2000000" || json.statusCode== "2000800" ){
                        app.xbn.renderPage(req,res,config.static.information.tplName,json.data[0],config.static.information.targetPath);
                    }else{
                        //返回404
                        var pathname = app.xbn.config.location +"/404.html";
                        app.xbn.render(res, pathname);
                    }
                });
        });
    });


});


module.exports = app.exp;

