/**
 * Created by misha on 03.11.16.
 */
(function () {
    var app = angular.module('team-buffer', []);
    app.factory('notify', function () {
        var bufferedTeam = {};
        return function (team) {
            bufferedTeam = team;
            console.log("Changed team" + bufferedTeam.mates);
        };
    });
    app.service('teamService', function () {

        var searchedPeople = [];
        var teamPeople = [];
        var isTeamOpened = false;


        var synchronize = function () {
            if (isTeamOpened) {
                teamPeople = searchedPeople;
            }
        };

        var getTeamPeople = function () {
            return teamPeople;
        };

        var getSearchedPeople = function () {
            return searchedPeople;
        };

        var setTeamPeople = function (people) {
            console.log("setTeamPeople");
            teamPeople = people;
        };

        var setSearchedPeople = function (people) {
            searchedPeople = people;
        };
        return {
            synchronize: synchronize,
            getTeamPeople: getTeamPeople,
            getSearchedPeople: getSearchedPeople,
            setTeamPeople: setTeamPeople,
            setSearchedPeople: setSearchedPeople
        }
    });
})();