(function () {
    'use strict';
    /**
     * ========================================================================
     * ConfigService
     * ========================================================================
     */
    angular.module('craft.api.config',[]).factory('ConfigService', ConfigServiceFunc);
    ConfigServiceFunc.$inject = ['$templateCache'];
    function ConfigServiceFunc($templateCache) {
        var ConfigService=angular.extend({});
        ConfigService.getAppConfig=function () {
            return $templateCache.get("meta/app-config.json");
        };

        return ConfigService;
    }
}).call(this);