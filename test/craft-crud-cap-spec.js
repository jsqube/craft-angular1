/**
 * Created by Ming on 2016/5/21.
 */
describe('crud-service-cap', function () {

    var crudService, $templateCache, $httpBackend,_;
    var mockRoleData = [
        {"id": 1, "roleName": "superAdmin", "desc": "superAdmin", "rights": []},
        {"id": 2, "roleName": "websiteAdmin", "desc": "websiteAdmin", "rights": []},
        {"id": 3, "roleName": "courseAdmin", "desc": "courseAdmin", "rights": []}
    ];
    var responseBody = {
        "version": "1.0",
        "errorCode": 0,
        "errorMsg": null,
        "data": []
    };
    var getNestId = function (array) {
        var index = 0;
        angular.forEach(array, function (item) {
            if (item.id > index) index = item.id;
        });
        index++;
        return index;
    };

    beforeEach(module('craft.api.cap'));

    beforeEach(inject(function ($injector,$window) {
        // Set up the mock http service responses
        crudService = $injector.get('CrudService');
        $templateCache = $injector.get('$templateCache');
        $httpBackend = $injector.get('$httpBackend');
        _ = $window._;

        //prepare configurations
        $templateCache.put('meta/app-config.json', {
            "RootPath": "http://localhost:9876/craft",//http://117.185.125.15:8081//8083,//localhost:9000
            "timeout": 15000
        });
        $httpBackend.whenRoute('GET', 'http://localhost:9876/craft/repository/:repoName/:methodName/:pageSize/:pageIndex')
            .respond(function (method, url, data, headers, params) {
                //console.log(params.repoName, params.methodName, params.pageSize,params.pageIndex);

                var pageNum = Number(params.pageIndex) || 1;
                var pagingLength=Number(params.pageSize);
                var totalPages = Math.ceil(mockRoleData.length / pagingLength);

                //console.log(targetItem);
                var targetItem=_.slice(mockRoleData,(pageNum-1)*pagingLength,pagingLength);
                //console.log(targetItem);
                //console.log(mockRoleData);
                responseBody.data = targetItem;
                return [200, responseBody];
            });
        $httpBackend.whenRoute('GET', 'http://localhost:9876/craft/repository/:repoName/:methodName')
            .respond(function (method, url, data, headers, params) {
                //console.log(params.repoName, params.methodName, params.pageIndex,params.pageSize);
                var methodWithParams = _.split(params.methodName, "?");
                //console.log(methodWithParams);
                if (methodWithParams[0] === "findById") {
                    //console.log(mockRoleData);
                    //var param = params.params;
                    //console.log(params.params);
                    var targetItem = _.filter(mockRoleData, function (item) {
                        return item.id === parseInt(params.params);
                    })[0];
                    //console.log(targetItem);
                    responseBody.data = targetItem;
                    return [200, responseBody];
                }

                if (methodWithParams[0] === 'findAll') {
                    responseBody.data = mockRoleData;
                    return [200, responseBody];
                }
            });
        $httpBackend.whenRoute('PUT', 'http://localhost:9876/craft/repository/:repoName')
            .respond(function (method, url, data, headers, params) {
                //console.log(params.repoName);
                //console.log(data);
                //create a new mockRole and put into cache.
                var mockRole = angular.copy(JSON.parse(data));
                mockRole.id = getNestId(mockRoleData);
                mockRole.rights = [];
                mockRoleData.push(mockRole);
                //generate success response
                responseBody.data = "success";
                return [200, responseBody];
            });
        $httpBackend.whenRoute('POST', 'http://localhost:9876/craft/repository/:repoName/:id')
            .respond(function (method, url, data, headers, params) {
                //find the role data and update it
                var newArray = _.remove(mockRoleData, function (o) {
                    return o.id === parseInt(params.id);
                });
                //console.log(mockRoleData); //the remaining items
                //console.log(newArray); //the removed items
                var updatedItem=JSON.parse(data);
                mockRoleData.push(updatedItem);
                responseBody.data = "success";
                return [200, responseBody];
            });

        $httpBackend.whenRoute('DELETE', 'http://localhost:9876/craft/repository/:repoName/:id')
            .respond(function (method, url, data, headers, params) {
                //find the role data and update it
                _.remove(mockRoleData, function (item) {
                    return item.id === params.id;
                });
                responseBody.data = "success";
                return [200, responseBody];
            });
        $httpBackend.whenRoute('POST', 'http://localhost:9876/craft/service/:serviceName/:funcName')
            .respond(function (method, url, data, headers, params) {
                responseBody.data = "success";
                return [200, responseBody];
            });

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch all data with list method', function () {
        $httpBackend.expectGET('http://localhost:9876/craft/repository/role/findAll');
        var result = crudService.list('role', false);
        $httpBackend.flush();

        var resultData = [
            {"id": 1, "roleName": "superAdmin", "desc": "superAdmin", "rights": []},
            {"id": 2, "roleName": "websiteAdmin", "desc": "websiteAdmin", "rights": []},
            {"id": 3, "roleName": "courseAdmin", "desc": "courseAdmin", "rights": []}
        ];
        result.then(function (data) {

            console.log(data);
            expect(data).toEqual(resultData);
            expect(data.length).toEqual(3);
        }).catch(function (reason) {
            console.log(reason);
        });
    });

    it('should save data with put method', function () {
        $httpBackend.expectPUT('http://localhost:9876/craft/repository/role');
        var result = crudService.create('role', {"roleName": "test", "desc": "test"});
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual("success");
        }).catch(function (reason) {
        });

        $httpBackend.expectGET('http://localhost:9876/craft/repository/role/findById?params=4');
        var result = crudService.findByCriteria('role', 'findById', [4]);
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual({"id": 4, "roleName": "test", "desc": "test", "rights": []});
        }).catch(function (reason) {
        });
    });
    it('should save data with post method', function () {
        $httpBackend.expectPOST('http://localhost:9876/craft/repository/role/3');
        var result = crudService.update('role', 3, {"id": 3, "roleName": "test1", "desc": "test1","rights":[]});
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual("success");
        }, function (reason) {
        });
        $httpBackend.expectGET('http://localhost:9876/craft/repository/role/findById?params=[3]');
        var result = crudService.find('role', 3);
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual({"id": 3, "roleName": "test1", "desc": "test1", "rights": []});
        }, function (reason) {
        });
    });

    it('should delete data with delete method', function () {
        $httpBackend.expectDELETE('http://localhost:9876/craft/repository/role/4');
        var result = crudService.delete('role', 4);
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual("success");
        }, function (reason) {
        });
    });

    it('should call service method', function () {
        $httpBackend.expectPOST('http://localhost:9876/craft/service/customService/funcName');
        var result = crudService.service('customService', 'funcName', '1', '2');
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual("success");
        }, function (reason) {
        });
    });

    it('should fetch page data with findByCriteriaPageable method', function () {
        $httpBackend.expectGET('http://localhost:9876/craft/repository/role/findByPage/2/1');
        var result = crudService.findByCriteriaPageable('role', 'findByPage',2,1);
        $httpBackend.flush();

        var resultData = [
            {"id": 1, "roleName": "superAdmin", "desc": "superAdmin", "rights": []},
            {"id": 2, "roleName": "websiteAdmin", "desc": "websiteAdmin", "rights": []}
        ];
        result.then(function (data) {
            expect(data).toEqual(resultData);
            expect(data.length).toEqual(2);
        }, function (reason) {
        });
    });
});