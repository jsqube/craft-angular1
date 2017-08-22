(function () {
    angular.module('metadata', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put("meta/config/app-config.json",{
            RootPath:'http://localhost:9000',
            authTokenName:"JWT-TOKEN"
        });
    }]);
}).call(this);