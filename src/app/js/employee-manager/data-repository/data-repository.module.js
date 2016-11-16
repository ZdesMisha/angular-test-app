angular.module('data-repository', [])
    .factory('EmployeeRepositoryService', ['$http', function ($http) {

        var employees = [];

        function upload() {
            return $http.get('/data.json').then(function (response) {
                employees = response.data;
                return employees;
            }, function () {
                employees = [];
            });
        }

        function getById(id) {
            return $.grep(employees, function (next) {
                return next.id == id;
            })[0];
        }

        function getAll() {
            return employees;
        }

        return {
            getById: getById,
            getAll: getAll,
            upload:upload
        }
    }])

    .factory('TeamRepositoryService', function () {
        var teams = [];

        function getById(id) {
            return $.grep(teams, function (next) {
                return next.id == id;
            })[0];
        }

        function getAll() {
            return teams;
        }

        function add(team) {
            teams.push(team);
        }


        function update(team) {
            for (var i = 0; i <= teams.length; i++) {
                if (teams[i].id == team.id) {
                    teams[i] = team;
                    break;
                }
            }
        }

        function removeEmployee(teamId, employeeId) {
            teams.forEach(function (team) {
                if (team.id == teamId) {
                    team.employees.forEach(function (employee) {
                        if (employee.id == employeeId) {
                            team.employees.splice(team.employees.indexOf(employee), 1);
                        }
                    })
                }
            })
        }

        function isNameAvailable(name) {
            return $.grep(teams, function (next) {
                    return next.name.toLowerCase() === name.toLowerCase();
                }).length == 0;
        }


        // add initial team
        add({id: 12345678, name: "Moody team", employees: []});

        return {
            add: add,
            update: update,
            isNameAvailable: isNameAvailable,
            getAll: getAll,
            getById: getById,
            removeEmployee: removeEmployee
        }
    });