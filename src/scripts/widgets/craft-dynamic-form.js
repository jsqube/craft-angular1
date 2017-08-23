(function () {
    angular.module('craft.widgets.dynamicForm', []).component('craftDynamicForm', {
        templateUrl: "templates/widgets/dynamic-form.html",
        bindings:{
            meta:'<',
            currentItem:'<',
            handlers:'<',
            edit:'<'
        },
        controller:['$scope',function ($scope) {
            var vm=this;
            vm.$onInit=function () {
                $scope.$watchCollection("vm.currentItem",function (newVal, oldVal, scope) {
                    console.log(newVal);
                    if(vm.handlers.hasOwnProperty("itemChanged")){
                        var fn = vm.findFuncByName("itemChanged");
                        fn.call(vm.handlers, newVal);
                    }
                });
            };
            vm.$onChanges=function (changesObj) {
                console.log(changesObj);
            };

            vm.hideLogic=function (funcName) {
                // console.log(funcName);
                if(typeof funcName==="undefined" || funcName===null) return false;

                if(vm.handlers.hasOwnProperty(funcName)){
                    var fn = vm.findFuncByName(funcName);
                    var value= fn.call(vm.handlers, vm.currentItem);
                    // console.log(value);
                    return value;
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
            vm.executeFunctionByName = function (str, args) {
                // console.log(args);
                var fn = vm.findFuncByName(str);
                // console.log(fn);
                // console.log(typeof args);
                if (typeof args === "undefined") {
                    fn.call(vm.handlers);
                } else if (Array.isArray(args)===true) {
                    fn.apply(vm.handlers, args);
                } else {
                    fn.call(vm.handlers, args);
                }
            };
        }],
        controllerAs:'vm'
    });
}).call(this);