'use strict';
angular.module('team', ['employee', 'data-repository'])

    .controller('TeamController', ['$rootScope', '$scope', '$timeout', 'TeamService',
        function ($rootScope, $scope, $timeout, teamService) {

            $scope.teamService = teamService;
            $scope.teams = teamService.getAll();
            $scope.selectedteam = {};
            $scope.newTeam = {id: "", name: "", employees: []};
            $scope.isError = false;

            $scope.addTeam = function () {
                if (teamService.isNameAvailable($scope.newTeam.name)) {
                    $scope.newTeam.id = teamService.generateIdByName($scope.newTeam.name);
                    teamService.add($scope.newTeam);
                    clean();
                } else {
                    showError();
                }
            };

            $scope.delete = function (empId) {
                teamService.removeEmployee($scope.selectedTeam.id, empId);
                $scope.selectedteam = teamService.getById($scope.selectedTeam.id);
                $rootScope.$broadcast('TeamChangedEvent', $scope.selectedTeam.id);
            };

            $scope.selectTeam = function (selected, index) {
                teamService.anyTeamOpen[index] = !teamService.anyTeamOpen[index];
                if (teamService.isAnyTeamOpen()) {
                    $scope.selectedTeam = selected;

                } else {
                    $scope.selectedTeam = {id: null, name: null, employees: []};

                }
                $rootScope.$broadcast('TeamChangedEvent', $scope.selectedTeam.id)
                $rootScope.selectedTeamId = $scope.selectedTeam.id;
            };

            $scope.$on("RefreshEvent", function (event, employees) {
                var modifiedTeam = $scope.selectedTeam;
                modifiedTeam.employees = employees;
                teamService.update(modifiedTeam);
                $scope.selectedTeam = teamService.getById($scope.selectedTeam.id);
            });

            $scope.$on("AddEmployeeEvent", function (event, employee) {
                var modifiedTeam = $scope.selectedTeam;
                modifiedTeam.employees.push(employee);
                teamService.update(modifiedTeam);
                $scope.selectedTeam = teamService.getById($scope.selectedTeam.id);

            });

            function clean() {
                $scope.newTeam = {id: "", name: "", employees: []};
            }

            function showError() {
                $scope.isError = true;
                $timeout(function () {
                    $scope.isError = false;
                }, 3000);
            }
        }])

    .factory('TeamService', ['TeamRepositoryService', '$rootScope', function (teamRepositoryService, $rootScope) {

        var anyTeamOpen = [false];

        function getAll() {
            return teamRepositoryService.getAll(
            );
        }

        function getById(id) {
            if (id != null) {
                return teamRepositoryService.getById(id);
            } else {
                return {id: "", name: "", employees: []};
            }
        }

        function add(team) {
            teamRepositoryService.add(team);
        }

        function isEmployeeNameValid(name) {
            teamRepositoryService.isNameAvailable(name);
        }

        function canAdd(empId) {
            return $.grep(teamRepositoryService.getAll(), function (team) {
                    return $.grep(team.employees, function (employee) {
                            return employee.id == empId;
                        }).length != 0;
                }).length == 0;
        }

        function canRefresh(empId) {
            return $.grep(teamRepositoryService.getAll(), function (team) {
                    return $.grep(team.employees, function (employee) {
                            return employee.id == empId && team.id != $rootScope.selectedTeamId;
                        }).length != 0;
                }).length == 0;
        }


        function update(team) {
            teamRepositoryService.update(team);
        }

        function generateIdByName(name) {
            var hash = 0, chr, i;
            var len = name.length;
            if (len === 0) return hash;
            for (i = 0; i < len; i++) {
                chr = name.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash;
        }

        function isNameAvailable(name) {
            return teamRepositoryService.isNameAvailable(name);
        }

        function removeEmployee(teamId, empId) {
            teamRepositoryService.removeEmployee(teamId, empId);
        }

        function isAnyTeamOpen() {
            return $.grep(anyTeamOpen, function (index) {
                    return index == true;
                }).length != 0;
        }


        return {
            anyTeamOpen: anyTeamOpen,
            update: update,
            canAdd: canAdd,
            canRefresh: canRefresh,
            isEmployeeNameValid: isEmployeeNameValid,
            generateIdByName: generateIdByName,
            isNameAvailable: isNameAvailable,
            getAll: getAll,
            getById: getById,
            add: add,
            removeEmployee: removeEmployee,
            isAnyTeamOpen: isAnyTeamOpen
        }
    }])

    .directive('teamAccordion', function () {
        return {
            restrict: "E",
            templateUrl: 'js/employee-manager/team/team-accordion.template.html',
            controller: 'TeamController',
            controllerAs: "teamCtrl"
        };
    });

