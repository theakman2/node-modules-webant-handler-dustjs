window.__global = require("../src/tmpl.dust")({name:"Bob",age:"thirty"});

window.__global += Object.keys(require("@@dustjs/runtime").cache).length;