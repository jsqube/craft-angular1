/**
 * Created by Ming on 2017/8/24.
 */
angular.module("demo", ["craft.core", 'metadata'])
    .config(function ($stateProvider) {
        $stateProvider
            // .state('store', {
            //     // templateUrl: "store/store.html",
            //     templateProvider: ['$http', function ($http) {
            //         return $http.get("store/store.html").then(function (tpl) {
            //             return tpl.data;
            //         })
            //     }],
            //     // controller: "StoreCtrl as store",
            //     controllerProvider: [function () {
            //         return "StoreCtrl as store"
            //     }],
            //     resolve: {
            //         store: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load({
            //                 name: "store",
            //                 files: ["store/store.js"]
            //             });
            //         }]
            //     }
            // })
            // .state('chart', {
            //     templateProvider: ['$http', function ($http) {
            //         return $http.get("chart/charts-template.html").then(function (tpl) {
            //             return tpl.data;
            //         })
            //     }],
            //     controllerProvider: [function () {
            //         return "LineChartCtrl"
            //     }],
            //     resolve: {
            //         chart: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load({
            //                     name: "chart",
            //                     files: ["chart/chart.js"]
            //                 });
            //         }]
            //     }
            // })
            .state('home', {
                url: "/{page}",
                templateProvider: ['$stateParams','$templateCache','$http', function ($stateParams,$templateCache,$http) {
                    var appConfig = $templateCache.get('meta/app-module-config.json');
                    var config = appConfig[$stateParams.page];
                    return $http.get(config.tpl).then(function (tpl) {
                        return tpl.data;
                    });
                }],
                controllerProvider: ['$stateParams','$templateCache', function ($stateParams, $templateCache) {
                    var appConfig = $templateCache.get('meta/app-module-config.json');
                    var config = appConfig[$stateParams.page];
                    return config.ctrl;
                }],
                resolve: {
                    listComponents: ['$ocLazyLoad','$templateCache', '$stateParams',function ($ocLazyLoad,$templateCache, $stateParams) {
                        var appConfig = $templateCache.get('meta/app-module-config.json');
                        var config = appConfig[$stateParams.page];
                        return $ocLazyLoad.load(config.modules);
                    }]
                }
            });
    })

    .controller("AppCtrl", function ($state) {
        var app = this;
        app.click = function () {
            $state.go("store");
        }

        app.showChart = function () {
            $state.go("home", {"page": "chart"}, {location: true, reload: true});
        };
    });

angular.module('demo').config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        events: true
    });
}]);