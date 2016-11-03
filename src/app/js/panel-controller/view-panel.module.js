'use strict';
(function () {
    var app = angular.module('view-panel', []);
    app.directive('viewPanel', function () {
        return {
            restrict:"E",
            templateUrl: 'js/panel-controller/view-panel.template.html',
            controller: function ViewPanelController() {
                this.tab = 1;
                this.selectPanel = function (panel) {
                    this.tab = panel;
                };

                this.isSelected = function (panel) {
                    return this.tab == panel;
                }
            },
            controllerAs:"panel"
        }
    })
})();
