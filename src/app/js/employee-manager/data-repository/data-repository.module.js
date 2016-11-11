angular.module('data-repository', [])
    .factory('EmployeeRepositoryService', ['$http', function ($http) {
        var employees = [];
        uploadData()
        function getById(id) {
            return $.grep(employees, function (next) {
                return next.id == id;
            });
        }

        function getAll() {
            return employees;
        }

        function uploadData() {
            $http.get('/data.json').then(function (response) {
                employees = response.data;
            }, function () {
                employees = [];
            });
        }

        return {
            getById: getById,
            getAll: getAll
        }
    }])
    .factory('TeamRepositoryService', function () {
        var teams = [];

        function getById(id) {
            return $.grep(teams, function (next) {
                return next.id = id;
            });
        }

        function getAll() {
            return teams;
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
            return $.grep(teams, function (next) {
                    return next.name.toLowerCase() === name.toLowerCase();
                }).length == 0;
        }

        function addTeam(team) {
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

        // add initial team
        addTeam({id: 1, name: "Test team", employees: []});
        console.log("INITIATING DATA STORE");

        return {
            getById: getById,
            generateIdByName: generateIdByName,
            addTeam: addTeam,
            update: update,
            isNameAvailable: isNameAvailable,
            getAll: getAll
        }

    });