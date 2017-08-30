(function () {
    'use strict';
    /**
     * ========================================================================
     * JwtAuthService
     * ========================================================================
     */
    angular.module('craft.auth.JwtAuthService',['craft.auth.token']).factory('JwtAuthService', JwtAuthServiceFun);
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
}).call(this);