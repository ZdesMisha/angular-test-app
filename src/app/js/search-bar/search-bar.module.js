'use strict';
(function () {
    var app = angular.module('search-bar', ['team-buffer', 'ui-select-infinity']);

    app.filter('propsFilter', function () {
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
                out = "No such users";
            }
            return out;
        };
    });


    app.directive('searchBar', function () {
        var controller = ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {


            var self = this;
            $scope.showedPeople = [];
            $scope.totalPeople = [];
            self.people = [];
            self.selectedPeople = [];
            self.limit = 50;
            self.pagination = {
                currentPage: 0,
                perPage: 30,
                maxPages: 50,
                totalPages: 0
            };

            $scope.$on('BOOM!', function () {
                console.log("GOT BOOM!");
            });

            $scope.getNextPage = function () {
                self.pagination.currentPage++;
                $scope.showedPeople = $scope.totalPeople.slice(1, self.pagination.perPage * self.pagination.currentPage)
            };

            self.initialLoad = function () {
                $http.get('/data.json').success(function (data) {
                    $scope.totalPeople = data;
                    $scope.showedPeople = data.slice(1, self.pagination.perPage);
                    self.pagination.currentPage = 1;
                    self.totalpages = data.length / self.pagination.maxPages;
                });
            };


            $scope.$watch('teamService.setTeamPeople()', function () {
                console.log('New team selected');
                //$scope.selectedPeople = teamService.getTeamPeople();
            });

            self.synchronize = function () {
                console.log('Synchronization started');
               // teamService.synchronize();
            };

            self.tagTransform = function (newTag) {
                var item = {
                    name: newTag,
                    age: 'unknown',
                    grade: 'unknown',
                    job: 'unknown'
                };
                return item;
            };

            self.initialLoad();

        }];


        return {
            restrict: "E",
            templateUrl: 'js/search-bar/search-bar.template.html',
            controller: controller,
            controllerAs: 'searching'
        }
    });
})();
