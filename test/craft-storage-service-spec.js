describe('craft-storage-service', function () {

    var craftStorageService;

    beforeEach(module('craft.storage'));

    beforeEach(angular.mock.inject(function ($injector) {
        craftStorageService = $injector.get('CraftStorageService');
    }));


    describe('LocalStorage', function () {
        it('should be able to store and retrieve value', function () {
            craftStorageService.set("testKey",{"key":"values"});
            expect(craftStorageService.get("testKey")).toEqual({"key": "values"});
        });
        it('should be able to store and retrieve value', function () {
            craftStorageService.remove("testKey");
            expect(craftStorageService.get("testKey")).toBe(null);
        });
    });

});