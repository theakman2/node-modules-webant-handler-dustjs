var dust = require("!../node_modules/dustjs-recursivenodecompiler/node_modules/dustjs-linkedin/dist/dust-core.js");

dust.getRenderFuncSync = function(tmplName) {
	return function(context) {
		var dustOutput = '';
		dust.render(tmplName, context, function(error, out) {
			if (error) {
				throw error;
			}
			dustOutput = out;
		});
		return dustOutput;
	};
}

module.exports = dust;