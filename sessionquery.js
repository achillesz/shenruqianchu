#!/usr/bin/env node
var http = require('http');
var url = require('url');

var sessions = {};
var key = 'session_id';
var EXPIRES = 20*60*1000;

// 生成 session
var generate = function () {
    var session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };

    sessions[session.id] = session;

    return session;
};

// cookie转换程对象
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

// 序列化程一个cookie格式的字符窜
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

var getURL = function (_url, key, value) {
    var obj = url.parse(_url, true);
    obj.query[key] = value;
    return url.format(obj);
};


http.createServer(function (req,res) {
    req.query = url.parse(req.url, true).query;

   var redirect = function (url) {
        res.setHeader('Location', url);
        res.writeHead(302);
        res.end();
   };

   console.log(req.quer, 'enenen')
    
    var id = req.query[key];

    if(!id) {
        var session = generate();
        redirect(getURL(req.url, key, session.id));
    } else {
        var session = sessions[id];
        if(session) {
            if(session.cookie.expire > (new Date()).getTime()) {
                // 更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
                handle(req,res);
            } else {
                delete  sessions[id];
                var session = generate();
                redirect(getURL(req.url, key, session.id));
            }
        } else {
            // 如果session 过期或口令不对，重新生成session
            var session = generate();
            redirect(getURL(req.url, key, session.id));
        }
    }
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337');

function handle(req, res) {
    console.log(req.session);
    if(!req.session.isVisit) {
        req.session.isVisit = true;
        res.writeHead(200,{
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

