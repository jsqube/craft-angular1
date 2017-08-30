/**
 * Created by irving on 2017/8/29.
 */
(function(){
    "use strict";
    angular.module('craft.auth.AuthService', ['craft.api.cap']);

    angular.module('craft.auth.AuthService').factory('SessionAuthService', AuthServiceFun);
    AuthServiceFun.$inject = ['UserStorage', '$q', 'ConfigService', 'CrudService', '$state', 'HttpService'];
    function AuthServiceFun(UserStorage, $q, ConfigService, CrudService, $state, HttpService) {
        var authService = angular.extend({});
        authService.isLoggedIn = function () {
            var user = JSON.parse(UserStorage.retrieve());
            if (!user) {
                return false;
            }
            return true;
        };
        authService.currentUser = function () {
            if (this.isLoggedIn()) {
                return UserStorage.retrieve();
            }
        };
        authService.logon = function (username, password) {
            var deferred = $q.defer();
            var url = ConfigService.getAppConfig().RootPath + "/logon";
            var data = {userName:username,password:password};
            var params = 'params=' + JSON.stringify(data);
            HttpService.post(url, params).then(function (data) {
                CrudService.service('userService','getUserInfo')
                    .then(function (data) {
                        UserStorage.create(data);
                        $state.go("home.default", {location: true, reload: true});
                    }, function (errorMsg) {
                        console.log(errorMsg);
                    });
                deferred.resolve("logon success");
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        authService.logout = function () {
            var url = ConfigService.getAppConfig().RootPath + '/logout';
            HttpService.delete(url).then(function (date) {});
            UserStorage.logout();
            $state.go('auth.login', {location: true, reload: true});
        };

        return authService;
    }

}).call(this);