var XBN = require("../common/xbn.js");

console.log("xbn");

var express = require('express');
var expInstance = express();

function App(vhost){
	this.exp = expInstance;
	init.call(this,vhost);
}

function init(vhost){
	var config = require("../common/config.js");
	var _vhost = config.getInstance().getConfig()[vhost];
	var rootPath = _vhost.location;
	console.log("rootPath:" + rootPath);
	this.xbn = new XBN(_vhost);
}

module.exports = App;