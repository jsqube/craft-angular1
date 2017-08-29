(function () {
    'use strict';
    angular.module('craft.api.crud.cap', []);
    angular.module('craft.api.crud.cap').factory('CrudService', CrudServiceFun);
    CrudServiceFun.$inject = [ 'HttpService', 'ConfigService' ];
    function CrudServiceFun(HttpService, ConfigService) {
        var CrudService = angular.extend({});
        CrudService.list = function (repoName) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + "/findAll";
            return HttpService.get(url);
        };
        CrudService.find = function (repoName, id) {
            //var formData = new Array(id);
            var params = 'params=[' + JSON.stringify(id) + ']';
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + "/findById?" + params;
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
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName
                + "/" + (method ? method : 'findAll')
                + (params ? '?params=' + params  : '');
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
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName
                + "/" + (method ? method : 'findAll')
                + "/" + pageSize + "/" + pageIndex
                + (params ? '?params=' + params : '')
                + (sortFields ? '&sort=' + sortFields : '');
            return HttpService.get(url, false);
        };
        CrudService.update = function (repoName, id, formData) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + '/' + id;
            var params = 'params=' + JSON.stringify(formData);
            return HttpService.post(url, formData);
        };
        CrudService.create = function (repoName, formData) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName;
            return HttpService.put(url, formData);
        };
        CrudService.delete = function (repoName, id) {
            // var params = 'params=[' + JSON.stringify(id)+']';
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + "/" + id;
            return HttpService.delete(url);
        };
        CrudService.service = function (serviceName, funcName) {
            var url = ConfigService.getAppConfig().RootPath + '/service/' + serviceName + "/" + funcName;
            var data = new Array();
            var argsCount = arguments.length;
            for (var i = 2; i < argsCount; i++) {
                data.push(arguments[i]);
            }
            var params = 'params=' + JSON.stringify(data);
            return HttpService.post(url, params);
        };

        return CrudService;
    }
}).call(this);

