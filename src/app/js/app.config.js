'use strict';

angular.module('userManagerApp').config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/user-list', {
                template: '<user-list></user-list>'
            }).when('/search-bar', {
            template: '<search-bar></search-bar>'
        }).otherwise('/user-list');
    }
]);
