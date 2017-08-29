(function () {
    angular.module('LineChartCtrl', [{
        name: "craft.chart",
        files: ["../dist/craft/exp/craft-chart.js"]
    }]).controller('LineChartCtrl', ['$scope', function ($scope) {
        $scope.store = angular.extend({});

        $scope.store.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.store.series = ["Series A", "Series B"];
        $scope.store.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.store.type = "line";
        $scope.store.onClick = function () {

        };
    }]);
}).call(this);