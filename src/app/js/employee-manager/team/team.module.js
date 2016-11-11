'use strict';
var app = angular.module('team', ['employee', 'data-repository'])

    .controller('TeamController', ['$rootScope', '$scope', '$timeout', 'TeamRepositoryService', 'TeamService',
        function ($rootScope, $scope, $timeout, teamRepositoryService, teamService) {

            $scope.teams = teamRepositoryService.getAll();
            $scope.selectedTeam = {};
            $scope.newTeam = {id: "", name: "", employees: []};
            $scope.teamService = teamService;
            $scope.isError = false;

            $scope.addTeam = function () {
                if (teamRepositoryService.isNameAvailable($scope.newTeam.name)) {
                    $scope.newTeam.id = teamRepositoryService.generateIdByName($scope.newTeam.name);
                    teamRepositoryService.addTeam($scope.newTeam);
                    clean();
                } else {
                    $scope.isError = true;
                    $timeout(function () {
                        $scope.isError = false;
                    }, 3000);
                }

            };

            $scope.selectTeam = function (selected) {
                var isOpened = $.grep($scope.teamService.accordionOpen, function (index) {
                        return index == true;
                    }).length != 0;
                if (isOpened) {
                    console.log("OPENED");
                    $scope.selectedTeam = selected;
                } else {
                    console.log("CLOSED");
                    $scope.selectedTeam = {};
                }
                $rootScope.$broadcast('TeamChangedEvent', $scope.selectedTeam)
            };

            $scope.$on("SynchronizeEvent", function (event, employees) {
                //todo check some how employees
                $scope.selectedTeam.employees = employees;
                teamService.update($scope.selectedTeam);
            });

            $scope.$on("AddEmployeeEvent", function (event, employee) {
                //todo check some how employees
                $scope.selectedTeam.employees.push(employee);
                teamService.update($scope.selectedTeam);
            });

            function clean() {
                $scope.newTeam = {id: "", name: "", employees: []};
            }
        }])

    .factory('TeamService', ['TeamRepositoryService', function (teamRepositoryService) {

        function isEmployeeAvailable(empId) {
            return $.grep(teamRepositoryService.getAll(), function (team) {
                    return $.grep(team.employees, function (employee) {
                            return employee.id == empId;
                        }).length != 0;
                }).length == 0;
        }


        function update(team) {
            teamRepositoryService.update(team);
        }


        return {
            accordionOpen: [false],
            selectedEmployees: [],
            isEmployeeAvailable: isEmployeeAvailable,
            update: update
        }
    }])

    .directive('teamBar', function () {
        return {
            restrict: "E",
            templateUrl: 'js/employee-manager/team/team-bar.template.html',
            controller: 'TeamController',
            controllerAs: "addCtrl"
        }
    })

    .directive('teamAccordion', function () {
        return {
            restrict: "E",
            templateUrl: 'js/employee-manager/team/team-accordion.template.html',
            controller: 'TeamController',
            controllerAs: "teamCtrl"
        };
    });

