var url = require("url");
var path = require('path');
var fs = require("fs");
var http = require("http");
var ejs = require("ejs");
var log4js = require("./log4js");

var ejsLogger = log4js.getLogger("ejs");
var staticizeLogger = log4js.getLogger("staticize");

function XBN(config){
    this.config = config;
}

XBN.prototype.headerConfig = {
    ".htm": { "Content-Type": "text/html" },
    ".html": { "Content-Type": "text/html" },
    ".js": { "Content-Type": "text/javascript" },
    ".css": { "Content-Type": "text/css" },
    ".gif": { "Content-Type": "image/gif" },
    ".jpg": { "Content-Type": "image/jpg" },
    ".png": { "Content-Type": "image/png" },
    ".json": { "Content-Type": "application/json" },
    ".txt": { "Content-Type": "text/html" },
    ".stream": { "Content-Type": "application/octet-stream" },
    ".xml": { "Content-Type": "text/xml" },
    ".xsl": { "Content-Type": "text/xml" },
    ".ppt": { "Content-Type": "application/octet-stream" },
    ".pptx": { "Content-Type": "application/octet-stream" },
    ".doc": { "Content-Type": "application/octet-stream" },
    ".docx": { "Content-Type": "application/octet-stream" },
    ".pdf": { "Content-Type": "application/octet-stream" },
    ".xlsx": { "Content-Type": "application/octet-stream" },
    ".xls": { "Content-Type": "application/octet-stream" },
    "default": { "Content-Type": "application/octet-stream" }
};

XBN.prototype.renderPage = function(request, response, tpl, data, targetPath, callback, rootPath){
    var id = this.getId(request);
    var rootPath = rootPath || this.config.location;
    //if(id !=""){
        var requestPathName = url.parse(request.url).pathname;
        var tplPath = rootPath + tpl ;
        var targetFile = rootPath + requestPathName;
        this.preRenderPage(response,tplPath,data,targetFile,rootPath+targetPath, callback);
        //this.render(response, tplPath);
    //}
},

XBN.prototype.getId = function(request){
    var target = request.url.match(/[0-9]\d*\.html/);
    var id = "";
    if(target && target.length>0){
        id = target[0].replace(".html","");        
    }
    return id;
};


XBN.prototype.preRenderPage = function(res,tplPath,data,targetFile,targetPath, callback){
    var that = this;
    var pathName = tplPath;
    fs.exists(pathName,function(exists){
        if(exists){
            fs.readFile(pathName,"utf8",function(err,fileData){
                var ret = fileData;
                try{
                    ret = ejs.render(fileData,data || {});
                }catch(e){
                    ejsLogger.error("ejs render error" + e.toString() + JSON.stringify(data));
                    //console.log("ejs render error"+ JSON.stringify(data));
                }
                try{
                    if (!fs.existsSync(targetPath)) {
                        fs.mkdirSync(targetPath);
                        console.log(targetPath+'目录创建成功');
                    }
                    fs.writeFile(targetFile,ret,function(err,data){
                       if(err) {
                           staticizeLogger.error('写文件失败'+ err);
                           console.log(err);
                       }
                       callback && callback()
                    });
                }
                catch(e) {
                    staticizeLogger.error('静态化失败'+ e);                    
                }
                res && res.end(ret);
            });
        }else{
            pathname = that.config.location +"/404.html";
            that.render(res, pathname);
        }
    });
};

XBN.prototype.renderStaticPage = function(req,res,fileName,calback){
     fs.exists(fileName,function(exists){
         if(exists){
             res.sendFile(fileName);
         }else{
            calback();
         }
     });
};

XBN.prototype._appendFile = function(data,regString,tplPathName){
    var result = data;
    var match = result.match(regString);
    var fileData = fs.readFileSync(this.config.location+tplPathName,"utf8");
    if(match&&match.length>0){
        var temp = match[0].replace("</div>",fileData+"</div>");
        result = result.replace(match[0],temp);
    }
    return result;
};

XBN.prototype.doRequest = function(options){    
    serviceProxy.doRequest(options);
};

XBN.prototype.render = function(response, pathname){
    console.log("pathname:" + pathname);
    var that = this;

    fs.exists(pathname, function (exists) {
        if (exists) {
            var extName = path.extname(pathname);
            response.writeHead(200, (that.headerConfig[extName] || that.headerConfig["default"]));
            fs.readFile(pathname, function (err, data) {
                response.end(data);
            });
        }
        else{
            that.render(response, that.config.location +"/404.html");
        }
    });
};

XBN.prototype.errorPage = function(response, pathname){
    console.log("response pathname:" + pathname);
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end("<h1>404 Not Found</h1>");
}


var serviceProxy = {    
    doRequest: function (options) {          
        options.method = options.method || "GET";
        if (options.bodyData) {
            options.method = "POST";        
        }

        console.log("===================== Redirect to API URL begin =====================");
        console.log(options.method + " " + options.url);

        var proxyRequest = http.request(options, function (proxyResponse) {
            proxyResponse.setEncoding('utf8');
           // proxyResponse.setHeader('Content-Type','application/json; charset=utf-8')
            var resData = "";
            proxyResponse.on('data', function (chunk) {
                resData += chunk; //context.response.write(chunk);
            });
            proxyResponse.on('end', function () { 
                if(options.callback){
                    options.callback(resData);
                }                             
                console.log("API URL return data length:" + resData.length);              
                console.log("===================== Redirect to API URL end =====================");
            });
         
        });
        proxyRequest.on('error', function (e) {         
            console.log("API URL Error:" + e.message);            
            console.log("===================== Redirect to API URL error =====================");
        });
        if (options.bodyData){
            var data = JSON.stringify(options.bodyData);
            proxyRequest.write(data);
        }

        proxyRequest.end();
    }
};

module.exports = XBN;