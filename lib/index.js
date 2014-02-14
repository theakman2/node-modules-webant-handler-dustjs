/**
 * Handles require calls to files with an extension of .handlebars or .hbs. 
 */
var fs = require("fs");
var path = require("path");
var url = require("url");

var dust = require("dustjs-recursivenodecompiler");

var fp = require("js-string-escape")(path.join(__dirname,"dustRenderSync.js"));

var counter = 0;
var tmplNames = {};

function getDustJs(precompiled) {
	var js = "";
	js += "var dust = require('!"+fp+"');";
	js += precompiled;
	js += "module.exports = dust.getRenderFuncSync('_AUTO_TEMPLATE_NAME%0');";
	return js;
}

var _fileCache = {};

module.exports = {
	defaultSettings:{},
	willHandle:function(filePath,settings){
		if (url.parse(filePath,false,true).host) {
			return false;
		}
		if (filePath.indexOf("@@") === 0) {
			return false;
		}
		if (path.extname(filePath) === ".dust") {
			return true;
		}
		return false;
	},
	handle:function(filePath,settings,done){
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			done(null,getDustJs(dust.compile(c.toString(),filePath)));
		});
	}
};