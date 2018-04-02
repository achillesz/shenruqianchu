#!/usr/bin/env node
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

console.log(process.argv[2]);
var root = path.resolve(process.argv[2] || '.');

http.createServer(function (req,res) {
    res.query = url.parse(req.url, true).query;

    res.writeHead(200);

    res.end(JSON.stringify(res.query));

/*    fs.readFile(path.join(root, pathname), function (err, file) {
        if(err) {
            res.writeHead(404,{
                'Content-Type': 'text/plain;charset=utf-8',
            });
            res.end('找不到相关文件。--');
            return;
        }


    });*/
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337');