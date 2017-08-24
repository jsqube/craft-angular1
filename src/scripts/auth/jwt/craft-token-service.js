(function () {
    'use strict';

    /**
     * ========================================================================
     * TokenService
     * ========================================================================
     */
    angular.module('craft.auth.token',['craft.storage']).factory('TokenService', ['CraftStorageService', function (CraftStorageService) {
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

}).call(this);