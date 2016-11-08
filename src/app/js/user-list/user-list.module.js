'user strict';
(function () {
    // var app = angular.module('user-list', ['dc.endlessScroll']);
    //
    // app.directive("userList", function () {
    //
    //     var controller = ['$http',function ($http) {
    //         var self = this;
    //             self.users = [];
    //             $http.get("/data.json").success(function (data) {
    //                 self.users = data.slice(1,10);
    //             });
    //     }];
    //     return {
    //         restrict: "E",
    //         templateUrl: 'js/user-list/user-list.template.html',
    //         controller: controller,
    //         controllerAs: "store"
    //     }
    // });


    var app = angular.module('user-list', ['infinite-scroll']);

    // app.factory('PeopleLoader', function ($http, $q) {
    //     function PeopleLoader() {
    //     }
    //
    //     PeopleLoader.prototype.init = function (params) {
    //         params = angular.extend({page: 1}, params);
    //
    //         // Properties
    //         this.pagination = {perPage: 30, maxPages: 50};
    //         this.users = [];
    //
    //         // Load the initial page, using the URL param if available
    //         return this.load(params.page);
    //     };
    //
    //     PeopleLoader.prototype.load = function (page) {
    //         page = parseInt(page, 10);
    //         page = isNaN(page) ? 1 : page;
    //
    //         var method = this.pagination.lastPage && page < this.pagination.lastPage ? 'unshift' : 'push';
    //
    //         // Define the current page
    //         if (this.pagination.totalPages) {
    //             page = Math.min(Math.max(page, 1), this.pagination.totalPages);
    //         }
    //
    //         // Only load a new page if it is not already loaded
    //         if ((page > this.pagination.lastPage || !this.pagination.lastPage) ||
    //             (page < this.pagination.firstPage || !this.pagination.firstPage)) {
    //             return this.get(page)
    //                 .success(angular.bind(this, function (data) {
    //                     console.log("PAge" + page);
    //                     var response = data.slice(this.pagination.perPage * page, this.pagination.perPage * (page + 1));
    //
    //                     // Set the last page
    //                     if (!this.pagination.lastPage || page > this.pagination.lastPage) {
    //                         this.pagination.lastPage = page;
    //                     }
    //
    //                     // Set the first page, if not already set
    //                     if (!this.pagination.firstPage || page < this.pagination.firstPage) {
    //                         this.pagination.firstPage = page;
    //                     }
    //
    //                     // Determine the total number of pages
    //                     this.pagination.totalPages = Math.ceil(response.length / this.pagination.perPage);
    //
    //                     if (this.pagination.maxPages) {
    //                         this.pagination.totalPages = Math.min(this.pagination.totalPages, this.pagination.maxPages);
    //                     }
    //
    //                     // Append or prepend the fetched posts, depending if they are posts from the next or previous page
    //                     this.users[method].apply(this.users, response);
    //
    //                     // Return the array of posts
    //                     return response;
    //                 }));
    //         } else {
    //             return $q.reject();
    //         }
    //     };
    //
    //     PeopleLoader.prototype.next = function () {
    //         var page = !this.pagination.lastPage ? 1 : this.pagination.lastPage + 1;
    //
    //         // Get the next page
    //         return this.load(page);
    //     };
    //
    //     PeopleLoader.prototype.previous = function () {
    //         var page = !this.pagination.firstPage ? 1 : this.pagination.firstPage - 1;
    //
    //         // Get the previous page
    //         return this.load(page);
    //     };
    //
    //     PeopleLoader.prototype.get = function (page) {
    //         var url = '/data.json',
    //             config = {
    //                 params: {
    //                     limit: this.pagination.perPage
    //                 }
    //             };
    //
    //         // Define the post number to start from
    //         config.params.offset = (page - 1) * config.params.limit;
    //
    //         // Make a HTTP request
    //         return $http.get(url);
    //     };
    //
    //     return {
    //         create: function () {
    //             return new PeopleLoader();
    //         }
    //     };
    // });

    app.directive("userList", function () {

        var controller = (['$http', '$scope', function ($http, $scope) {

            var self = this;
            self.totalItems = [];
            self.limit = 0;
            self.showedItems = [];
            self.pagination = {
                currentPage: 0,
                perPage: 30,
                maxPages: 50,
                totalPages: 0
            };

            self.increaseLimit = function () {
                self.limit += 50;
                console.log('Increase people Limit', self.limit)
            };

            self.initialLoad = function () {
                $http.get('/data.json').success(function (data) {
                    self.totalItems = data;
                    self.showedItems = data.slice(1, self.pagination.perPage);
                    console.log(self.showedItems);
                    self.totalpages = data.length / self.pagination.maxPages;
                });
            };

            self.getNextPage = function (page) {
                var isTerminal = self.pagination.currentPage >= self.pagination.totalPages && self.pagination.currentPage <= 1;

                if (!isTerminal) {
                    self.loading = true;

                    self.showedItems.push.apply(self.showedItems, self.totalItems.slice(page * self.pagination.perPage, (1 + page) * self.pagination.perPage));
                    self.loading = false;

                }
            };

            // // Register event handler
            // $scope.$on('endlessScroll:next', function () {
            //     console.log("GET NEXT PAGE");
            //     self.pagination.currentPage += 1;
            //     self.getNextPage(self.pagination.currentPage);
            // });

            self.initialLoad();

            //     var peopleLoader = PeopleLoader.create();
            //
            //     // Private methods
            //     function onPageLoad() {
            //         $scope.users = peopleLoader.users;
            //         $scope.pagination = peopleLoader.pagination;
            //         $scope.loading = false;
            //     }
            //
            //     function onPageLoadError() {
            //         $scope.loading = false;
            //     }
            //
            //     // Scope methods
            //     $scope.nextPage = function () {
            //         $scope.loading = true;
            //         console.log("NEXT PAGE");
            //         peopleLoader.next().then(onPageLoad, onPageLoadError);
            //     };
            //
            //     $scope.previousPage = function () {
            //         $scope.loading = true;
            //
            //         peopleLoader.previous().then(onPageLoad, onPageLoadError);
            //     };
            //
            //     // Register event handlers
            //     $scope.$on('endlessScroll:next', $scope.nextPage);
            //     $scope.$on('endlessScroll:previous', $scope.previousPage);
            //
            //     // Initialise
            //     var params = {
            //         page: $location.search().page
            //     };
            //
            //     peopleLoader.init(params).then(onPageLoad);
        }]);
        return {
            restrict: "E",
            templateUrl: 'js/user-list/user-list.template.html',
            controller: controller,
            controllerAs: "store"
        }
    })
})();
