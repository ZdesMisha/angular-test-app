'use strict';
angular.module('employee-manager', ['data-repository', 'team', 'employee','ui.router'])
    .config(['$locationProvider', '$routeProvider','$stateProvider', '$urlRouterProvider',
        function config($locationProvider, $routeProvider,$stateProvider, $urlRouterProvider) {
            // $routeProvider
            //     .when('/employee-table', {
            //         template: '<employee-table></employee-table>'
            //     }).when('/employee-search-bar', {
            //     template: '<employee-search-bar></employee-search-bar>'
            // }).otherwise({redirectTo: '/employee-table'});
            $stateProvider
                .state('table', {
                    url: "/employee-table",
                   template: '<employee-table></employee-table>'
                })

                .state('search', {
                    url: "/employee-search-bar",
                    template: '<employee-search-bar></employee-search-bar>'
                });
            $urlRouterProvider.otherwise('/employee-table');
        }
    ])
    .controller('ViewController', ['$scope','$state', function ($scope,$state) {

        $scope.tab = $state.current.url;
        $scope.selectPanel = function (panel) {
            console.log("STATE:");
            console.log($state.current.url);
            $scope.tab = panel;
        };

        $scope.isSelected = function (panel) {
            return $scope.tab == panel;
        }
    }])
    .directive('viewPanel', function () {
        return {
            restrict: "E",
            templateUrl: 'js/employee-manager/view-panel.template.html',
            controller: 'ViewController',
            controllerAs: "viewCtrl"
        }
    })
    .run(['$rootScope', function($rootScope) {
        console.log("RUN");
    }]);