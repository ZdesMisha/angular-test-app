'user strict';
angular.module('employee', ['ui-select-infinity', 'infinite-scroll', 'data-repository', 'team'])

    .filter('employeeFilter', function () {
        return function (items, props) {
            var out = [];
            items.forEach(function (item) {
                var itemMatches = false;
                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
            return out;
        };
    })
    .controller('EmployeeController', ['$rootScope', '$scope', '$timeout', 'EmployeeRepositoryService', 'TeamService', 'EmployeeService',
        function ($rootScope, $scope, $timeout, employeeRepositoryService, teamService, employeeService) {

            $scope.pagination = {
                limit: 30
            };
            $scope.error = {
                table: false,
                search: false
            };
            $scope.teamService = teamService;
            $scope.employees = [];
            $scope.selectedEmployees = teamService.getById($rootScope.selectedTeamId).employees;
            $scope.employeeToAdd = {};
            $scope.tableSearch = "";

            employeeService.upload().then(function (data) {
                $scope.employees = data;
            });

            $scope.clear = function () {
                $scope.pagination.limit = 30;
            };

            $scope.increaseLimit = function () {
                $scope.pagination.limit += $scope.pagination.limit;
            };

            $scope.isOpened = function (index) {
                return index == true;
            };

            $scope.refreshEmployees = function () {
                var employeesToRefresh = [];
                if (teamService.isAnyTeamOpen()) {
                    $scope.selectedEmployees.forEach(function (employee) {
                        if (teamService.canRefresh(employee.id)) {
                            employeesToRefresh.push(employee);
                        } else {
                            showSearchTooltip();
                        }
                    });
                    $rootScope.$broadcast('RefreshEvent', employeesToRefresh);
                }
            };

            $scope.addEmployee = function (employee) {
                $scope.employeeToAdd = employee;
                if (teamService.isAnyTeamOpen()) {
                    if (teamService.canAdd($scope.employeeToAdd.id)) {
                        $rootScope.$broadcast('AddEmployeeEvent', $scope.employeeToAdd);
                    } else {
                        showTableTooltip();
                    }
                }
            };

            $scope.$on('TeamChangedEvent', function (event, teamId) {
                if (teamId != null) {
                    $scope.selectedEmployees = teamService.getById(teamId).employees || [];
                } else {
                    $scope.selectedEmployees = [];
                }
            });

            function showTableTooltip() {
                $scope.error.table = true;
                $timeout(function () {
                    $scope.error.table = false;
                }, 3000);
            }

            function showSearchTooltip() {
                $scope.error.search = true;
                $timeout(function () {
                    $scope.error.search = false;
                }, 3000);
            }
        }])

    .factory('EmployeeService', ['EmployeeRepositoryService', function (employeeRepositoryService) {

        function upload() {
            return employeeRepositoryService.upload().then(function (data) {
                return data;
            })
        }

        function getAll() {
            return employeeRepositoryService.getAll();
        }

        return {
            getAll: getAll,
            upload: upload
        }
    }])


    .directive('employeeSearchBar', function () {
        return {
            restrict: "E",
            templateUrl: 'js/employee-manager/employee/employee-search-bar.template.html',
            controller: 'EmployeeController',
            controllerAs: 'searchCtrl'
        }
    })

    .directive("employeeTable", function () {
        return {
            restrict: "E",
            templateUrl: 'js/employee-manager/employee/employee-table.template.html',
            controller: 'EmployeeController',
            controllerAs: "tableCtrl"
        }
    });
