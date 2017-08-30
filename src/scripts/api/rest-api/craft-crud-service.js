(function(){
    'use strict';
    angular.module('craft.api.crud.rest', []);

    /**
     * ========================================================================
     * CrudService
     * ========================================================================
     */
    angular.module('craft.api.crud.rest').factory('CrudService', CrudServiceFun);
    CrudServiceFun.$inject = ['HttpService', 'ConfigService', '$q'];
    function CrudServiceFun(HttpService, ConfigService, $q) {
        var CrudService = angular.extend({});
        CrudService.list = function (repoName) {
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName + "";
            return HttpService.get(url);
        };

        CrudService.find = function (repoName, id) {
            //var formData = new Array(id);
            var params = 'params=[' + JSON.stringify(id) + ']';
            // var url = RestApiConfig.RootPath + '/' + repoName + "/findById?" + params;
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName + "/" + id;
            return HttpService.get(url);
        };

        /**
         * findByCriteria
         * @param repoName
         * @param method
         * @param params: [1,2,3,"test"]
         * @returns {*}
         */
        CrudService.findByCriteria = function (repoName, method, params) {
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName
                // + "/" + (method ? method : 'findAll')
                + (params ? '?params=' + params : '');
            return HttpService.get(url, false);
        };

        /**
         * findByCriteriaPageable
         * @param repoName : newsRepository
         * @param method : findAll
         * @param params: [1,2,3,"test"]
         * @param pageSize : 10
         * @param pageIndex : 0
         * @param sortFields: [{field:'field1', type:cffex.repository.SORT_TYPE_ASC},{...},...]
         * @returns {*}
         */
        CrudService.findByCriteriaPageable = function (repoName, method, pageSize, pageIndex, params, sortFields) {
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName
                // + "/" + (method ? method : 'findAll')
                + "/" + pageSize + "/" + pageIndex
                + (params ? '?params=' + params : '')
                + (sortFields ? '&sort=' + sortFields : '');
            return HttpService.get(url, false);
        };

        CrudService.update = function (repoName, id, formData) {
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName + '/' + id;
            var params = 'params=' + JSON.stringify(formData);
            return HttpService.put(url, formData);
        };

        CrudService.create = function (repoName, formData) {
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName;
            return HttpService.post(url, formData);
        };

        CrudService.delete = function (repoName, id) {
            // var params = 'params=[' + JSON.stringify(id)+']';
            var url = ConfigService.getAppConfig().RootPath + '/api/' + repoName + "/" + id;
            return HttpService.delete(url);
        };

        CrudService.postService = function (serviceName, funcName,params) {
            var url = ConfigService.getAppConfig().RootPath + '/service/' + serviceName + "/" + funcName;
            // var funcParams = [];
            // var argsCount = arguments.length;
            // for (var i = 2; i < argsCount; i++) {
            //     funcParams.push(arguments[i]);
            // }
            // var params = {};
            // params.params = JSON.stringify(funcParams);
            return HttpService.post(url, params);
        };

        CrudService.getService = function (serviceName, funcName,params) {
            var url = ConfigService.getAppConfig().RootPath + '/service/' + serviceName + "/" + funcName;
            return CrudService.urlService(url, params);
        };

        CrudService.urlService = function (url,params) {
            return HttpService.get(url+"?params="+encodeURI(JSON.stringify(params)));
        };

        CrudService.handlePromise = function (promise, repoName) {
            var deferred = $q.defer();
            promise.success(function (response, status, headers, config) {
                console.log("response data===========================");
                console.log(response);
                console.log("response data===========================");
                deferred.resolve(response);
            }).error(function (response, status, headers, config) {
                console.log("response data===========================");
                console.log(response);
                console.log("response data===========================");
                deferred.reject("request error with :" + status);
            });
            return deferred.promise;
        };
        return CrudService;
    }
}).call(this);