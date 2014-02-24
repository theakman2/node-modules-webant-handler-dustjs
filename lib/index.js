var fs = require("fs");
var path = require("path");

var dust = require("dustjs-recursivenodecompiler");
var jsEscape = require("js-string-escape");

function Handler() {}

Handler.prototype = {
	aliases:{
		"@@dustjs/runtime":path.join(__dirname,"dustRenderSync.js")
	},
	extensions:".dust",
	_getDustJs:function(precompiled,fp){
		var base = jsEscape(path.relative(this._base,fp).replace(/\\/g,"/"));
		var js = "";
		js += "var dust = require('!@@dustjs/runtime');";
		js += precompiled;
		js += "module.exports = dust.getRenderFuncSync('" + base + "');";
		return js;
	},
	handle:function(filePath,done){
		var _this = this;
		if (!_this._base) {
			_this._base = path.dirname(filePath);
		}
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			done(null,_this._getDustJs(dust.compile(c.toString(),filePath),filePath));
		});
	}
};

module.exports = Handler;