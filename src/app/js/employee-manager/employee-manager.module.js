'use strict';
angular.module('employee-manager', ['data-repository', 'team', 'employee','ui.router'])
    .config(['$stateProvider', '$urlRouterProvider',
        function config($stateProvider, $urlRouterProvider) {

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
        $scope.selectPanel = function (url) {
            $scope.tab = url;
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