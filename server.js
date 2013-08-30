/**
 * Created with JetBrains PhpStorm.
 * User: Calle
 * Date: 2012-09-27
 * Time: 09:44
 * To change this template use File | Settings | File Templates.
 */

var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/*
io.set('log level', 1);
io.set('transports', [
    'websocket'
]);
*/

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
// Serve all files in app folder
app.use(express.static(path.join(__dirname, 'app')));

// Rewrite all requests that fall through to index
app.use(function (req, res, next) {
    req.url = '/';
    next();
});

// Serve index
app.use(express.static(path.join(__dirname, 'app')));

require('./routes/socket')(io);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



