var fs = require("fs");
var path = require("path");

var dust = require("dustjs-recursivenodecompiler");
var jsEscape = require("js-string-escape");

function Handler() {
	var i = 0;
	this._compileMap = {};
	this._filePathMapper = {
		registerFilePathAs:function(){
			return "__WEBANT_DUST_" + (++i) + "__";
		}
	};
}

Handler.prototype = {
	aliases:{
		"dustjs/runtime":path.join(__dirname,"dustRenderSync.js")
	},
	extensions:".dust",
	_getDustJs:function(fp){
		var base = jsEscape(this._compileMap[fp].registeredAs);
		var js = "";
		js += "var dust = require('{dustjs/runtime}|sameAsChunk={entry}');\n";
		var i = this._compileMap[fp].requires.length;
		var done = {};
		while(i--) {
			var filePath = this._compileMap[fp].requires[i].filePath;
			if (!done.hasOwnProperty(filePath)) {
				done[filePath] = true;
				js += 'require("' + jsEscape(filePath) + '|sameAsChunk={entry}");\n';
			}
		}
		js += this._compileMap[fp].content + "\n";
		js += "module.exports = dust.getRenderFuncSync('" + base + "');";
		return js;
	},
	handle:function(filePath,done){
		var _this = this;
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			dust.filePathMapper = _this._filePathMapper;
			dust.compileMap(c.toString(),filePath,_this._compileMap);
			done(null,_this._getDustJs(filePath));
		});
	}
};

module.exports = Handler;