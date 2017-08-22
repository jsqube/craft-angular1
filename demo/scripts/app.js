(function () {
    angular.module('demo', ['craft.core','craft.api','metadata']);
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
                    store: function ($craftLazyLoad) {
                        return $craftLazyLoad.load(
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


    angular.module('demo').controller('SettingsCtrl', function ($state,$scope, $rootScope, SettingService, $http, $location, JwtAuthService) {
        $scope.settings = SettingService;

        $scope.$watch('settings.ace.settings.compact', function (newValue) {
            if (newValue === true) {
                //if sidebar is compact, it should be in 'hover' mode as well
                $scope.settings.ace.settings.hover = true;
            }
        });

        //viewContentLoading is used in angular/views/index.html to show/hide content and progress bar (spinner icon) when loading new pages
        $rootScope.viewContentLoading = false;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            //cfpLoadingBar.start();
            $rootScope.viewContentLoading = true;
            //also hide sidebar in mobile view when navigating to a new state
            $scope.settings.ace.sidebar.toggle = false;

            if (toState.name.indexOf('login') > -1 || JwtAuthService.isLoggedIn()) {
                return
            }

            if (!JwtAuthService.isLoggedIn()) {
                event.preventDefault();
                $state.go('auth.login', {location: true, reload: true});
            }
        });
        $rootScope.$on('$stateChangeSuccess', function (event) {
            //cfpLoadingBar.complete();
            $rootScope.viewContentLoading = false;
        });
        $rootScope.$on('$stateChangeError', function (event, p1, p2, p3) {
            //cfpLoadingBar.complete();
            $rootScope.viewContentLoading = false;
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

    angular.module('demo').controller('UserProfileCtrl',function ($scope,HttpService,ConfigService, TokenService,$state) {
        $scope.login=function () {
            console.log("login",$scope.user);
            HttpService.post(ConfigService.getAppConfig().RootPath+'/auth',$scope.user).then(function (data) {
                console.log(data);
                TokenService.saveToken(Constants.authTokenName,data.token);
                $state.go('home.default');
            },function (error) {
                console.log(error)
            });

        };

        $scope.isLoggedIn = function () {
            var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
            if (token) {
                var payload = JSON.parse(atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        $scope.currentUser = function () {
            if (this.isLoggedIn()) {
                var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
                var payload = JSON.parse(atob(token.split('.')[1]));
                // console.log(payload);
                // console.log( JSON.parse(atob(token.split('.')[0])));
                // console.log( token.split('.')[2]);
                return {
                    email: payload.email,
                    name: payload.sub
                };
            }
        };
        $scope.logout = function () {
            console.log("logout");
            TokenService.removeToken(ConfigService.getAppConfig().authTokenName);
            $state.go('auth.login', {location: true, reload: true});
        };
    });

    /**
     * ========================================================================
     * TokenService
     * ========================================================================
     */
    angular.module('demo').factory('TokenService', ['CraftStorageService', function (CraftStorageService) {
        return {
            saveToken: function (name, token) {
                CraftStorageService.set(name, token);
            },
            getToken: function (name) {
                return CraftStorageService.get(name);
            },
            removeToken: function (name) {
                CraftStorageService.remove(name);
            }
        };
    }]);



    /**
     * ========================================================================
     * FileDownloadService
     * ========================================================================
     */
    angular.module('demo').factory('DownloadService', DownloadServiceFun);

    DownloadServiceFun.$inject=[];
    function DownloadServiceFun(){
        var downloadService = angular.extend({});
        downloadService.strMimeType = 'application/octet-stream;charset=utf-8';
        downloadService.setMimeType = function (mimeType) {
            this.strMimeType = mimeType;
        };

        downloadService.isIE = function () {
            var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
            return match ? parseInt(match[1]) : false;
        };
        downloadService.isSafari = function () {
            var match = navigator.userAgent.match('(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/');
            return match ? parseInt(match[2]) : false;
        };
        downloadService.downloadFile = function (fileName, content) {
            var D = document;
            var a = D.createElement('a');
            var rawFile;
            var ieVersion;

            ieVersion = this.isIE();
            if (ieVersion && ieVersion < 10) {
                var frame = D.createElement('iframe');
                document.body.appendChild(frame);

                frame.contentWindow.document.open("text/html", "replace");
                frame.contentWindow.document.write('sep=,\r\n' + content);
                frame.contentWindow.document.close();
                frame.contentWindow.focus();
                frame.contentWindow.document.execCommand('SaveAs', true, fileName);

                document.body.removeChild(frame);
                return true;
            }

            // IE10+
            if (navigator.msSaveBlob) {
                return navigator.msSaveBlob(
                    new Blob([content], {
                        type: this.strMimeType
                    }),
                    fileName
                );
            }

            //html5 A[download]
            if ('download' in a) {
                var blob = new Blob(
                    [content], {
                        type: this.strMimeType
                    }
                );
                rawFile = URL.createObjectURL(blob);
                a.setAttribute('download', fileName);
            } else {
                rawFile = 'data:' + this.strMimeType + ',' + encodeURIComponent(content);
                a.setAttribute('target', '_blank');
            }

            a.href = rawFile;
            a.setAttribute('style', 'display:none;');
            D.body.appendChild(a);
            setTimeout(function () {
                if (a.click) {
                    a.click();
                    // Workaround for Safari 5
                } else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                }
                D.body.removeChild(a);
            }, this.delay);
        };

        return downloadService;
    }

    /**
     * ========================================================================
     * JwtAuthService
     * ========================================================================
     */
    angular.module('demo').factory('JwtAuthService', JwtAuthServiceFun);
    JwtAuthServiceFun.$inject=['TokenService', 'ConfigService', '$q', '$http'];
    function JwtAuthServiceFun(TokenService, ConfigService, $q, $http) {
        var authService = angular.extend({});
        authService.isLoggedIn = function () {
            var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
            if (token) {
                var payload = JSON.parse(atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        authService.currentUser = function () {
            if (this.isLoggedIn()) {
                var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
                var payload = JSON.parse(atob(token.split('.')[1]));
                //console.log(payload);
                //console.log( JSON.parse(atob(token.split('.')[0])));
                //console.log( token.split('.')[2]);
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };
        authService.logout = function () {
            TokenService.removeToken(ConfigService.getAppConfig().authTokenName);
        };
        authService.logon = function (username, password, verifyCode) {
            var deferred = $q.defer();

            var user = {"username": username, "password": password, "verifyCode": verifyCode};
            $http.post(ConfigService.getAppConfig().RootPath + '/logon', JSON.stringify(user))
                .then(function (data) {
                    console.log(data);
                    TokenService.saveToken(ConfigService.getAppConfig().authTokenName, data);
                    //TokenService.removeToken(ConfigService.getAppConfig().loginTokenName);
                    //$state.go('home');
                    deferred.resolve("logon success");
                }, function (data) {
                    console.log(data);
                    // authService.getVerifyImgUrl();
                    //$scope.imgClicked();
                    deferred.reject("logon failed");
                });
            return deferred.promise;
        };
        // authService.getVerifyImgUrl = function () {
        //     return ConfigService.getRootPath() + "/kaptcha.jpg?" + Math.floor(Math.random() * 100);
        // };
        return authService;
    }

    /**
     * ========================================================================
     * JwtTokenInterceptor
     * ========================================================================
     */

    angular.module('demo').factory('JwtTokenInterceptor', JwtTokenInterceptor);
    JwtTokenInterceptor.$inject = [ 'TokenService', 'ConfigService'];
    function JwtTokenInterceptor(TokenService, ConfigService) {
        return {
            request: function (config) {
                var tokenValue = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
                if (tokenValue) {
                    config.headers=config.headers||{};
                    config.headers['Authorization'] = tokenValue;
                }
                return config;
            }
        };
    }

    angular.module('demo').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('JwtTokenInterceptor');
    }]);

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
            $state.go("home.edit", {"docName":BaseHandler.getDocName(),"action":"detail"}, {location: true, reload: true});
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

}).call(this);