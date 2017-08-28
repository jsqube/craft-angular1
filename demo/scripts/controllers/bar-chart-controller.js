(function () {
    angular.module('BarChartCtrl', [{
        name: "craft.chart",
        files: ["../dist/craft/exp/craft-chart.js"]
    }]).controller('BarChartCtrl', ['$scope', function ($scope) {
            $scope.store = angular.extend({});

            $scope.store.labels = ["2006", "2007", "2008", "2009", "2010", "2011", "2012"];
            $scope.store.series = ["Series A", "Series B"];
            $scope.store.data = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90]
            ];
            $scope.store.type = "bar";
            $scope.store.onClick = function () {

            };
        }]);
}).call(this);