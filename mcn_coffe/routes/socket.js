/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(8080, socket_ip);
io.on('connection', function (socket) {
    var id = socket.handshake.query.id;
    socket.on(id, function(data){
        io.emit(id, {
            data: data
        });
    });
});

module.exports = io;