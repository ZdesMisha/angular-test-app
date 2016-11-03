'user strict';
(function () {
    var app = angular.module('user-list', []);

    app.directive("userList", function () {

        var controller = ['$http',function ($http) {
            var self = this;
                self.users = [];
                $http.get("/data.json").success(function (data) {
                    self.users = data.slice(1,10);
                });
        }];
        return {
            restrict: "E",
            templateUrl: 'js/user-list/user-list.template.html',
            controller: controller,
            controllerAs: "store"
        }
    });
})();
