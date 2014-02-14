var fs = require("fs");
var path = require("path");
var vm = require("vm");
var childProcess = require("child_process");

var webant = require("webant");
var dust = require("dustjs-recursivenodecompiler");
var shellEscape = require("shell-escape");

var handler = require("../lib/index.js");

function phantom(assert,done,cb) {
	var pjs = childProcess.exec(
		'phantomjs ' + shellEscape([path.join(__dirname,"headless","phantomwebant.js")]),
		{
			cwd:path.join(__dirname,"headless"),
			maxBuffer:1024*1024
		},
		function(err,stdout,stderr) {
			pjs.kill();
			if (err) {
				assert.fail("phantomjs reports an error: " + err);
				done();
				return;
			}
			if (stderr) {
				assert.fail("phantomjs reports content in stderror: " + stderr);
				done();
				return;
			}
			var out;
			try {
				out = JSON.parse(stdout.trim());
			} catch(e) {
				assert.fail("Could not JSON.parse() stdout [stdout is: " + stdout + "]");
				done();
				return;
			}
			cb(out);
		}
	);
}

var tests = {
	"test filetypes" : function(assert) {
		var data = [ "http://mysite.co.uk/bla.js",
				"//cdn.google.com/path/to/assets.css", "path/to/assets.dust",
				"/abs/path/to/assets.handlebars", "path/to/assets.handlebars",
				"/abs/path/to/assets.dust", "@@hbs/runtime",
				"@@css/addStylesheet" ];
		assert.deepEqual(data.map(function(fp) {
			return handler.willHandle(fp);
		}), [ false, false, true, false, false, true, false, false ],
				"Should handle the correct files.");
	},
	"test with runtime" : function(assert, done) {
		webant({
			entry:path.join(__dirname,"headless","test.js"),
			dest:path.join(__dirname,"headless","main.js"),
			handlers:[handler]
		},function(err){
			if (err) {
				assert.fail("Webant should not error when parsing javascript (error: " + err + ")");
				done();
				return;
			}
			phantom(assert,done,function(out){
				assert.strictEqual(
					out,
					"Testing name Bob in partial bar (age: thirty) name Bob in partial baz.",
					"dust should be compiled correctly"
				);
				done();
			});
		});
	}
};

require("test").run(tests);