/**
 * Created with JetBrains PhpStorm.
 * User: Calle
 * Date: 2012-09-27
 * Time: 09:44
 * To change this template use File | Settings | File Templates.
 */

var http = require('http');
var fs = require('fs');

var app = http.createServer(function (req, res) {
    if (req.url == '/') req.url = '/index.html';
    fs.readFile(__dirname + '/app' + req.url, function (err, data) {
        if (err) {
            res.writeHead(500);
            res.end('Error loading ' + req.url);
        } else {
            if (req.url.indexOf(".css", req.url.length - ".css".length) !== -1) {
                res.writeHead(200, {'Content-Type':'text/css;charset=UTF-8'});
            } else {
                res.writeHead(200, {'Content-Type':'text/html;charset=UTF-8'});
            }
            res.end(data);
        }
    });
});

var io = require('socket.io').listen(app);
io.set('log level', 1);

io.set('transports', [
    'websocket'
]);

app.listen(1337);

var state = {
    voters:{},
    status:0,
    total:0,
    voted:0
};

function total_voters() {
    return Object.keys(state.voters).length;
}

function num_voted() {
    var voted = 0;
    for (var i in state.voters) {
        if (state.voters[i] != null) {
            voted++;
        }
    }
    return voted;
}

function reset_state() {
    state.status = 0;
    for (var i in state.voters) {
        state.voters[i] = null;
    }
}

function vote(id, value) {
    state.voters[id] = value;
    send_update();
}

function send_update(socket) {
    state.total = total_voters();
    state.voted = num_voted();

    if (socket) {
        console.log('sending update to socket ' + socket.id);
        socket.emit('update', state);
    } else {
        console.log('sending update to all');
        io.sockets.emit('update', state);
    }
}

io.sockets.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log("New connection from " + address.address + ":" + address.port + " (" + socket.handshake.headers.referer + ")");
    send_update(socket);

    socket.on('voter', function() {
        console.log('New voter');
        vote(socket.id, null);
    });

    socket.on('vote', function (data) {
        console.log('vote', data);
        vote(socket.id, data.value);
    });

    socket.on('showresults', function () {
        console.log('showresults');
        state.status = 1;
        send_update();
    });

    socket.on('reset', function () {
        console.log('reset');
        reset_state();
        send_update();
    });

    socket.on('disconnect', function () {
        delete state.voters[socket.id];
        send_update();
    });
});
