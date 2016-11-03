'use strict';
(function () {
    var app = angular.module('search-bar', []);

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
        var controller = function ($http) {
            var self = this;
            self.selectedPeople = [];
            self.people = [];

            $http.get("/data.json").success(function (data) {
                self.people = data.slice(1,10);
            });
            
            self.tagTransform = function (newTag) {
                var item = {
                    name: newTag,
                    age: 'unknown',
                    grade: 'unknown',
                    job: 'unknown'
                };
                return item;
            };
            
        };
        return {
            restrict: "E",
            templateUrl: 'js/search-bar/search-bar.template.html',
            controller: controller,
            controllerAs: 'searching'
        }
    });
})();
