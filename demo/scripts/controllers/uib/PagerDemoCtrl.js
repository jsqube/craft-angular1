/**
 * Created by Ming on 2017/4/17.
 */
angular.module('ui.bootstrap.demo',[]).controller('PagerDemoCtrl', function($scope) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;
});