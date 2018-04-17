var  pathToRegexp = require('path-to-regexp');
var http = require('http');
var url = require('url');

function pathRegexp(path) {
    var keys = []
    var reg = pathToRegexp(path, keys);
    return {
        regexp: reg,
        keys: keys
    };

}

var routes = {
    'all': []
};

var app = {};
app.use = function (path, action) {
    routes.all.push([pathRegexp(path), action]);
};

['get', 'put', 'delete', 'post'].forEach(function (method) {
    routes[method] = [];
    app[method] = function (path, action) {
        routes[method].push([pathRegexp(path), action]);
    };

});

app.post('/user/:username', addUser);
app.delete('/user/:username', removeUser);
app.put('/user/:username', updateUser);
app.get('/user/:username', getUser);
var match = function (pathname, routes, req, res) {
    for(var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var reg = route[0].regexp;
        var keys = route[0].keys;

        var matched = reg.exec(pathname);

        if(matched) {
            // 抽取躯体位置
            var params = {};
            for(var i = 0, l = keys.length; i < l; i++) {
                var value = matched[i+1];
                if(value) {
                    params[keys[i].name] = value;
                }
            }

            req.params = params;

            var action = route[1];
            action(req, res);
            return true;
        }

    }
    return false;
};

http.createServer(function (req,res) {
    var pathname = url.parse(req.url).pathname;

    var method = req.method.toLowerCase();

    if(routes.hasOwnProperty(method)) {
        if(match(pathname, routes[method], req, res)) {
            return;
        } else {
            if(match(pathname, routes.all,req, res)) {
                return;
            }
        }
    } else {
        if(match(pathname, routes.all, req, res)) {
            return;
        }

        handle404(req,res);
    }
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337');

function addUser(req,res) {

}

function removeUser(req,res) {

}

function updateUser(req,res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8',
    });

    console.log(req.params)
    res.end('更新' + req.params.username);
}

function getUser(req,res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8',
    });

    console.log(req.params)
    res.end('欢迎' + req.params.username);
}

function handle404(req,res) {
    
}


