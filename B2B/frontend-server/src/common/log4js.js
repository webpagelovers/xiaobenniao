
var log4js = require("log4js");
var cwd = process.cwd();
log4js.configure({
	appenders:[
		{ type: "console" },
		{ type: "file", filename : cwd + "/logs/ejs.log", category: "ejs" },
		{ type: "file", filename : cwd + "/logs/staticize.log", category: "staticize" },
		{ type: "file", filename : cwd + "/logs/api.log", category: "api" }
	]
});

module.exports = log4js;