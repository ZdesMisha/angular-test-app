'use strict';
(function () {
    var app = angular.module('team-tab', ['team-buffer']);

    app.directive('teamTab', function () {
        var controller = ['$rootScope','$scope', 'teamService', function ($rootScope,$scope, teamService) {

            $scope.isTabOpened = false;
            $scope.tabSelectedTeam = {name: "", mates: []};
            $scope.newTeam = {name: "", mates: []};

            $scope.addTeam = function () {
                $scope.teams.push($scope.newTeam);
                $scope.tabSelectedTeam = {name: "", mates: []};

            };


            $scope.selectTeam = function (selected) {
                $scope.isTabOpened = $scope.teams.some(function (team) {
                        return team.isOpen;
                    }) == true;
                if ($scope.isTabOpened) {
                    console.log("OPENED");
                    $scope.tabSelectedTeam = {name: selected.name, mates: selected.mates};
                    teamService.setTeamPeople($scope.tabSelectedTeam.mates);
                } else {
                    console.log("CLOSED");
                    teamService.setTeamPeople([]);
                }
                $rootScope.$broadcast('BOOM!', "Hello bitch")
            };

            $scope.teams = [
                {
                    name: 'FirstTeam',
                    mates: [{
                        "id": 1,
                        "name": "Dmitry Lemlekh",
                        "age": 21,
                        "grade": "Junior",
                        "job": "PHP Developer"
                    },
                        {
                            "id": 2,
                            "name": "Maria Sadykov",
                            "age": 22,
                            "grade": "Junior",
                            "job": "Java Developer"
                        },
                        {
                            "id": 3,
                            "name": "Maxim Basisty",
                            "age": 24,
                            "grade": "Junior",
                            "job": "QA Engineer"
                        }]
                },
                {
                    name: 'SecondTeam',
                    mates: [{
                        "id": 4,
                        "name": "Alena Reshetov",
                        "age": 26,
                        "grade": "Senior",
                        "job": "NET Developer"
                    },
                        {
                            "id": 5,
                            "name": "Alexey Kirichenko",
                            "age": 22,
                            "grade": "Junior",
                            "job": "Java Developer"
                        },
                        {
                            "id": 6,
                            "name": "Denis Guzeev",
                            "age": 24,
                            "grade": "Senior",
                            "job": "Java Developer"
                        }]
                }
            ];
        }];
        return {
            restrict: "E",
            templateUrl: 'js/team-tab/team-tab.template.html',
            controller: controller,
            controllerAs: "tab"
        };
    });


})();