(function () {
    angular.module('PolarChartCtrl', [{
        name: "craft.chart",
        files: ["../dist/craft/exp/craft-chart.js"]
    }]).controller('PolarChartCtrl', ['$scope', function ($scope) {
        $scope.store = angular.extend({});

        $scope.store.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.store.data = [300, 500, 100, 40, 120];
        $scope.store.type = "polarArea";
        $scope.store.onClick = function () {

        };
    }]);
}).call(this);