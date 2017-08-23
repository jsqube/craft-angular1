/**
 * Created by Ming on 2017/4/6.
 */
(function () {
    angular.module("craft.widgets.listViewer", []).component("craftListViewer", {
        templateUrl: "templates/widgets/list-viewer.html",
        bindings: {
            data: '=',
            meta: '<',
            handlers: '<'
        },
        controller: ['$scope', '$filter', function ($scope, $filter) {
            var vm = this;
            vm.$onInit = function () {
                // console.log(vm.meta);
                // console.log(vm.handlers);
                vm.data = vm.handleData(vm.data);
                vm.pager = {
                    pageSizeOptions: [10, 20, 50, 100],
                    pageSize: 10,
                    totalItems: vm.data ? vm.data.length : 0,
                    filteredItemSize: function () {
                        if(typeof vm.filteredData !== "undefined" && vm.filteredData!==null)
                            return vm.filteredData.length;
                        else return 0;
                    },
                    currentPage: 1,
                    pageChanged: function () {
                        console.log("pageChanged");
                        console.log(this.currentPage);
                        if (typeof vm.filteredData !== "undefined" && vm.filteredData !== null) {
                            console.log(this.from(), this.to());
                            vm.displayData = vm.filteredData.slice(this.from(), this.to());
                        }
                    },
                    from: function () {
                        return (this.currentPage - 1) * this.pageSize;
                    },
                    to: function () {
                        if (this.currentPage * this.pageSize > this.filteredItemSize()) return this.filteredItemSize();
                        else return this.currentPage * this.pageSize;
                    }
                };

                vm.searchText = "";
                vm.orderColumn = null;
                vm.reverse=false;

                $scope.$watch("vm.searchText", function (newValue, oldValue, scope) {
                    if (newValue != null && newValue !== "") {
                        vm.filteredData = $filter('filter')(vm.data, newValue);
                    }
                });

                $scope.$watch("vm.filteredData", function (newValue, oldValue) {
                    vm.pager.pageChanged();
                });
                $scope.$watch("vm.pager.pageSize", function (newValue, oldValue) {
                    vm.pager.pageChanged();
                });

                $scope.$watch("vm.data", function (newValue, oldValue, scope) {
                    console.log(newValue, oldValue);
                    if (newValue != null) {
                        vm.pager.totalItems = newValue.length;
                    }
                    vm.filteredData = vm.data;
                });

            };
            vm.handleData = function (data) {
                if (vm.handlers.advise !== null) {
                    angular.forEach(data, function (item) {
                        vm.executeFunctionByName("advise", item);
                    });
                }
                return data;
            };
            vm.sort=function (column) {
                vm.orderColumn=column;
                vm.reverse=!vm.reverse;
            };
            vm.executeFunctionByName = function (str, args) {
                // console.log(args);
                var fn = vm.findFuncByName(str);
                // console.log(fn);
                // console.log(typeof args);
                if (typeof args === "undefined") {
                    fn.call(vm.handlers);
                } else if (Array.isArray(args) === true) {
                    fn.apply(vm.handlers, args);
                } else {
                    fn.call(vm.handlers, args);
                }
            };

            vm.findFuncByName = function (funcName) {
                var arr = funcName.split('.');
                // console.log(arr);
                var fn = vm.handlers[arr[0]];
                // console.log(fn);
                for (var i = 1; i < arr.length; i++) {
                    fn = fn[arr[i]];
                }
                // console.log(fn);
                return fn;
            };

            vm.showInLineButton = function (funName, item) {
                if (funName === undefined) return true;
                // var fn = vm.findFuncByName(funName);
                //console.log(fn);
                return vm.executeFunctionByName(funName, item);
            };
        }],
        controllerAs: 'vm'
    });

}).call(this);