var fs = require("fs");
var path = require("path");

var dust = require("dustjs-recursivenodecompiler");
var jsEscape = require("js-string-escape");

var counter = 0;
var tmplNames = {};

function getDustJs(precompiled,filePath) {
	var base = jsEscape(path.basename(filePath));
	var js = "";
	js += "var dust = require('!@@dustjs/runtime');";
	js += precompiled;
	js += "module.exports = dust.getRenderFuncSync('" + base + "');";
	return js;
}

var _fileCache = {};

module.exports = {
	aliases:{
		"@@dustjs/runtime":path.join(__dirname,"dustRenderSync.js")
	},
	extensions:".dust",
	handle:function(filePath,done){
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			done(null,getDustJs(dust.compile(c.toString(),filePath),filePath));
		});
	}
};