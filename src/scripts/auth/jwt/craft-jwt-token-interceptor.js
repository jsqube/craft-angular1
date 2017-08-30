(function () {
    'use strict';
    /**
     * ========================================================================
     * JwtTokenInterceptor
     * ========================================================================
     */
    angular.module('craft.auth.JwtTokenInterceptor',['craft.auth.token']).factory('JwtTokenInterceptor', JwtTokenInterceptor);
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

    angular.module('craft.auth.JwtTokenInterceptor').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('JwtTokenInterceptor');
    }]);
}).call(this);