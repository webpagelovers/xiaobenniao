/*
  此文件为应用程序的入口文件，负责加载各个子域
*/

var express = require("express");
var vhost = require("vhost");
var app = module.exports = express();


function init() {
	var config = require("./common/config.js");
	var vhostArray = config.getInstance().getVhost();
	for(var i=0; i<vhostArray.length;i++){
		var serverName = vhostArray[i].server_name;
		var entryPoint = vhostArray[i].entry_point;
		app.use(vhost(serverName,require(entryPoint)));
		console.log(serverName+" " + entryPoint + "loaded");
	}
	console.log("init vhost completed")
}

init();

app.listen(8080);