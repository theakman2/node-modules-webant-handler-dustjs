# node-modules-webant-handler-dustjs

_Require [dustjs-linkedin](https://github.com/linkedin/dustjs) templates with [webant](https://github.com/theakman2/node-modules-webant)_

## Installation

    $ npm install webant-handler-dustjs

## Usage

Ensure the `dustjs` handler is present in your webant configuration file. For example:

````json
{
    "entry":"src/js/main.js",
    "dest":"build/main.js",
    "handlers":["dustjs"]
}
````

You may now `require` dustjs files:

````javascript
var tmpl = require("./path/to/template.dust");
var html = tmpl({name:"Jane Doe"});
````

Need access to the `dust` object?

```javascript
var dust = require("@@dustjs/runtime");
```

## Tests [![Build Status](https://travis-ci.org/theakman2/node-modules-webant-handler-dustjs.png?branch=master)](https://travis-ci.org/theakman2/node-modules-webant-handler-dustjs)

Ensure [phantomjs](http://phantomjs.org) is installed and in your PATH, then run:

    $ npm test