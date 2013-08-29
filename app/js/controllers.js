'use strict';

/* Controllers */

angular.module('pivoter.controllers', []).
    controller('GridCtrl', function ($scope, items, socket) {
        $scope.selectedValue = null;
        $scope.items = items;

        socket.emit('voter');

        $scope.vote = function(value) {
            $scope.selectedValue = value;
            socket.emit('vote', { value: value });
        };

        socket.on('update', function(state) {
            if($scope.selectedValue != null && !state.voters[socket.id()]) {
                $scope.selectedValue = null;
            }
        });
    }).
    controller('ResultsCtrl', function ($scope, items, socket) {
        $scope.result = false;

        socket.on('update', function(state) {
            $scope.state = state;
        });

        $scope.reset = function() {
            $scope.result = false;
            socket.emit('reset');
        };

        $scope.show = function() {
            var bars = {};
            for(var i in $scope.state.voters) {
                if($scope.state.voters[i] !== null) {
                    if(bars[$scope.state.voters[i]]) {
                        bars[$scope.state.voters[i]]++;
                    } else {
                        bars[$scope.state.voters[i]] = 1;
                    }
                }
            }
            $scope.items = items;
            $scope.result = bars;
        };
    }).
    controller('FooterCtrl', function ($scope, socket) {
        socket.on('update', function(state) {
            $scope.state = state;
        });
    });