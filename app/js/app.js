'use strict';


// Declare app level module which depends on filters, and services
angular.module('pivoter', ['pivoter.filters', 'pivoter.services', 'pivoter.directives', 'pivoter.controllers']).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/grid.html', controller: 'GridCtrl'});
        $routeProvider.when('/results', {templateUrl: 'partials/results.html', controller: 'ResultsCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);
    });
