#!/usr/bin/env node
var http = require('http');

var parseCookie = function (cookie) {
    var cookies = {};
    if(!cookie) {
        return cookies;
    }

    var list = cookie.split(';');

    for(var i = 0; i < list.length; i++) {
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }

    return cookies;
};

var serialize = function (name,val, opt) {
    var pairs = [name + '=' + encodeURI(val)];
    opt = opt || {};

    if(opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if(opt.domain) pairs.push('Domain=' + opt.domain);
    if(opt.path) pairs.push('Path=' + opt.path);
    if(opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if(opt.httpOnly) pairs.push('HttpOnly');
    if(opt.secure) pairs.push('Secure');

    return pairs.join('; ')
};

http.createServer(function (req,res) {
    req.cookies = parseCookie(req.headers.cookie);
    handle(req,res);

}).listen(1337, '127.0.0.1');

function handle(req, res) {
    if(!req.cookies.isVisit) {
        console.log(serialize('isVisit', '1'))
        res.setHeader('Set-Cookie', serialize('isVisit', '1', {
            httpOnly: false,
            path: '/abc'
        }));

        res.writeHead(200, {
            'Content-Type': 'text/plain;charset=utf-8',
        });
        res.end('欢迎第一次来到动物园');
    } else {
        res.writeHead(200,{
            'Content-Type': 'text/plain;charset=utf-8',
        });
        res.end('动物园再次欢迎你');
    }
}

console.log('Server running at http://127.0.0.1:1337');