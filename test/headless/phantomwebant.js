var page = require("webpage").create();

page.open("./index.html",function(status){
	setTimeout(function(){
		var g = page.evaluate(function(){
			return __global;
		});
		console.log(JSON.stringify(g));
		phantom.exit();
	},1000);
});