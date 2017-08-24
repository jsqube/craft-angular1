(function () {
    "use strict";
    angular.module("craft.widgets.TreeSelect", []);
    angular.module("craft.widgets.TreeSelect").directive('craftTreeSelect',treeSelect);
    function treeSelect() {
        return {
            templateUrl: function (elements, attributes) {
                return attributes.templateUrl || 'templates/widgets/tree-select.html';
            },
            restrict: 'E',
            scope: {
                leftree: '=',
                righttree: '=',
                showcolumn: "@"
            },
            controller: function ($scope) {
                $scope.selectItems = [];
                $scope.removeItems = [];

                $scope.select = function (item) {
                    var index = $scope.selectItems.indexOf(item);

                    if (index < 0) {
                        $scope.selectItems.push(item);
                    }
                    else {
                        $scope.selectItems.splice(index, 1);
                    }
                };

                $scope.remove = function (item) {
                    var index = $scope.removeItems.indexOf(item);

                    if (index < 0) {
                        $scope.removeItems.push(item);
                    }
                    else {
                        $scope.removeItems.splice(index, 1);
                    }
                };

                $scope.leftSelect = function () {

                    if ($scope.removeItems === undefined || $scope.removeItems.length === 0 )
                        return;

                    for (var i=0 ; i<$scope.removeItems.length ; i++) {
                        var route = [];

                        //将node 从右边tree中移除，并记录route
                        treeArrayRemove($scope.righttree, $scope.removeItems[i], route);

                        //将node 根据route加入左边的tree
                        treeArrayAdd($scope.lefttree, $scope.removeItems[i], route);
                    }

                    $scope.selectItems = [];
                    $scope.removeItems = [];
                };

                $scope.rightSelect = function () {

                    if ($scope.selectItems === undefined || $scope.selectItems.length === 0 )
                        return;

                    for (var i = 0; i<$scope.selectItems.length ; i++) {
                        var route = [];

                        //将node 从左边tree中移除，并记录route
                        treeArrayRemove($scope.lefttree, $scope.selectItems[i], route);

                        //将node 根据route加入右边的tree
                        treeArrayAdd($scope.righttree, $scope.selectItems[i], route);

                    }

                    $scope.selectItems = [];
                    $scope.removeItems = [];
                };

                $scope.rightAll = function () {
                    $scope.selectItems = [];
                    $scope.removeItems = [];

                    //将左边的树合并到右边
                    combineTreeArray($scope.lefttree, $scope.righttree);
                    $scope.lefttree = [];
                };


                $scope.leftAll = function () {
                    $scope.selectItems = [];
                    $scope.removeItems= [];

                    //将右边的树合并到左边
                    combineTreeArray($scope.righttree, $scope.lefttree);
                    $scope.righttree = [];
                };

                var combineTreeArray = function (treeadd, originalTree) {
                    if (treeadd === undefined || treeadd === null)
                        return;
                    if (originalTree === undefined || originalTree === null)
                        return;

                    for (var i = 0; i < treeadd.length; i++) {
                        var treeroot = treeadd[i];
                        //将treeroot加入originalTree中
                        var find = false;
                        for (var j = 0; j < originalTree.length; j++) {
                            if (treeroot.id === originalTree[j].id) {
                                combineTreeArray(treeroot.children, originalTree[j].children);
                                find = true;
                                break;
                            }
                        }
                        if (!find) {
                            originalTree.push(treeroot);
                        }

                    }
                };

                var treeArrayRemove = function (treearray, node, route) {
                    //搜索每个tree array的元素，改元素本身是个tree
                    for (var i = 0; i < treearray.length; i++) {
                        var result = treeRemove(treearray[i], node, route);
                        if (result) {
                            //判断是否需要删除children
                            if (treearray[i].children.length === 0) {
                                treearray.splice(i, 1);
                            }
                            return true;
                        }
                    }
                };

                var treeArrayAdd = function (treearray, node, route) {
                    var topNode = route.pop();

                    //搜索每个tree array的元素，看是否已有route中的第一个node
                    for (var i = 0; i < treearray.length; i++) {
                        if (treearray[i].id === topNode.id) {
                            treeAdd(treearray[i], node, route);
                            return;
                        }
                    }

                    //都没有的情况下增加新的父节点
                    var tree = angular.copy(topNode);
                    tree.children = [];
                    treearray.push(tree);
                    treeAdd(tree, node, route);
                };

                var treeAdd = function (tree, node, route) {
                    if (route.length === 0) {
                        tree.children.push(node);
                        return;
                    }

                    //继续根据parentNode向下走
                    var parentNode = route.pop();

                    for (var i = 0; i < tree.children.length; i++) {
                        if (tree.children[i].id === parentNode.id) {
                            treeAdd(tree.children[i], node, route);
                            return;
                        }
                    }

                    //都没有的情况下增加
                    var newtreeNode = angular.copy(parentNode);
                    newtreeNode.children = [];
                    tree.children.push(newtreeNode);
                    treeAdd(newtreeNode, node, route);
                };

                var treeRemove = function (tree, node, route) {
                    //查找每个children
                    if (tree.children === undefined)
                        return false;

                    for (var i = 0; i < tree.children.length; i++) {
                        //当前children中找到了
                        if (tree.children[i].id === node.id) {
                            //从children中移除该node
                            tree.children.splice(i, 1);

                            //记录下route
                            route.push(tree);
                            return true;
                        }

                        //如果该child非子节点，继续递归查找
                        if (tree.children[i].children !== undefined) {
                            var result = treeRemove(tree.children[i], node, route);
                            //判断是否需要删除children
                            if(result&&tree.children[i].children.length === 0){
                                tree.children.splice(i, 1);
                            }
                            if (result) {
                                route.push(tree);
                                return true;
                            }
                            return false;
                        }
                    }

                    return false;
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