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
            selectedEmployees: [],
            getAll: getAll,
            upload: upload
        }

    }])
    .controller('EmployeeController', ['$rootScope', '$scope', '$timeout', 'EmployeeRepositoryService', 'TeamService', 'EmployeeService',
        function ($rootScope, $scope, $timeout, employeeRepositoryService, teamService, employeeService) {
            console.log('INITIATING EMPLOYEE CONTROLLER');
            $scope.pagination = {
                limit: 30,
                perPage: 30,
                currentPage: 0,
                totalPages: 0
            };
            $scope.error = {
                table: false,
                search: false
            };
            $scope.employees = [];
            $scope.showedEmployees = [];
            $scope.pagination.totalPages = $scope.employees.length / $scope.pagination.perPage;
            $scope.selectedEmployees = [];
            $scope.teamService = teamService;
            $scope.employeeToAdd = {};
            $scope.tableSearch = "";

            employeeService.upload().then(function (data) {
                $scope.employees = data;
                $scope.showedEmployees = $scope.employees.slice(0, $scope.pagination.perPage);
            });

            $scope.transform = function (employee) {
                return {
                    name: employee,
                    age: 'unknown',
                    grade: 'unknown',
                    job: 'unknown'
                };
            };

            $scope.clear = function () {
                $scope.pagination.limit = $scope.pagination.perPage;
                $scope.pagination.currentPage = 0;
            };

            $scope.increaseLimit = function () {
                $scope.pagination.limit += $scope.pagination.limit;
                $scope.pagination.currentPage++;
            };

            $scope.synchronizeEmployees = function () {
                var employeesToSynch = [];
                if (isAccordionOpened()) {
                    console.log("SYNCH");
                    $scope.selectedEmployees.forEach(function (employee) {
                        if (!teamService.canSynch(employee.id)) {
                            showSearchTooltip();
                        } else {
                            employeesToSynch.push(employee);
                        }
                    });
                    $rootScope.$broadcast('SynchronizeEvent', employeesToSynch);
                } else {
                    console.log("Cannot synchronize!")
                }
            };

            $scope.addEmployee = function (employee) {
                $scope.employeeToAdd = employee;
                if (isAccordionOpened()) {
                    console.log("ADD");
                    if (teamService.canAdd($scope.employeeToAdd.id)) {
                        $rootScope.$broadcast('AddEmployeeEvent', $scope.employeeToAdd);
                    } else {
                        showTableTooltip();
                    }
                } else {
                    console.log("Please chose team.Cannot add employee!")
                }
            };


            $scope.getNextPage = function () {
                //todo check if it possible to paginate
                $scope.pagination.currentPage++;
                $scope.showedEmployees = $scope.employees.slice(1, $scope.pagination.perPage * $scope.pagination.currentPage)
            };

            $scope.isOpened = function (index) {
                return index == true;
            };

            $scope.$on('TeamChangedEvent', function (event, teamId) {
                if (teamId != null) {
                    $scope.selectedEmployees = teamService.getById(teamId).employees || [];
                } else {
                    $scope.selectedEmployees = [];
                }
            });

            $scope.isAvailable = function (empId) {
                return teamService.canSynch(empId);
            };

            function isAccordionOpened() {
                return $.grep($scope.teamService.anyTeamOpen, function (index) {
                        return index == true;
                    }).length != 0;
            }

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
