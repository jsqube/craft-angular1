/**
 * Created by Ming on 2016/5/21.
 */
describe('http-service', function () {

    var httpService, $httpBackend;

    beforeEach(module('craft.api.http.rest'));

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        httpService = $injector.get('HttpService');
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        $httpBackend.when('GET', '/repository/role/findAll')
            .respond({
                "version": "1.0",
                "errorCode": 0,
                "errorMsg": null,
                "data": [
                    {"id": 12, "roleName": "superAdmin", "desc": "superAdmin", "rights": []},
                    { "id": 13,"roleName": "websiteAdmin","desc": "websiteAdmin111","rights": [] },
                    {"id": 19, "roleName": "courseAdmin", "desc": "courseAdmin", "rights": []}
                ]
            }, {'A-Token': 'xxx'});
        $httpBackend.when('GET', '/repository/roles/findAll')
            .respond({
                "version": "1.0",
                "errorCode": 1,
                "errorMsg": "service not found",
                "data": null
            }, {'A-Token': 'xxx'});
        $httpBackend.when('GET', '/WrongURL/roles/findAll')
            .respond(401, 'request error with :401');

        $httpBackend.when('PUT', '/repository/role',{"roleName":"test","desc":"test"})
            .respond({"version":"1.0","errorCode":0,"errorMsg":null,"data":"success"});
        $httpBackend.when('POST', '/repository/role/1',{"roleName":"test1","desc":"test1"})
            .respond({"version":"1.0","errorCode":0,"errorMsg":null,"data":"success"});
        $httpBackend.when('DELETE', '/repository/role/1',{"roleName":"test","desc":"test"})
            .respond({"version":"1.0","errorCode":0,"errorMsg":null,"data":"success"});
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch data with get method', function() {
        $httpBackend.expectGET('/repository/role/findAll');
        var result=httpService.get('/repository/role/findAll',false);
        $httpBackend.flush();

        var resultData=[
            {"id": 12, "roleName": "superAdmin", "desc": "superAdmin", "rights": []},
            { "id": 13,"roleName": "websiteAdmin","desc": "websiteAdmin111","rights": [] },
            {"id": 19, "roleName": "courseAdmin", "desc": "courseAdmin", "rights": []}
        ];
        result.then(function (data) {
            console.log("============")
            expect(data.data).toEqual(resultData);
            expect(data.data.length).toEqual(3);
        },function (reason) {
        },function (reason) {
        });
    });

    it('should save data with put method', function () {
        $httpBackend.expectPUT('/repository/role');
        var result=httpService.put('/repository/role',{"roleName":"test","desc":"test"});
        $httpBackend.flush();
        result.then(function (data) {
            expect(data.data).toEqual("success");
        }, function (reason) {
        });
    });
    it('should save data with post method', function () {
        $httpBackend.expectPOST('/repository/role/1');
        var result=httpService.post('/repository/role/1',{"roleName":"test1","desc":"test1"});
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual({ version: '1.0', errorCode: 0, errorMsg: null, data: 'success' });
        }, function (reason) {
        });
    });

    it('should delete data with delete method', function () {
        $httpBackend.expectDELETE('/repository/role/1');
        var result=httpService.delete('/repository/role/1',{"roleName":"test","desc":"test"});
        $httpBackend.flush();
        result.then(function (data) {
            expect(data.data).toEqual("success");
        }, function (reason) {
        });
    });

    it('should return 401 with wrong url', function () {
        $httpBackend.expectGET('/WrongURL/roles/findAll');
        var result=httpService.get('/WrongURL/roles/findAll');
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual("request error with :401");
        }).catch(function (reason) {
            console.log(reason);
            expect(reason).toEqual('request error with :401');
        });
    });

    it('should return wrong message with wrong repo', function () {
        $httpBackend.expectGET('/repository/roles/findAll');
        var result=httpService.get('/repository/roles/findAll');
        $httpBackend.flush();
        result.then(function (data) {
            expect(data).toEqual({version: '1.0', errorCode: 1, errorMsg: 'service not found', data: null});
        }).catch(function (reason) {
            console.log(reason);
            expect(reason).toEqual('service not found');
        });
    });
});