(function () {
    angular.module('DoughnutChartCtrl', [{
        name: "craft.chart",
        files: ["../dist/craft/exp/craft-chart.js"]
    }]).controller('DoughnutChartCtrl', ['$scope', function ($scope) {
        $scope.store = angular.extend({});

        $scope.store.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.store.data = [300, 500, 100];
        $scope.store.type = "doughnut";
        $scope.store.onClick = function () {

        };
    }]);
}).call(this);