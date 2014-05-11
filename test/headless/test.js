window.__global = require("../src/main.dust")({name:"Bob",age:"thirty"});

window.__global += Object.keys(require("{dustjs/runtime}").cache).length;

window.__global += require("../src/nested/sub/c.dust")({name2:"Jane"});