'use strict';

/* Services */

angular.module('pivoter.services', []).
  value('items', ['0', 1, 2, 3, 5, 8, 13, 21, 34, 55, '?', '<img src="img/coffe_cup.png" />']).
  factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        id: function() {
            return socket.socket.sessionid;
        }
    };
});
