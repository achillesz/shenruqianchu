var pathToRegexp = require('path-to-regexp');

var keys = [];
var s = pathToRegexp('/user/:name', keys);

console.log(s, keys)