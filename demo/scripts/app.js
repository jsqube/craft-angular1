(function () {
    angular.module('demo', ['craft.core','craft.api.rest','craft.auth.jwt','metadata','craft.widgets']);

    angular.module('demo').config(['$ocLazyLoadProvider',function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true
        });
    }]);

    angular.module('demo').config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "views/home.html",
                abstract: true
            })
            .state("home.default", {
                url: "/default",
                templateUrl: "views/default.html"
            })

            .state("home.list", {
                url: "/{docName}/{action}",
                templateProvider: ['$stateParams','$templateCache','$http',function ($stateParams,$templateCache,$http) {
                    var appConfig= $templateCache.get('meta/app-module-config.json');
                    console.log(appConfig);
                    var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                    console.log("template file=",config.tpl);
                    return $http.get(config.tpl).then(function (tpl) {
                        return tpl.data;
                    })
                }],

                controllerProvider: ['$stateParams','$templateCache', function ($stateParams, $templateCache) {
                    var appConfig= $templateCache.get('meta/app-module-config.json');
                    var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                    console.log("route is: /form/{}/{}", $stateParams.docName,$stateParams.action);
                    console.log("route config controller: {1}", config);
                    return config.ctrl;
                }],
                resolve: {
                    listComponents: ['$ocLazyLoad','$templateCache', '$stateParams',function ($ocLazyLoad,$templateCache, $stateParams) {
                        var appConfig= $templateCache.get('meta/app-module-config.json');
                        console.log(appConfig);
                        var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                        console.log("template modules=",config.modules);
                        return $ocLazyLoad.load(config.modules);
                    }],
                    data: ['CrudService', '$stateParams', '$q','$templateCache','listComponents',function (CrudService, $stateParams, $q,$templateCache,listComponents) {
                        console.log($stateParams.docName);
                        var appConfig= $templateCache.get('meta/app-module-config.json');
                        console.log(appConfig);
                        var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                        console.log(config.repo);
                        var deferred = $q.defer();
                        CrudService.list(config.repo).then(function (data) {
                            console.log(data);
                            var result = data["content"];
                            console.log(result);
                            deferred.resolve(result);
                        }, function (msg) {
                            console.log(msg);
                            deferred.resolve([]);
                        });
                        return deferred.promise;
                    }],
                    meta: ['$templateCache', '$stateParams','listComponents',function ($templateCache, $stateParams,listComponents) {
                        console.log($stateParams.docName);
                        var metadata = $templateCache.get("meta/" + $stateParams.docName + '-' + $stateParams.action+".json");
                        console.log(metadata);
                        return metadata;
                    }]

                }
            })

            .state('home.edit', {
                url: "/form/{docName}/{action}/{id}",
                templateProvider: ['$stateParams','$templateCache','$http',function ($stateParams,$templateCache,$http) {
                    var appConfig= $templateCache.get('meta/app-module-config.json');
                    console.log(appConfig);
                    var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                    console.log("template file=",config.tpl);
                    return $http.get(config.tpl).then(function (tpl) {
                        return tpl.data;
                    })
                }],
                controllerProvider: ['$stateParams', '$templateCache', function ($stateParams, $templateCache) {
                    var appConfig= $templateCache.get('meta/app-module-config.json');
                    console.log(appConfig);
                    var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                    console.log("controller=",config.ctrl);
                    return config.ctrl;
                }],
                resolve: {
                    formComponents: function ($ocLazyLoad, $stateParams,$templateCache) {
                        var appConfig= $templateCache.get('meta/app-module-config.json');
                        var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                        return $ocLazyLoad.load(config.modules);
                    },
                    data: function (CrudService, $stateParams, formComponents,$templateCache) {
                        // console.log($stateParams.docName);
                        var appConfig= $templateCache.get('meta/app-module-config.json');
                        var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
                        if ($stateParams.id) {
                            var data = CrudService.find(config.repo, $stateParams.id);
                            console.log(data);
                            return data;
                        } else {
                            return new Object();
                        }
                    },
                    meta: function ($templateCache, $stateParams, formComponents) {
                        console.log($stateParams.docName);
                        var metadata = $templateCache.get("meta/" + $stateParams.docName + '-' + $stateParams.action+".json");
                        console.log(metadata);
                        return metadata;
                    },
                    editFlag: function ($stateParams) {
                        console.log($stateParams.id);
                        if ($stateParams.id)
                            return true;
                        else
                            return false;
                    }
                }
            })


            .state("home.chart", {
                url: "/{docName}",
                templateProvider: ['$stateParams','$templateCache','$http',function ($stateParams,$templateCache,$http) {
                    var appConfig= $templateCache.get('meta/app-module-config.json');
                    console.log(appConfig);
                    var config=appConfig[$stateParams.docName + '-chart'];
                    console.log("template file=",config.tpl);
                    return $http.get(config.tpl).then(function (tpl) {
                        return tpl.data;
                    })
                }],

                controllerProvider: ['$stateParams','$templateCache', function ($stateParams, $templateCache) {
                    var appConfig= $templateCache.get('meta/app-module-config.json');
                    var config=appConfig[$stateParams.docName + '-chart'];
                    console.log("route is: /form/{}/{}", $stateParams.docName,$stateParams.action);
                    console.log("route config controller: {1}", config);
                    return config.ctrl;
                }],
                resolve: {
                    chartComponents: ['$ocLazyLoad','$templateCache', '$stateParams',function ($ocLazyLoad,$templateCache, $stateParams) {
                        var appConfig= $templateCache.get('meta/app-module-config.json');
                        console.log(appConfig);
                        var config=appConfig[$stateParams.docName + '-chart'];
                        console.log("template modules=",config.modules);
                        return $ocLazyLoad.load(config.modules);
                    }]

                }
            })

            .state('home.uib', {
                url: "/component/uib/{docName}",
                templateUrl: function ($stateParams) {
                    return "views/uib/" + $stateParams.docName + "Demo.html"
                },
                controllerProvider: ['$stateParams', function ($stateParams) {
                    console.log($stateParams.docName);
                    var upperFist = function (name) {
                        return name.charAt(0).toUpperCase() + name.substring(1);
                    };
                    return upperFist($stateParams.docName) + "DemoCtrl";
                }],
                resolve: {
                    formComponents: function ($ocLazyLoad, $stateParams,$templateCache) {
                        var appConfig= $templateCache.get('meta/app-module-config.json');
                        return $ocLazyLoad.load([{
                            name: "ui.bootstrap.demo",
                            files: appConfig['uib-modules'][$stateParams.docName].files
                        }]);
                    }
                }
            })
            .state("auth", {
                url: "/auth",
                templateUrl: "views/auth/auth.html",
                abstract: true
            })
            .state("auth.login", {
                url: "/login",
                templateUrl: "views/auth/login-box.html",
                controllerProvider: [function () {
                    return "AuthCtrl as vm"
                }],
                resolve: {
                    store: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: "AuthCtrl",
                                files: ["scripts/controllers/auth-controller.js"]
                            }
                        )
                    }
                }
            })
            .state("auth.forget", {
                url: "/forget",
                templateUrl: "views/auth/forget-box.html",
            })
            .state("auth.signup", {
                url: "/signup",
                templateUrl: "views/auth/signup-box.html",
            });


        $urlRouterProvider.otherwise('/home/default');
    });

    angular.module('demo').factory('SettingService', ['$http', function ($http) {
        var vm = angular.extend({});

        vm.ace = {};
        vm.ace.settings = vm.ace.settings || {};

        vm.ace.settings = {
            'is_open': false,
            'navbar': false,
            'sidebar': false,
            'breadcrumbs': false,
            'hover': false,
            'compact': false,
            'highlight': false,
            'rtl': false,
            'skinColor': '#438EB9',
            'skinIndex': 0
        };

        vm.ace.path = {
            'assets': 'assets' //used in page templates when linking to images, etc
        };

        vm.ace.site = {
            brand_text: 'Ace Admin',
            brand_icon: 'fa fa-leaf',
            version: '1.4'
        };

        //sidebar variables
        vm.ace.sidebar = {
            'minimized': false,//used to collapse/expand
            'toggle': false,//used to toggle in/out mobile menu
            'reset': false//used to reset sidebar (for sidebar scrollbars, etc)
        };

        vm.bodySkin = function () {
            var skin = vm.ace.settings.skinIndex;
            // var skin = 2;
            if (skin == 1 || skin == 2) return 'skin-' + skin;
            else if (skin == 3) return 'no-skin skin-3';
            return 'no-skin';
        };

        vm.test = function () {
            console.log("test");
        };


        vm.open = function () {
            console.log("test");
            vm.ace.settings.is_open = !vm.ace.settings.is_open;
            console.log(vm.ace.settings.is_open);

        };
        vm.isOpen = function () {
            return vm.ace.settings.is_open;
        };

        vm.toggleSidebarMimimize = function () {
            vm.ace.sidebar.minimized = !vm.ace.sidebar.minimized;
        };

        return vm;
    }]);


    angular.module('demo').controller('SettingsCtrl', function ($state,$scope, $rootScope, SettingService, $http, $location) {
        $scope.settings = SettingService;

        $scope.$watch('settings.ace.settings.compact', function (newValue) {
            if (newValue === true) {
                //if sidebar is compact, it should be in 'hover' mode as well
                $scope.settings.ace.settings.hover = true;
            }
        });



        $rootScope.appData = $rootScope.appData || {};
        $rootScope.appDataRequest = {};
        $rootScope.getData = function (dataName, type) {
            var type = type || 'page';
            var dataKey = null, dataPath = null;
            if (type == 'page') {
                var pageName = $location.path().match(/([\-a-z]+)$/)[0];
                dataKey = 'page-' + pageName + '-' + dataName;
                dataPath = 'data/pages/' + pageName + '/' + dataName + '.json';
            }
            else {
                dataKey = type + '-' + dataName;
                dataPath = 'data/' + type + '/' + dataName + '.json';
            }

            if (!dataPath) return;
            if (dataKey in $rootScope.appData) return $rootScope.appData[dataKey];

            if (!(dataKey in $rootScope.appData) && !(dataKey in $rootScope.appDataRequest)) {
                $rootScope.appDataRequest[dataKey] = true;

                $http.get(dataPath).success(function (data) {
                    $rootScope.appData[dataKey] = data;
                });
            }
        };
        $rootScope.getCommonData = function (dataName) {
            return $rootScope.getData(dataName, 'common');
        };


        $scope.toggleMenuDisplay = function () {
            $scope.settings.ace.sidebar.toggle = !$scope.settings.ace.sidebar.toggle;
        }
    });



    /**
     * ========================================================================
     * BaseHandler
     * ========================================================================
     */
    angular.module('demo').factory('BaseHandler', BaseHandlerFunc);
    BaseHandlerFunc.$inject = ['$state','$filter','CrudService'];
    function BaseHandlerFunc($state,$filter,CrudService) {
        var BaseHandler = angular.extend({});
        BaseHandler.query = function (number1, num2, num3) {
            console.log("query", number1, num2, num3);
        };
        BaseHandler.new = function (obj) {
            console.log("new", obj,BaseHandler.getDocName());
            $state.go("home.edit", {"docName":BaseHandler.getDocName(),"action":"detail","id":null}, {location: true, reload: true});
        };
        BaseHandler.edit = function (item) {
            $state.go("home.edit", {"docName": BaseHandler.getDocName(),"action":"detail", "id": item.id}, {location: true, reload: false});
        };
        BaseHandler.advise = function (item) {
            return item;
        };
        BaseHandler.delete = function (item) {
            CrudService.delete(BaseHandler.getRepoName(), item.id).then(function (data) {
                $state.go("home.list", {"docName": BaseHandler.getDocName(),"action":"list"}, {location: true, reload: true});
            }, function (msg) {
                console.log(msg);
            })
        };

        BaseHandler.save= function (item, editFlag) {
            console.log("submit", item);
            if (editFlag){
                CrudService.update(BaseHandler.getRepoName(), item.id, item).then(function (data) {
                    console.log(data);
                    $state.go("home.list", {"docName": BaseHandler.getDocName(),"action":"list"}, {location: true, reload: true});
                }, function (msg) {
                    console.log(msg);
                });
            }
            else{
                CrudService.create(BaseHandler.getRepoName(), item).then(function (data) {
                    console.log(data);
                    $state.go("home.list", {"docName": BaseHandler.getDocName(),"action":"list"}, {location: true, reload: true});
                }, function (msg) {
                    console.log(msg);
                });
            }

        };
        BaseHandler.cancel= function () {
            $state.go("home.list", {"docName": BaseHandler.getDocName(),"action":"list"}, {location: true, reload: false});
        };

        BaseHandler.handleName = function (name) {
            console.log(name.split('-').map(BaseHandler.upperFist));
            return name.split('-').map(BaseHandler.upperFist).join("");
        };

        BaseHandler.upperFist=function (name) {
            return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
        };

        BaseHandler.getCtrlName=function (docName) {
            return BaseHandler.handleName(docName)+ "Ctrl";
        };
        BaseHandler.getRepoName=function (docName) {
            return BaseHandler.handleName(docName)+ "Repo";
        };

        BaseHandler.getDocName=function () {

        };
        BaseHandler.getRepoName=function () {

        };


        return BaseHandler;
    }


    angular.module('demo').directive('aceColorpicker', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                ngModel: '=?',
                ngValue: '=?',
                options: '=?',
                colors: '=?',
                addNew: '=?'
            },

            template: '<div uib-dropdown class="dropdown-colorpicker">' +
            '<a href="" uib-dropdown-toggle><span class="btn-colorpicker" ng-style="{\'background-color\': selectedColor}"></span></a>' +
            '<ul uib-dropdown-menu aria-labelledby="colorpicker-dropdown" ng-class="{\'dropdown-menu-right\': options.pull_right, \'dropdown-caret\': options.caret}">' +
            '<li ng-repeat="color in sourceColors">' +
            '<a href="" ng-click="selectColor(color.color)" ng-class="{\'colorpick-btn\': true , \'selected\': color.selected}" ng-style="{\'background-color\': color.color}"></a>' +
            '</li>' +
            '</ul>' +
            '</div>',
            link: function ($scope, element, attributes) {

                $scope.addNew = $scope.addNew || false;//if ngModel is assigned a new value, should we add it to our list or not?
                $scope.sourceColors = {};
                $scope.options = angular.extend({'caret': true}, $scope.options);

                var selectedColor = false;
                $scope.selectedColor = false;

                //list of colors
                //we convert it to an object like {'#FF0000': {color: '#FFFF00', value: 'redValue', selected: false} , ... }
                $scope.$watch('colors', function (newValue) {
                    var isObj = false;
                    var sourceColors = $scope.colors || [];

                    if (angular.isArray(sourceColors)) isObj = false;
                    else if (angular.isObject(sourceColors)) isObj = true;
                    else return;

                    $scope.sourceColors = {};
                    angular.forEach(sourceColors, function (value, index) {
                        if (isObj) {
                            //index is color name, value is some value
                            $scope.sourceColors[index] = {'color': index, 'value': value, 'selected': false};
                        }
                        else {
                            if (angular.isObject(value)) {
                                //value is an object {color: red, value: something}
                                $scope.sourceColors[value.color] = {
                                    'color': value.color,
                                    'value': value.value,
                                    'selected': false
                                };
                            }
                            else {
                                //value is a string (color)
                                $scope.sourceColors[value] = {'color': value, 'value': value, 'selected': false};
                            }
                        }
                    });
                });

                //gets called when a color is selected
                $scope.selectColor = function (color) {
                    $scope.ngModel = color;
                }
                return $scope.$watch('ngModel', function (newValue) {
                    if (!newValue) return;

                    var newColor;
                    if (angular.isObject(newValue) && ('color' in newValue)) newColor = newValue.color;
                    else if (angular.isString(newValue)) newColor = newValue;
                    else return;

                    //if we already have the color
                    if ($scope.sourceColors.hasOwnProperty(newColor)) {
                        if (selectedColor) $scope.sourceColors[selectedColor].selected = false;
                        $scope.sourceColors[newColor].selected = true;
                        selectedColor = newColor;
                    }
                    //if we don't have the new color let's add it
                    else if ($scope.addNew) {
                        if (selectedColor) $scope.sourceColors[selectedColor].selected = false;

                        if (angular.isObject(newValue) && ('color' in newValue)) {
                            $scope.sourceColors[newColor] =
                                {
                                    'color': newColor,
                                    'value': ('value' in newValue) ? newValue.value : newColor,
                                    'selected': true
                                };
                            $scope.ngModel = selectedColor = newColor;//ngModel shouldn't be an object
                        }
                        else if (angular.isString(newValue)) {
                            $scope.sourceColors[newColor] = {'color': newColor, 'value': newColor, 'selected': true};
                            selectedColor = newColor;
                        }
                    }

                    $scope.selectedColor = selectedColor;
                    $scope.ngValue = newValue in $scope.sourceColors ? $scope.sourceColors[newColor].value : '';
                });
            }
        };
    });

}).call(this);