/*
   home 入口文件
*/

var App = require("../common/common.js");
var app = new App("jr");

app.exp.get(/\S*jr\S*\.html$/,function(req,res){
    console.log(req.url);
    req.url = req.url.replace(req.headers.host,"");
    app.xbn.preRenderPage(req,res);
});
module.exports = app.exp;

