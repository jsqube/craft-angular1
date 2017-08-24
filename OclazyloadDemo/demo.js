/**
 * Created by Ming on 2017/2/24.
 */
angular.module("demo", ["ui.router", "oc.lazyLoad"])
    .config(function ($stateProvider) {
        $stateProvider
            .state('store', {
                // templateUrl: "store/store.html",
                templateProvider: ['$http', function ($http) {
                    console.log("1111111");
                    return $http.get("store/store.html").then(function (tpl) {
                        return tpl.data;
                    })
                }],

                // controller: "StoreCtrl as store",
                controllerProvider: function () {
                    console.log("2222222");
                    return "StoreCtrl as store"
                },
                resolve: {
                    store: ['$ocLazyLoad', function ($ocLazyLoad) {
                        console.log("333333");
                        return $ocLazyLoad.load(
                            {
                                name: "store",
                                files: ["store/store.js"]
                            }
                        )
                    }],
                    data: function (store) {
                        console.log("44444");
                        return 4444;
                    },
                    meta: function (store) {
                        console.log("55555");
                        return 5555;
                    }
                }
            })
            .state('chart', {
                // templateUrl: "store/store.html",
                templateProvider: ['$http', function ($http) {
                    return $http.get("chart/charts-template.html").then(function (tpl) {
                        return tpl.data;
                    })
                }],

                // controller: "StoreCtrl as store",
                controllerProvider: function () {
                    console.log("2222222");
                    return "LineChartCtrl"
                },
                resolve: {
                    chart: ['$ocLazyLoad', function ($ocLazyLoad) {
                        console.log("333333");
                        return $ocLazyLoad.load(
                            {
                                name: "chart",
                                files: ["../bower_components/chart.js/dist/Chart.js","chart/chart.js"]
                            }
                        )
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