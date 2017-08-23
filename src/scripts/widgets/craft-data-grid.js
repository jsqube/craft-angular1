/**
 * Created by Ming on 2017/4/6.
 */
(function () {
    angular.module("craft.widgets.dataGrid", []).component("craftDataGrid", {
        templateUrl: "templates/widgets/data-grid.html",
        bindings: {
            data: '<',
            meta: '<',
            handlers: '<'
        },
        controller: ['$scope','$filter','CrudService', function ($scope,$filter,CrudService) {
            var vm = this;
            vm.$onInit = function () {
                // console.log(vm.meta);
                // console.log(vm.handlers);

                vm.allSelected=false;
                // vm.data=vm.handleData(vm.data);
                //pagination & filter
                vm.pager = {
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50, 100],
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

                vm.meta.columns=vm.meta.columns.map(function (column) {
                    column.active=true;
                    return column;
                });

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
            vm.sort=function (column) {
                vm.orderColumn=column;
                vm.reverse=!vm.reverse;
            };

            vm.handleData = function (data) {
                if (vm.handlers.advise !== null) {
                    angular.forEach(data, function (item) {
                        vm.executeFunctionByName("advise", item);
                    });
                }
                return data;
            };
            vm.executeFunctionByName = function (str) {
                var args=[];
                var argsCount=arguments.length;
                for (var i = 1; i < argsCount; i++) {
                    args.push(arguments[i]);
                }

                var fn = vm.findFuncByName(str);
                fn.apply(vm.handlers, args);

                // console.log(fn);
                // console.log(typeof args);
                // if (typeof args === "undefined") {
                //     fn.call(vm.handlers);
                // } else if (Array.isArray(args)===true) {
                //     fn.apply(vm.handlers, args);
                // } else {
                //     fn.call(vm.handlers, args);
                // }
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

            vm.showInLineButton=function (funName,item) {
                if (funName === undefined) return true;
                // var fn = vm.findFuncByName(funName);
                //console.log(fn);
                return vm.executeFunctionByName(funName,item);
            };

            vm.toggleColumns=function (column) {
                column.active=!column.active;
            };
            vm.toggleColumnMenu=function () {
                vm.showColumnMenu=!vm.showColumnMenu;
            };

            vm.selectAllItems=function () {
                // console.log(vm.allSelected);
                vm.allSelected=!vm.allSelected;
                vm.data.forEach(function (item) {
                    item.checked=vm.allSelected;
                });
            };

        }],
        controllerAs: 'vm'
    });


    angular.module("craft.widgets.dataGrid").directive("checkboxModel", ["$compile", function ($compile) {
        return {
            restrict: "A",
            link: function (scope, ele, attrs) {
                // Defining updateSelection function on the parent scope
                if (!scope.$parent.updateSelections) {
                    // Using splice and push methods to make use of
                    // the same "selections" object passed by reference to the
                    // addOrRemove function as using "selections = []"
                    // creates a new object within the scope of the
                    // function which doesn't help in two way binding.
                    scope.$parent.updateSelections = function (selectedItems, item, isMultiple) {
                        var itemIndex = selectedItems.indexOf(item);
                        var isPresent = (itemIndex > -1);
                        if (isMultiple) {
                            if (isPresent) {
                                selectedItems.splice(itemIndex, 1);
                            } else {
                                selectedItems.push(item);
                            }
                        } else {
                            if (isPresent) {
                                selectedItems.splice(0, 1);
                            } else {
                                selectedItems.splice(0, 1, item);
                            }
                        }
                    };
                }

                // Adding or removing attributes
                ele.attr("ng-checked", attrs.checkboxModel + ".indexOf(" + attrs.checkboxValue + ") > -1");
                var multiple = attrs.multiple ? "true" : "false";
                ele.attr("ng-click", "updateSelections(" + [attrs.checkboxModel, attrs.checkboxValue, multiple].join(",") + ")");
                ele.attr("ng-change", "updateSelections(" + [attrs.checkboxModel, attrs.checkboxValue, multiple].join(",") + ")");
                // Removing the checkbox-model attribute,
                // it will avoid recompiling the element infinitly
                ele.removeAttr("checkbox-model");
                ele.removeAttr("checkbox-value");
                ele.removeAttr("multiple");

                $compile(ele)(scope);
            }
        };
    }]);


}).call(this);