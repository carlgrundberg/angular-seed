module.exports = function (io) {

    var state = {
        voters: {},
        total: 0,
        voted: 0
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

        socket.on('voter', function () {
            console.log('New voter');
            vote(socket.id, null);
        });

        socket.on('vote', function (data) {
            console.log('vote', data);
            vote(socket.id, data.value);
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
};
