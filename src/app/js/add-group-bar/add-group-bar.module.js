'use strict';
(function () {
    var app = angular.module('add-group-bar', []);
    app.directive('addGroupBar', function () {
        var controller = function () {
            var self = this;
            self.team = {};
            self.addTeam = function (teamName) {
                self.team = {name: teamName, mates: []};
            }
        };

        return {
            restrict: "E",
            templateUrl: 'js/add-group-bar/add-group-bar.template.html',
            controller: controller,
            controllerAs: "add"

        }
    });
})();
