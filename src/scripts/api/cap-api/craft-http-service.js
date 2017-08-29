(function () {
    'use strict';
    angular.module('craft.api.http.cap', []).factory('HttpService', HttpServiceFunc);
    HttpServiceFunc.$inject = ['$q', '$http' ];
    function HttpServiceFunc($q, $http) {
        var HttpService = angular.extend({});
        HttpService.get = function (url, useCache) {
            //console.log("url=" + url);
            var promise = $http({
                method: 'GET',
                url: url,
                cache: useCache ? useCache : false
            });

            return this.handlePromise(promise);
        };
        HttpService.post = function (url, formData) {
            var promise = $http({
                withCredentials: true,//in order to send cookie with CORS requests.
                method: 'POST',
                url: url,
                data: formData
            });

            return this.handlePromise(promise);
        };
        HttpService.put = function (url, formData) {
            var promise = $http({
                method: 'PUT',
                url: url,
                data: formData
            });
            return this.handlePromise(promise);
        };
        HttpService.delete = function (url) {
            var promise = $http({
                method: 'DELETE',
                url: url
            });
            return this.handlePromise(promise);
        };

        HttpService.handlePromise = function (promise) {
            var deferred = $q.defer();
            promise.success(function (response, status, headers, config) {
                if (response.errorCode === "0") {
                    console.log("response data===========================");
                    console.log(response);
                    console.log("response data===========================");
                    deferred.resolve(response.data);
                } else {
                    console.log("response data===========================");
                    console.log(response);
                    console.log("response data===========================");
                    deferred.reject(response.errorMsg);
                }
            }).error(function (response, status, headers, config) {
                console.log("response data===========================");
                console.log(response);
                console.log("response data===========================");
                deferred.reject("request error with :" + status);
            });
            return deferred.promise;
        };
        return HttpService;
    }
}).call(this);