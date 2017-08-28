angular.module('chartDemo', [{
    name: "chart.js",
    files: ["../src/scripts/chart/craft-chart.js"]
}]);
angular.module('chartDemo')
    .config(['ChartJsProvider', function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            chartColors: ['#FF5252', '#FF8A80'],
            responsive: false
        });
        // Configure all line charts
        ChartJsProvider.setOptions('line', {
            showLines: true
        });
    }])
    .controller('LineChartCtrl', ['$scope', function ($scope) {
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