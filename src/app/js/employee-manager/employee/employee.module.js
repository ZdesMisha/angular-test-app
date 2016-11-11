'user strict';
angular.module('employee', ['ui-select-infinity', 'infinite-scroll', 'data-repository', 'team'])

    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
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
            } else {
                out = "No such employees";
            }
            return out;
        };
    })
    .controller('EmployeeController', ['$rootScope', '$scope', '$timeout', 'EmployeeRepositoryService', 'TeamService', 'EmployeeService',
        function ($rootScope, $scope, $timeout, employeeRepositoryService, teamService, employeeService) {
            $scope.pagination = {
                currentPage: 0,
                perPage: 30,
                totalPages: 0
            };
            $scope.employees = employeeService.getAll();
            $scope.showedEmployees = $scope.employees.slice(0, 30);
            $scope.selectedEmployees = teamService.selectedEmployees;
            $scope.pagination.totalPages = $scope.employees.length / $scope.pagination.perPage;
            //$scope.employeeService = employeeService;
            $scope.teamService = teamService;
            $scope.limit = $scope.pagination.perPage;
            $scope.isError = false;
            $scope.employeeToAdd = {};


            $scope.transform = function (newEmp) {
                return {
                    name: newEmp,
                    age: 'unknown',
                    grade: 'unknown',
                    job: 'unknown'
                };
            };

            $scope.clear = function () {
                console.log("clear");
                $scope.limit = $scope.pagination.perPage;
            };

            $scope.increaseLimit = function () {
                $scope.limit += $scope.limit;
            };

            $scope.synchronize = function () {
                var isOpened = $.grep($scope.teamService.accordionOpen, function (index) {
                        return index == true;
                    }).length != 0;
                if (isOpened) {
                    console.log("Synchronize");
                    //$rootScope.$broadcast('SynchronizeEvent', $scope.selectedEmployees);
                    $scope.selectedEmployees.forEach(function(employee){
                        $rootScope.$broadcast('AddEmployeeEvent',employee);
                    })
                } else {
                    console.log("Cannot synchronize!")
                }
            };

            $scope.addEmployee = function (employee) {
                var isOpened = $.grep($scope.teamService.accordionOpen, function (index) {
                        return index == true;
                    }).length != 0;
                $scope.employeeToAdd = employee;
                if (isOpened) {
                    console.log("add Employee to opened team");
                    if (teamService.isEmployeeAvailable($scope.employeeToAdd.id)) {
                        $rootScope.$broadcast('AddEmployeeEvent', $scope.employeeToAdd);
                    } else {
                        raiseError();
                        console.log("Such employee is already in team. Cannot add employee");
                    }
                } else {
                    console.log("Please chose team.     Cannot add employee!")
                }
                //$scope.employeeToAdd = {};
            };

            $scope.getNextPage = function () {
                //todo check if it possible to paginate
                $scope.pagination.currentPage++;
                $scope.showedEmployees = $scope.employees.slice(1, $scope.pagination.perPage * $scope.pagination.currentPage)
            };

            $scope.isOpened = function (index) {
                return index == true;
            };

            $scope.$on('TeamChangedEvent', function (event, team) {
                console.log(team);
                if (team != {}) {
                    $scope.selectedEmployees = team.employees;
                } else {
                    $scope.selectedEmployees = [];
                }
            });


            function raiseError() {
                $scope.isError = true;
                $timeout(function () {
                    $scope.isError = false;
                }, 3000);
            }
        }])

    .factory('EmployeeService', ['EmployeeRepositoryService', function (employeeRepositoryService) {
        function getAll() {
            console.log("gotAll");
            return employeeRepositoryService.getAll();
        }

        return {
            selectedEmployees: [],
            getAll: getAll
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
