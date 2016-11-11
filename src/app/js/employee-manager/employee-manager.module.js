'use strict';
angular.module('employee-manager', ['data-repository', 'employee', 'team'])
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $routeProvider
                .when('/employee-table', {
                    template: '<employee-table></employee-table>'
                }).when('/employee-search-bar', {
                template: '<employee-search-bar></employee-search-bar>'
            }).otherwise({redirectTo: '/employee-table'});
        }
    ])
    .controller('ViewController', ['$scope', function ($scope) {

        $scope.tab = 1;
        $scope.selectPanel = function (panel) {
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
    });