/**
 * Created by Ming on 2017/8/24.
 */
angular.module("demo", ["craft.core"])
    .config(function ($stateProvider) {
        $stateProvider
            .state('store', {
                // templateUrl: "store/store.html",
                templateProvider: ['$http', function ($http) {
                    return $http.get("store/store.html").then(function (tpl) {
                        return tpl.data;
                    })
                }],
                // controller: "StoreCtrl as store",
                controllerProvider: [function () {
                    return "StoreCtrl as store"
                }],
                resolve: {
                    store: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "store",
                            files: ["store/store.js"]
                        });
                    }]
                }
            })
            .state('chart', {
                templateProvider: ['$http', function ($http) {
                    return $http.get("chart/charts-template.html").then(function (tpl) {
                        return tpl.data;
                    })
                }],
                controllerProvider: [function () {
                    return "LineChartCtrl"
                }],
                resolve: {
                    chart: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                                name: "chart",
                                files: ["chart/chart.js"]
                            });
                    }]
                }
            })
    })

    .controller("AppCtrl", function ($state) {
        var app = this;
        app.click = function () {
            $state.go("store")
        };

        app.showChart = function () {
            $state.go("chart")
        }
    });

angular.module('demo').config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        events: true
    });
}]);