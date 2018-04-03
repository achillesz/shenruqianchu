#!/usr/bin/env node
var http = require('http');

var sessions = {};
var key = 'session_id';
var EXPIRES = 20*60*1000;

var generate = function () {
    var session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };

    sessions[session.id] = session;

    return session;
};

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
    var id = req.cookies[key];
    if(!id) {
        req.session = generate();
    } else {
        var session = sessions[id];
        if(session) {
            if(session.cookie.expire > (new Date()).getTime()) {
                // 更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            } else {
                delete  sessions[id];
                req.session = generate();
            }
        } else {
            // 如果session 过期或口令不对，重新生成session
            req.session = generate();
        }
    }

    var writeHead = res.writeHead;
    res.writeHead = function () {
        var cookies = res.getHeader('Set-Cookie');

        var session = serialize(key, req.session.id);
        cookies = cookies ? cookies : [];
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
        console.log(cookies, '数组数组')
        res.setHeader('Set-Cookie', cookies);
        return writeHead.apply(this, arguments);
    };

    console.log(req.session);

    handle(req,res);
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

