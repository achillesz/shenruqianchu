var net = require('net');

var server = net.createServer((socket) => {
    socket.on('data', (data) => {
        socket.write('你好')
    });

    socket.on('end', () => {
        console.log('连接断开')
    });

    socket.write('欢迎光临 深入浅出 nodejs');


});

server.listen(8124, () => {
    console.log('server bound')
});


console.log('8124')