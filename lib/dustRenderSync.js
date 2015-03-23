var dust = require("./dust-core.js|sameAsChunk={entry}");

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