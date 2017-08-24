(function () {
    "use strict";

    angular.module("craft.widgets.MultiSelect", []);
    angular.module("craft.widgets.MultiSelect")
        .directive('craftMultiSelect',[multiSelect]);

    function multiSelect() {
        return {
            templateUrl: function (elements, attributes) {
                return attributes.templateUrl || 'templates/component/multi-select-module.html';
            },
            restrict: 'E',
            scope: {
                leftoptions: '=',
                rightoptions: '=',
                showcolumn: "@"
            },
            controller: function ($scope) {
                var leftSelect = [];
                var rightSelect = [];

                $scope.selectItem = function (item) {
                    leftSelect = [];
                    rightSelect = [];
                    leftSelect.push(item);
                };

                $scope.removeItem = function (item) {
                    leftSelect = [];
                    rightSelect = [];
                    rightSelect.push(item);
                };

                $scope.rightSelect = function () {
                    //remove left
                    removeArray($scope.leftoptions, leftSelect);

                    //add right
                    addArray($scope.rightoptions, leftSelect);
                    leftSelect = [];
                    rightSelect = [];
                };

                $scope.leftSelect = function () {
                    //remove left
                    removeArray($scope.rightoptions, rightSelect);

                    //add right
                    addArray($scope.leftoptions, rightSelect);
                    leftSelect = [];
                    rightSelect = [];
                };

                $scope.rightAll = function () {
                    leftSelect = [];
                    rightSelect = [];
                    addArray($scope.rightoptions, $scope.leftoptions);
                    $scope.leftoptions = [];
                };
                $scope.leftAll = function () {
                    leftSelect = [];
                    rightSelect = [];
                    addArray($scope.leftoptions, $scope.rightoptions);
                    $scope.rightoptions = [];
                };

                var removeArray = function (array1, array2) {
                    for (var i = 0; i < array2.length; i++) {
                        var index = array1.indexOf(array2[i]);
                        if (index < 0)
                            continue;
                        array1.splice(index, 1);
                    }
                };

                var addArray = function (array1, array2) {
                    for (var i = 0; i < array2.length; i++) {
                        array1.push(array2[i]);
                    }
                };

                $scope.show = function (item) {
                    if ($scope.showcolumn === undefined || $scope.showcolumn === null)
                        return item;
                    return item[$scope.showcolumn];
                };
            },
            link: function (scope, element, attr) {
            }
        };
    }

}).call(this);