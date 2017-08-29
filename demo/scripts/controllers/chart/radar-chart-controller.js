(function () {
    angular.module('RadarChartCtrl', [{
        name: "craft.chart",
        files: ["../dist/craft/exp/craft-chart.js"]
    }]).controller('RadarChartCtrl', ['$scope', function ($scope) {
        $scope.store = angular.extend({});

        $scope.store.labels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];
        $scope.store.data = [
            [65, 59, 90, 81, 56, 55, 40],
            [28, 48, 40, 19, 96, 27, 100]
        ];
        $scope.store.type = "radar";
        $scope.store.onClick = function () {

        };
    }]);
}).call(this);