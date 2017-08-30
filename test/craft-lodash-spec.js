/**
 * Created by Ming on 2016/6/3.
 */
describe('craft-lodash', function () {

    var _;

    beforeEach(module('craft.lodash'));

    beforeEach(angular.mock.inject(function ($injector) {
        _ = $injector.get('_');
    }));

    it('should be able to do array operations with _', function () {
        expect(_.chunk(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
    });
    it('should be able to do object operations with _', function () {
        var users = {
            'barney':  { 'age': 36, 'active': true },
            'fred':    { 'age': 40, 'active': false },
            'pebbles': { 'age': 1,  'active': true }
        };
        expect(_.findKey(users, function(o) { return o.age < 40; })).toBe("barney");
    });

});