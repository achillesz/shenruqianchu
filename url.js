#!/usr/bin/env node
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var root = path.resolve(process.argv[2] || '.');

http.createServer(function (req,res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
    fs.readFile(path.join(root, pathname), function (err, file) {
        if(err) {
            res.writeHead(404,{
                'Content-Type': 'text/plain;charset=utf-8',
            });
            res.end('找不到相关文件。--');
            return;
        }

        res.writeHead(200);

        res.end(file);
    });





}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337');