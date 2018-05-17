/*
 weintrade 入口文件
*/
var App = require("../common/common.js");
var app = new App("weintrade");
var url = require("url");

var model = require("../common/model.js");

//产品详情需要特殊处理
app.exp.get(/\/products\/[0-9]\d*\.html$/, function(req, res) {
    console.log(req.url);
    var config = app.xbn.config;
    var fileName = config.location+ url.parse(req.url).pathname;
    app.xbn.renderStaticPage(req,res,fileName,function(){
        var product = config.static.product;
        var tplName = product.tplName;
        model.doRequest(req,res,app.xbn,tplName,product.api,function(json){
            if(json.statusCode=="2000000" || json.statusCode== "2000800" ){
                app.xbn.renderPage(req,res,tplName,json.data[0],product.targetPath);
            }else{
                //返回404
                var pathname = app.xbn.config.location +"/404.html";
                app.xbn.render(res, pathname);
            }
        });
    })
});
app.exp.get(/\/requests\/[0-9]\d*\.html$/, function(req, res) {
    console.log(req.url);
    var config = app.xbn.config;
    var fileName = config.location+ url.parse(req.url).pathname;
    app.xbn.renderStaticPage(req,res,fileName,function(){
        var request = config.static.request;
        var tplName = request.tplName;
        model.doRequest(req,res,app.xbn,tplName,request.api,function(json){
            if(json.statusCode=="2000000" ){
                app.xbn.renderPage(req,res,tplName,json.data[0],request.targetPath);
            }else{
                //返回404
                var pathname = app.xbn.config.location +"/404.html";
                app.xbn.render(res, pathname);
            }
        });
    });
});
app.exp.get(/\/blog\/create\/[0-9]\d*\.html$/, function(req, res) {
    reqHost = req.headers.host
    new Promise((resolve, reject) => {
        createBlogDetail(req, res, resolve)
    }).then(() => {
        reloadBlogList(req, res)
    })
    
});
app.exp.get(/\/blog\/create\/all$/, function(req, res) {
    reqHost = req.headers.host
    reloadBlogList({url: '/blog/create/12.html'}, null, json => {
        json.data.list.forEach(item => {
            createBlogDetail({url: '/blog/create/'+ item.postId +'.html'}, null)
        })
    })
});

var config  = app.xbn.config,
    reqHost = null

//生成blog详情页
function createBlogDetail(req, res, callback) {
    var info = config.static.blog_detail
    model.doRequest(req, res, app.xbn, info.tplName, info.api, function(json){
        if(json.statusCode=="2000000" ){
            var url = req.url.replace('/create', ''),
                ddd = dtk(json.data)
            
            //在静态化pc的同时，也带上手机
            new Promise((resolve, reject) => {
                hotBlog(json => {
                    json.forEach(item => {
                        item.hrefLink = 'blog/' + item.postId + '.html'
                    })
                    ddd.hot = json
                    resolve()
                })
            }).then(() => {
                return new Promise((resolve, reject) => {
                    app.xbn.renderPage({url: url}, res, info.tplName, ddd, info.targetPath, resolve)
                })
            }).then(() => {
                return new Promise((resolve, reject) => {
                    app.xbn.renderPage({url: url}, res, info.tplName, ddd, info.targetPath, resolve, config.location_m)
                })
            }).then(() => {
                callback && callback()
            })
        }

        function dtk(data) {
            data._postTitle    =   data.postTitle.replace(/\ [a-z]/g, function(key, index, str){return key.toUpperCase()})
            data._title        =   data._postTitle + ' - Weintrade.com'
            data._description  =   'This article mainly explains ' + data._postTitle + ', Weintrade is a professional sourcing agent with quality and efficient service to help you source faster and easier in china.'
            data._keywords     =   data._postTitle
            data._image        =   data.headPic

            data.postDate      =   formaterTime(data.postDate)

            data._alternate    =   'https://' + reqHost + url

            return data
        }
    })
}

//刷新blog列表页
function reloadBlogList(req, res, callback) {
    var info = config.static.blog_list
    model.blogList(app.xbn, function(json){
        if(json.statusCode=="2000000" ){
            var url = req.url.replace(/\/create\/[0-9]\d*\.html/, '/index.html')
            json.data.list.forEach(function(item) {
                item.postDate = formaterTime(item.postDate)
                item.hrefLink = '../blog/' + item.postId + '.html'
            })

            callback && callback(json)
            var ddd = json.data
            //在静态化pc的同时，也带上手机
            new Promise((resolve, reject) => {
                app.xbn.renderPage({url: url}, res, info.tplName, ddd, info.targetPath, resolve)
            }).then(() => {
                app.xbn.renderPage({url: url}, res, info.tplName, ddd, info.targetPath, null, config.location_m)
            })
            
        }
    })
}

function hotBlog(callback) {
    model.hotBlogs(app.xbn, function(json){
        callback(json.data)
    })
}

//转换时间
function formaterTime(time) {
    return new Date(time).toUTCString().split(' ').splice(1, 3).join(', ').replace(',', '')
}

app.exp.createBlogDetail = createBlogDetail
app.exp.reloadBlogList   = reloadBlogList

module.exports = app.exp;