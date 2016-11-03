/**
 * Created by misha on 02.11.16.
 */
'use strict';
(function () {
    // });
    var app = angular.module('team-tab', []);

    app.directive('teamTab', function () {
        var controller1 = ['$scope', function () {
            this.team = {name: "", mates: []};
            var self = this;
            this.addTeam = function () {
                self.teams.push(self.team);
                self.team = {name: "", mates: []};
    
            };
            this.teams = [
                {
                    name: 'FirstTeam',
                    mates: [{name: 'TeamMate1'}, {name: 'TeamMate2'}, {name: 'TeamMate3'}]
                },
                {
                    name: 'SecondTeam',
                    mates: [{name: 'TeamMate1'}, {name: 'TeamMate2'}, {name: 'TeamMate3'}]
                }
            ];
        }];
        return {
            restrict: "E",
            templateUrl: 'js/team-tab/team-tab.template.html',
            controller: controller1,
            controllerAs: "tab"
        };
    });
  
   
})();