(function () {
    angular.module('metadata', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put("meta/app-config.json",{
            RootPath:'http://localhost:9000',
            authTokenName:"JWT-TOKEN"
        });

        $templateCache.put("meta/app-module-config.json",{
            "chart": {
                "ctrl": "LineChartCtrl",
                "tpl": "chart/charts-template.html",
                "modules": [{name:"chart",
                    files: ['chart/chart.js']
                }]
            }
        });
    }]);
}).call(this);