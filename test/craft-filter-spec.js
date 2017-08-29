describe('craft-filter',function () {
    'use strict';

    describe('filterWatcherProvider', function() {
        //helpers
        var stub = { fn: function(x) { return x; } };

        beforeEach(module('craft.filter-watcher'));

        it('should have 2 main functions `isMemoized` and `memoize`', inject(function(filterWatcher) {
            expect(filterWatcher.isMemoized).toEqual(jasmine.any(Function));
            expect(filterWatcher.memoize).toEqual(jasmine.any(Function));
        }));

        // it('should call the function if it\'s not cached',
        //     inject(function(filterWatcher) {
        //         var spy = spyOn(stub, 'fn');
        //         (function memoizedOnly(n) {
        //             return filterWatcher.isMemoized('fName',n) || stub.fn(n);
        //         })();
        //         expect(spy).toHaveBeenCalled();
        //         expect(spy.callCount).toEqual(1);
        //     }));

        it('should not crash in circular structure situations',
            inject(function(filterWatcher, $document, $window, $rootScope) {
                var o1 = { a: 1, b: 2 };
                var o2 = { a: 1, b: 2 };
                o1.own = o1;
                o1.window = $window;
                o1.document = $document;
                o1.scope = $rootScope;
                o1.trait = o2;
                o2.own = o2;
                (function memoizedOnly(n) {
                    return filterWatcher.isMemoized('fName',n) || stub.fn(n);
                })(o1);
            }));

        // it('should get the result from cache if it\'s memoized',
        //     inject(function(filterWatcher, $rootScope) {
        //         var scope = $rootScope.$new();
        //         var spy = spyOn(stub, 'fn').andCallThrough();
        //         function memoize(n) {
        //             return filterWatcher.isMemoized('fName', n) ||
        //                 filterWatcher.memoize('fName', n, scope, stub.fn(n));
        //         }
        //         [1,1,1,1,4,4,4,4,4].forEach(function(el) {
        //             memoize(el);
        //         });
        //         expect(spy).toHaveBeenCalled();
        //         expect(spy.callCount).toEqual(2);
        //     }));

        // it('should clear cache from scope listeners on `$destroy`',
        //     inject(function(filterWatcher, $rootScope) {
        //         var scope;
        //         var spy = spyOn(stub, 'fn').andCallThrough();
        //         function memoize(n) {
        //             return filterWatcher.isMemoized('fName', n) ||
        //                 filterWatcher.memoize('fName', n, scope = $rootScope.$new(), stub.fn(n));
        //         }
        //         [1,1,1,1,1,1,1,1,1,1].forEach(function(el) {
        //             memoize(el);
        //             scope.$destroy();
        //         });
        //         expect(spy.callCount).toEqual(10);
        //     }));

        it('should clear cache manually', function() {
            window.setTimeout = function(cb) { cb(); };
            inject(function(filterWatcher) {
                var src = [1,2]
                    , result = [3,4];
                filterWatcher.memoize('fName', src, null, result);
                expect(filterWatcher.isMemoized('fName', src)).toBeFalsy();
            });
        });
    });
    'use strict';

    describe('angularFilter', function () {

        var isDefined,
            isUndefined,
            isFunction,
            isString,
            isNumber,
            isObject,
            isArray,
            isEqual;

        beforeEach(module('craft.angular'));

        beforeEach(inject(function ($filter) {
            isDefined = $filter('isDefined');
            isUndefined = $filter('isUndefined');
            isFunction = $filter('isFunction');
            isString = $filter('isString');
            isNumber = $filter('isNumber');
            isObject = $filter('isObject');
            isArray = $filter('isArray');
            isEqual = $filter('isEqual');
        }));

        it('should called angular.isDefined method with the given input', function() {

            spyOn(angular, 'isDefined');
            isDefined(undefined);
            expect(angular.isDefined).toHaveBeenCalledWith(undefined)

        });

        it('should called angular.isUndefined method with the given input', function() {

            spyOn(angular, 'isUndefined');
            isUndefined(undefined);
            expect(angular.isUndefined).toHaveBeenCalledWith(undefined)

        });

        it('should called angular.isFunction method with the given input', function() {

            var func = function() {};
            spyOn(angular, 'isFunction');
            isFunction(func);
            expect(angular.isFunction).toHaveBeenCalledWith(func)

        });

        it('should called angular.isString method with the given input', function() {

            spyOn(angular, 'isString');
            isString('string');
            expect(angular.isString).toHaveBeenCalledWith('string')

        });

        it('should called angular.isNumber method with the given input', function() {

            spyOn(angular, 'isNumber');
            isNumber(777);
            expect(angular.isNumber).toHaveBeenCalledWith(777)

        });

        it('should called angular.isArray method with the given input', function() {

            spyOn(angular, 'isArray');
            isArray([]);
            expect(angular.isArray).toHaveBeenCalledWith([])

        });

        it('should called angular.isObject method with the given input', function() {

            spyOn(angular, 'isObject');
            isObject({});
            expect(angular.isObject).toHaveBeenCalledWith({})

        });

        it('should called angular.equals method with the given input', function() {

            var o1 = {}, o2 = {};
            spyOn(angular, 'equals');
            isEqual(o1, o2);
            expect(angular.equals).toHaveBeenCalledWith(o1, o2)

        });


    });

    'use strict';

    describe('conditionsFilter', function () {

        var isGreaterThan,
            isGreaterThanOrEqualTo,
            isLessThan,
            isLessThanOrEqualTo,
            isEqualTo,
            isNotEqualTo,
            isIdenticalTo,
            isNotIdenticalTo;

        beforeEach(module('craft.conditions'));

        beforeEach(inject(function ($filter) {
            isGreaterThan = $filter('isGreaterThan');
            isGreaterThanOrEqualTo = $filter('isGreaterThanOrEqualTo');
            isLessThan = $filter('isLessThan');
            isLessThanOrEqualTo = $filter('isLessThanOrEqualTo');
            isEqualTo = $filter('isEqualTo');
            isNotEqualTo = $filter('isNotEqualTo');
            isIdenticalTo = $filter('isIdenticalTo');
            isNotIdenticalTo = $filter('isNotIdenticalTo');
        }));

        it('should check expected conditions', function() {
            expect(isGreaterThan(1, 2)).toBe(false);
            expect(isGreaterThanOrEqualTo(1, 1)).toBe(true);

            expect(isLessThan(1, 2)).toBe(true);
            expect(isLessThanOrEqualTo(3, 2)).toBe(false);

            expect(isEqualTo(3, '3')).toBe(true);
            expect(isNotEqualTo(3, '3')).toBe(false);

            expect(isIdenticalTo(3, 3)).toBe(true);
            expect(isNotIdenticalTo(3, 3)).toBe(false);
        });

        it('should be aliases for each condition filter', inject(
            function($filter){
                var filters = {
                    isGreaterThan: '>',
                    isGreaterThanOrEqualTo: '>=',
                    isLessThan: '<',
                    isLessThanOrEqualTo: '<=',
                    isEqualTo: '==',
                    isNotEqualTo: '!=',
                    isIdenticalTo: '===',
                    isNotIdenticalTo: '!=='
                };
                //expectations
                angular.forEach(filters, function(val, key) {
                    expect($filter(val).toString()).toEqual($filter(key).toString());
                });
            }));

    });

    'use strict';

    describe('isNullFilter', function () {

        var filter;

        beforeEach(module('craft.is-null'));

        beforeEach(inject(function ($filter) {
            filter = $filter('isNull');
        }));

        it('should returns true if the value is null, else false.', function() {

            expect(filter(null)).toBeTruthy();

            expect(filter({})).toBeFalsy();
            expect(filter([])).toBeFalsy();
            expect(filter(1)).toBeFalsy();
            expect(filter(!1)).toBeFalsy();
            expect(filter('string')).toBeFalsy();
            expect(filter(undefined)).toBeFalsy();

        });

    });

    'use strict';

    describe('afterWhereFilter', function() {
        var filter;

        beforeEach(module('craft.after-where'));

        beforeEach(inject(function ($filter) {
            filter = $filter('afterWhere');
        }));

        it('should get array as a collection and properties object, and returns all of the items,' +
            'in the collection after the first that found with the given properties including it.', function() {

            var array = [{ a: 1 }, { a: 2 }, { a: 3 }],
                orders = [
                    { id: 1, customer: { name: 'foo' }, date: 'Tue Jul 15 2014' },
                    { id: 2, customer: { name: 'foo' }, date: 'Tue Jul 16 2014' },
                    { id: 3, customer: { name: 'foo' }, date: 'Tue Jul 17 2014' },
                    { id: 4, customer: { name: 'foo' }, date: 'Tue Jul 18 2014' },
                    { id: 5, customer: { name: 'foo' }, date: 'Tue Jul 19 2014' }
                ];

            expect(filter(array, { a: 2 })).toEqual([{ a: 2 }, { a: 3 }]);
            //get all orders after July include
            expect(filter(orders, { date: 'Tue Jul 17 2014' })).toEqual([ orders[2], orders[3], orders[4] ]);

            //if identifier not exist, return it as-is
            expect(filter(orders, { date: 'Tue Jul 10 2014' })).toEqual(orders);
        });

        it('should get object as a collection and properties object, and returns all of the items,' +
            'in the collection after the first that found with the given properties including it.', function() {

            var object = {
                0: { a: 1 },
                1: { a: 2 },
                2: { a: 3 },
                3: { a: 4 }
            },orders = {
                0: { id: 1, customer: { name: 'foo' }, date: 'Tue Jul 15 2014' },
                1: { id: 2, customer: { name: 'foo' }, date: 'Tue Jul 16 2014' },
                2: { id: 3, customer: { name: 'foo' }, date: 'Tue Jul 17 2014' },
                3: { id: 4, customer: { name: 'foo' }, date: 'Tue Jul 18 2014' },
                4: { id: 5, customer: { name: 'foo' }, date: 'Tue Jul 19 2014' }
            };

            expect(filter(object, { a: 3 } )).toEqual([{ a: 3 }, { a: 4 }]);

            expect(filter(orders, { date: 'Tue Jul 18 2014' } )).toEqual([orders[3], orders[4]]);

        });

        it('should get a !collection and return it as-is', function() {

            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');

        });

        it('should return the collection as-is, if not get a properties object', function() {

            expect(filter([{}, {}])).toEqual([{}, {}]);
            expect(filter([])).toEqual([]);

        });

    });

    'use strict';

    describe('afterFilter', function() {
        var filter;

        beforeEach(module('craft.after'));

        beforeEach(inject(function ($filter) {
            filter = $filter('after');
        }));

        it('should get array as a collection and specified count, and returns all of the items' +
            'in the collection after the specified count.', function() {

            var array = [{ a: 1 }, { a: 2 }];

            expect(filter(array, 1)).toEqual([{ a:2 }]);

            expect(filter([1,2,3,4], 1)).toEqual([2,3,4]);
            expect(filter([1,2,3,4], 5)).toEqual([]);

        });

        it('should get object as a collection and specified count, and returns all of the items' +
            'in the collection after the specified count.', function() {

            var object = {
                0: { a: 1 },
                1: { a: 2 },
                2: { a: 3 },
                3: { a: 4 }
            };

            expect(filter(object, 3)).toEqual([{ a: 4 }]);
            expect(filter(object, 2)).toEqual([{ a: 3 }, { a: 4 }]);

            expect(filter(object, 10)).toEqual([]);

        });

        it('should get a !collection and return it as-is', function() {

            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');

        });

    });

    'use strict';

    describe('beforeFilter', function() {
        var filter;

        beforeEach(module('craft.before'));

        beforeEach(inject(function ($filter) {
            filter = $filter('before');
        }));

        it('should get array as a collection and specified count, and returns all of the items' +
            'in the collection before the specified count.', function() {

            var array = [{ a: 1 }, { a: 2 }];

            expect(filter(array, 2)).toEqual([{ a: 1 }]);

            expect(filter([1,2,3,4], 4)).toEqual([1,2,3]);
            expect(filter([1,2,3,4], 5)).toEqual([1,2,3,4]);

        });

        it('should get object as a collection and specified count, and returns all of the items' +
            'in the collection before the specified count.', function() {

            var object = {
                0: { a: 1 },
                1: { a: 2 },
                2: { a: 3 },
                3: { a: 4 }
            };

            expect(filter(object, 3)).toEqual([{ a: 1 }, { a: 2 }]);
            expect(filter(object, 1)).toEqual([]);

            expect(filter(object, 10)).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);

        });

        it('should get a !collection and return it as-is', function() {

            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');

        });

    });

    'use strict';

    describe('beforeWhereFilter', function() {
        var filter;

        beforeEach(module('craft.before-where'));

        beforeEach(inject(function ($filter) {
            filter = $filter('beforeWhere');
        }));

        it('should get array as a collection and properties object, and returns all of the items,' +
            'in the collection before the first that found with the given properties including it.', function() {

            var array = [{ a: 1 }, { a: 2 }, { a: 3 }],
                orders = [
                    { id: 1, customer: { name: 'foo' }, date: 'Tue Jul 15 2014' },
                    { id: 2, customer: { name: 'foo' }, date: 'Tue Jul 16 2014' },
                    { id: 3, customer: { name: 'foo' }, date: 'Tue Jul 17 2014' },
                    { id: 4, customer: { name: 'foo' }, date: 'Tue Jul 18 2014' },
                    { id: 5, customer: { name: 'foo' }, date: 'Tue Jul 19 2014' }
                ];

            expect(filter(array, { a: 2 })).toEqual([{ a: 1 }, { a: 2 }]);
            //get all orders after July include
            expect(filter(orders, { date: 'Tue Jul 17 2014' })).toEqual([ orders[0], orders[1], orders[2] ]);

            //if identifier not exist, return it as-is
            expect(filter(orders, { date: 'Tue Jul 10 2014' })).toEqual(orders);
        });

        it('should get object as a collection and properties object, and returns all of the items,' +
            'in the collection before the first that found with the given properties including it.', function() {

            var object = {
                0: { a: 1 },
                1: { a: 2 },
                2: { a: 3 },
                3: { a: 4 }
            },orders = {
                0: { id: 1, customer: { name: 'foo' }, date: 'Tue Jul 15 2014' },
                1: { id: 2, customer: { name: 'foo' }, date: 'Tue Jul 16 2014' },
                2: { id: 3, customer: { name: 'foo' }, date: 'Tue Jul 17 2014' },
                3: { id: 4, customer: { name: 'foo' }, date: 'Tue Jul 18 2014' },
                4: { id: 5, customer: { name: 'foo' }, date: 'Tue Jul 19 2014' }
            };

            expect(filter(object, { a: 3 } )).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);

            expect(filter(orders, { date: 'Tue Jul 15 2014' } )).toEqual([orders[0]]);

        });

        it('should get a !collection and return it as-is', function() {

            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');

        });

        it('should return the collection as-is, if not get a properties object', function() {

            expect(filter([{}, {}])).toEqual([{}, {}]);
            expect(filter([])).toEqual([]);

        });

    });

    'use strict';

    describe('chunkByFilter', function() {
        var filter;

        beforeEach(module('craft.chunk-by'));
        beforeEach(inject(function($filter) {
            filter = $filter('chunkBy');
        }));

        it('should collect data into fixed-length chunks or blocks', function() {
            expect(filter([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
        });
        it('should collect data into fixed-length chunks or blocks', function() {
            expect(filter([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]]);
        });
        it('should collect data into fixed-length chunks or blocks', function() {
            expect(filter(['a', 'b', 'c', 'd'], 4)).toEqual([['a', 'b', 'c', 'd']]);
        });

        it('should get an fill-value and complete blocks that less than `n`', function() {
            expect(filter([1, 2, 3, 4, 5], 2, 0)).toEqual([[1, 2], [3, 4], [5, 0]]);
        });
        it('should get an fill-value and complete blocks that less than `n`', function() {
            expect(filter([1, 2, 3, 4], 3, 1)).toEqual([[1, 2, 3], [4, 1, 1]]);
        });

        it('should get a !collection and return it as-is', function() {
            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
        });
        it('should get a !collection and return it as-is', function() {
            expect(filter('string')).toEqual('string');
        });
        it('should get a !collection and return it as-is', function() {
            expect(filter(undefined)).toEqual(undefined);
        });

        describe('inside the DOM', function() {
            it('should not throw and not trigger the infinite digest exception',
                inject(function($rootScope, $compile) {
                    var scope = $rootScope.$new();
                    scope.list = [
                        { name: 'foo', team: 'a' },
                        { name: 'lol', team: 'b' },
                        { name: 'bar', team: 'b' },
                        { name: 'baz', team: 'a' },
                        { name: 'bag', team: 'a' }
                    ];
                    scope.search = '';
                    var elm = angular.element(
                        '<ul>' +
                        '<li ng-repeat="players in list | filter: search | chunkBy: 3">' +
                        '<p ng-repeat="player in players"> {{ player }}</p>' +
                        '</li>' +
                        '</ul>'
                    );
                    var temp = $compile(elm)(scope);
                    expect(function() { scope.$digest() }).not.toThrow();
                    expect(angular.element(temp.children()[0]).children().length).toEqual(3);
                    expect(angular.element(temp.children()[1]).children().length).toEqual(2);
                }));
        });
    });

    'use strict';

    describe('concatFilter', function() {

        var filter;

        beforeEach(module('craft.concat'));

        beforeEach(inject(function($filter) {
            filter = $filter('concat');
        }));

        it('should get 2 arrays as parameters and return merged one', function() {

            expect(filter([1,2,3], [4,5,6])).toEqual([1,2,3,4,5,6]);
            expect(filter([], [4,5,6])).toEqual([4,5,6]);
            expect(filter([true, false], [])).toEqual([true, false]);

            expect(filter([{a: 1}], [{a: 2}])).toEqual([{a: 1}, {a: 2}]);
        });

        it('should get a wrong ot none parameters, and not touch it', function () {

            expect(filter('string', [])).toEqual('string');
            expect(filter('string')).toEqual('string');

            expect(filter([], undefined)).toEqual([]);
            expect(filter(undefined, [])).toEqual(undefined);

        });

        it('should get a mixed parameters and return merged collection', function() {

            var array = [{a: 1}],
                object = {
                    0: {a: 2},
                    1: {a: 3}
                };

            expect(filter(array, object)).toEqual([{a: 1}, {a: 2}, {a: 3}]);
            expect(filter(object, array)).toEqual([{a: 2}, {a: 3}, {a: 1}]);

            expect(filter(object, object)).toEqual([{a: 2}, {a: 3}, {a: 2}, {a: 3}]);
            expect(filter(array, array)).toEqual([{a: 1}, {a: 1}]);

        });

    });

    'use strict';

    describe('containsFilter', function() {
        var filter;

        beforeEach(module('craft.contains'));

        beforeEach(inject(function ($filter) {
            filter = $filter('contains');
        }));

        it('should find elements which are objects', function() {
            var needle = {};
            var haystack = [needle];

            expect(filter(haystack, needle)).toBeTruthy();
        });

        it('should get collection of primitives and use strict comparison(===)', function() {
            expect(filter(['foo', 'bar'], 'bar')).toBeTruthy();
            expect(filter([1,2,3,4], 4)).toBeTruthy();

            expect(filter(['foo', 'bar'], 'baz')).toBeFalsy();
            expect(filter([1,2,3,4], -1)).toBeFalsy();
        });

        it('should get array as collection and return if given expression is ' +
            'present in one or more object in the collection', function() {
            var array = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, 'id === 2')).toBeTruthy();
            expect(filter(array, 'id >= 1 && name === \'foo\'')).toBeTruthy();
            expect(filter(array)).toBeFalsy();

            expect(filter(array, 'id > 77')).toBeFalsy();
            expect(filter(array, 'name.indexOf(\'u\') !== -1')).toBeFalsy();
        });

        it('should get object as collection and return if given expression is ' +
            'present in one or more object in the collection', function() {
            var object = {
                0: { id: 1, name: 'foo' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, 'id === 2')).toBeTruthy();
            expect(filter(object, 'id >= 1 && name === "foo"')).toBeTruthy();
            expect(filter(object)).toBeFalsy();

            expect(filter(object, 'id > 77')).toBeFalsy();
            expect(filter(object, 'name.indexOf(\'u\') !== -1')).toBeFalsy();
        });

        it('should get function as expression', function() {
            var array = [1, 2, 3, 4, 5];

            function mod2(elm) {
                return !(elm % 2);
            }

            expect(filter(array, mod2)).toBeTruthy();
        });

        it('should get !collection and return always true', function() {
            expect(filter('lorem ipsum')).toBeFalsy();
            expect(filter(1, null)).toBeFalsy();
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('countByFilter', function() {
        var filter;

        beforeEach(module('craft.count-by'));
        beforeEach(inject(function ($filter) {
            filter = $filter('countBy');
        }));

        it('should returns a count for the number of objects in each group.', function() {

            var players = [
                {name: 'Gene', team: 'alpha'},
                {name: 'George', team: 'beta'},
                {name: 'Steve', team: 'gamma'},
                {name: 'Paula', team: 'beta'},
                {name: 'Scruath', team: 'gamma'}
            ];

            expect(filter(players, 'team')).toEqual( {
                alpha: 1,
                beta: 2,
                gamma: 2
            });

        });

        it('should support nested properties to', function() {

            var orders = [
                { id:10, customer: { name: 'foo', id: 1 } },
                { id:11, customer: { name: 'bar', id: 2 } },
                { id:12, customer: { name: 'foo', id: 1 } },
                { id:13, customer: { name: 'bar', id: 2 } },
                { id:14, customer: { name: 'bar', id: 3 } },
                2, null, true
            ];

            expect(filter(orders, 'customer.name')).toEqual( {
                foo: 2,
                bar: 3,
                undefined: 3
            });

        });


        it('should get object as collection, property(nested to) as identifier and ' +
            'returns the composed aggregate object.', function() {

            var dataObject = {
                0: { id: 1, data: {} },
                1: { id: 1, data: {} },
                2: { id: 2, data: {} },
                3: { id: 2, data: {} }
            };

            expect(filter(dataObject, 'id')).toEqual({
                1: 2,
                2: 2
            });

        });

        it('should get !collection and return it as-is ', function() {

            expect(filter('string')).toEqual('string');
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
            expect(filter(null)).toBeNull();

        });

    });

    'use strict';

    describe('defaultsFilter', function() {
        var filter;

        beforeEach(module('craft.defaults'));
        beforeEach(inject(function ($filter) {
            filter = $filter('defaults');
        }));

        it('should return the collection as-is, if default object not provided', function() {
            expect(filter([{}])).toEqual([{}]);
            expect(filter([])).toEqual([]);
        });

        it('should change the source object', function() {
            var array = [{ a: 1 }];
            var defaults = { b: 2 };
            var copy = angular.copy(array);

            expect(filter(array, defaults)).toEqual([{ a:1, b: 2 }]);
            expect(array).not.toEqual(copy);
        });

        //test the simple usage
        describe('should use fallback value', function() {
            var expectOrders = [
                { id:1, destination: { zip: 21908 }, name: 'Ariel M.' },
                { id:2, destination: { zip: 'Pickup' }, name: 'John F.' },
                { id:3, destination: { zip: 45841 }, name: 'Not available'},
                { id:4, destination: { zip: 78612 }, name: 'Danno L.' }
            ];
            var defaults = { name: 'Not available', destination: { zip: 'Pickup' } };

            it('should work with array', function() {
                var orders = [
                    { id:1, destination: { zip: 21908 }, name: 'Ariel M.' },
                    { id:2, name: 'John F.' },
                    { id:3, destination: { zip: 45841 } },
                    { id:4, destination: { zip: 78612 }, name: 'Danno L.' }
                ];
                var copyOrders = angular.copy(orders);

                expect(filter(copyOrders, defaults)).toEqual(expectOrders);
                expect(filter(copyOrders, defaults)).not.toEqual(orders);
            });

            it('should work with object', function() {
                var orders = {
                    0: { id:1, destination: { zip: 21908 }, name: 'Ariel M.' },
                    1: { id:2, name: 'John F.' },
                    2: { id:3, destination: { zip: 45841 } },
                    3: { id:4, destination: { zip: 78612 }, name: 'Danno L.' }
                };
                var copyOrders = angular.copy(orders);

                expect(filter(copyOrders, defaults)).toEqual(expectOrders);
                expect(filter(copyOrders, defaults)).not.toEqual(orders);
            });

        });

        it('should work fine with complex objects', function() {
            var array = [
                { a: 'string',
                    b: { c: 1 },
                    d: { e: { f: new Function() } },
                    g: [],
                    h: undefined,
                    i: { j: { k: { l: 'm' } } },
                    o: new RegExp }
            ];
            var copy = angular.copy(array);
            var defaults = { z: 'z', z1: { z2: 'z2' } , h: 1 };
            angular.extend(array[0], defaults);
            expect(filter(copy, defaults)).toEqual(array);
        });

        it('should get !collection and return it as-is ', function() {
            expect(filter('string')).toEqual('string');
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
            expect(filter(null)).toBeNull();
        });

    });

    'use strict';

    describe('everyFilter', function() {
        var filter;

        beforeEach(module('craft.every'));

        beforeEach(inject(function ($filter) {
            filter = $filter('every');
        }));

        it('should get collection of primitives and use strict comparison(===)', function() {

            expect(filter(['bar', 'bar'], 'bar')).toBeTruthy();
            expect(filter([4,4,4,4], 4)).toBeTruthy();

            expect(filter(['foo', 'bar'], 'bar')).toBeFalsy();
            expect(filter([1,4,4,4], 4)).toBeFalsy();

        });

        it('should get array as collection and return if given expression is ' +
            'present all members in the collection', function() {

            var array = [
                { id: 1, name: 'faa' },
                { id: 1, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, 'id === 1')).toBeTruthy();
            expect(filter(array, 'id >= 1 && name.indexOf(\'a\') !== -1')).toBeTruthy();
            expect(filter(array)).toBeTruthy();

            expect(filter(array, 'id > 77')).toBeFalsy();
            expect(filter(array, 'name.indexOf(\'b\') !== -1')).toBeFalsy();

        });

        it('should get object as collection and return if given expression is ' +
            'present all members in the collection', function() {

            var object = {
                0: { id: 2, name: 'faa' },
                1: { id: 2, name: 'baz' },
                2: { id: 2, name: 'ariel' },
                3: { id: 2, name: 'bar' }
            };


            expect(filter(object, 'id === 2')).toBeTruthy();
            expect(filter(object, 'id >= 1 && name.indexOf(\'a\') !== -1')).toBeTruthy();
            expect(filter(object)).toBeTruthy();

            expect(filter(object, 'id > 77')).toBeFalsy();
            expect(filter(object, 'name.indexOf(\'b\') !== -1')).toBeFalsy();

        });

        it('should get function as expression', function() {

            var array = [0, 2, 4, 6, 8];

            function mod2(elm) {
                return !(elm % 2);
            }

            expect(filter(array, mod2)).toBeTruthy();

        });

        it('should get !collection and return always true', function() {

            expect(filter('lorem ipsum')).toBeTruthy();
            expect(filter(1, null)).toBeTruthy();
            expect(filter(!1)).toBeTruthy();

        });

    });

    'use strict';

    describe('filterByFilter', function() {
        var filter;

        beforeEach(module('craft.filter-by'));
        beforeEach(inject(function($filter) {
            filter = $filter('filterBy');
        }));

        it('should filter by specific properties and avoid the rest', function() {
            var users = [
                { id: 1, user: { first_name: 'foo', last_name: 'bar',  mobile: 4444 } },
                { id: 2, user: { first_name: 'bar', last_name: 'foo',  mobile: 3333 } },
                { id: 3, user: { first_name: 'foo', last_name: 'baz',  mobile: 2222 } },
                { id: 4, user: { first_name: 'baz', last_name: 'foo',  mobile: 1111 } }
            ];

            expect(filter(users, ['user.first_name', 'user.last_name'], 'foo')).toEqual(users);
            expect(filter(users, ['user.first_name'], 'foo')).toEqual([users[0], users[2]]);
            expect(filter(users, ['user.last_name'], 'bar')).toEqual([users[0]]);

            expect(filter(users, ['id', 'user.mobile'], '1')).toEqual([users[0], users[3]]);
            expect(filter(users, ['id'], '1')).toEqual([users[0]]);
            expect(filter(users, ['id', 'user.mobile'], '11')).toEqual([users[3]]);
        });

        // it('should support to get object as collection', function() {
        //     var users = {
        //         0: { id: 1, user: { first_name: 'foo', last_name: 'bar',  mobile: 4444 } },
        //         1: { id: 2, user: { first_name: 'bar', last_name: 'foo',  mobile: 3333 } },
        //         2: { id: 3, user: { first_name: 'foo', last_name: 'baz',  mobile: 2222 } },
        //         3: { id: 4, user: { first_name: 'baz', last_name: 'foo',  mobile: 1111 } }
        //     };
        //
        //     expect(filter(users, ['user.first_name', 'user.last_name'], 'foo')).toEqual(users);
        //     expect(filter(users, ['user.first_name'], 'oo')).toEqual([users[0], users[2]]);
        //     expect(filter(users, ['user.last_name'], 'bar')).toEqual([users[0]]);
        // });

        it('should parse concatenate properties, and search them by one field', function() {
            var users = [
                { id: 1, user: { first_name: 'foo', last_name: 'bar',  mobile: 4444 } },
                { id: 2, user: { first_name: 'bar', last_name: 'foo',  mobile: 3333 } },
                { id: 3, user: { first_name: 'foo', last_name: 'baz',  mobile: 2222 } },
                { id: 4, user: { first_name: 'baz', last_name: 'foo',  mobile: 1111 } }
            ];

            expect(filter(users, ['user.first_name + user.last_name'], 'foo bar')).toEqual([users[0]]);
            expect(filter(users, ['user.first_name+user.last_name'], 'foo bar')).toEqual([users[0]]);
            expect(filter(users, ['user.first_name + user.mobile'], 'foo 4444')).toEqual([users[0]]);

            expect(filter(users, ['user.first_name + user.undefined'], 'foo')).toEqual([users[0], users[2]]);

            expect(filter(users, ['user.first_name + user.last_name'], 'a')).toEqual(users);
            expect(filter(users, ['user.first_name + user.last_name'], 'ba')).toEqual(users);
            expect(filter(users, ['user.first_name + user.last_name'], 'foo')).toEqual(users);
        });

        it('should take care on extreme conditions', function() {
            var users = [
                { id: 1, user: { first_name: 'foo', last_name: 'bar',  mobile: 4444 } },
                { id: 2, user: { first_name: 'bar', last_name: 'foo',  mobile: 3333 } },
                { id: 3, user: { first_name: 'foo', last_name: 'baz',  mobile: 2222 } },
                { id: 4, user: { first_name: 'baz', last_name: 'foo',  mobile: 1111 } }
            ];

            expect(filter(users, ['id'], 1)).toEqual([users[0]]);
            expect(filter(users, ['id'])).toEqual(users);
            expect(filter(users, ['id', 'phone'], 4)).toEqual([users[3]]);
            expect(filter(users, ['id', 'phone'], null)).toEqual(users);
            expect(filter(users, null, null)).toEqual(users);
            expect(filter(users, [], [])).toEqual(users);
        });

        it('should get a !collection and return it as-is', function() {
            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');
            expect(filter(undefined)).toEqual(undefined);
        });

        it('should not coerce non-string/number properties', function() {
            var users = [
                { id: [1, 2], user: { first_name: 'foo', last_name: 'bar',  mobile: 4444 } }
            ];

            expect(filter(users, ['id'], 1)).toEqual([]);
        });

        describe('strict mode', function() {
            var users = [
                { id: 1, user: { first_name: 'foo', last_name: 'bar',  mobile: 4444 } }
            ];

            it('should only return exact matches', function() {
                expect(filter(users, ['user.first_name'], 'fo', true)).toEqual([]);
                expect(filter(users, ['user.first_name'], 'foo', true)).toEqual(users);
            });

            it('should handle multiple properties', function() {
                expect(filter(users, ['user.first_name', 'user.last_name'], 'ba', true)).toEqual([]);
                expect(filter(users, ['user.first_name', 'user.last_name'], 'bar', true)).toEqual(users);
            });

            it('should handle concatenation', function() {
                expect(filter(users, ['user.first_name + user.last_name'], 'foo ba', true)).toEqual([]);
                expect(filter(users, ['user.first_name + user.last_name'], 'foo bar', true)).toEqual(users);
            });
        });
    });

    'use strict';

    describe('firstFilter', function() {

        var filter;

        beforeEach(module('craft.first'));

        beforeEach(inject(function($filter) {
            filter = $filter('first');
        }));

        it('should return the first member in a collection', function() {
            expect(filter([1,2,3,4,5])).toEqual(1);
            expect(filter(['a', 'b', 'c', 'd'])).toEqual('a');
            expect(filter([undefined, null, null])).toEqual(undefined);
            expect(filter({0: 'foo', 1: 'bar'})).toEqual('foo');
        });

        it('should return first n elements of a collection', function() {
            expect(filter([1,2,3,4,5], 3)).toEqual([1,2,3]);
            expect(filter([undefined, null, null], 1)).toEqual([undefined]);
            expect(filter({0: 'foo', 1: 'bar'}, 2)).toEqual(['foo', 'bar']);
        });

        it('should return the first element that match the expression', function() {
            var users = [
                { id: 1, name: { first: 'foo', last: 'bar' } },
                { id: 2, name: { first: 'baz', last: 'bar' } },
                { id: 3, name: { first: 'bar', last: 'bar' } },
                { id: 4, name: { first: 'lol', last: 'bar' } }
            ];

            expect(filter(users, 'name.first === name.last')).toEqual([ users[2] ]);
            expect(filter(users, '!(id % 2)')).toEqual([ users[1] ]);
            expect(filter(users, 'name.first === \'lol\' && name.last === \'bar\'')).toEqual([ users[3] ]);
            expect(filter(users, 'id > 5')).toEqual([]);
        });

        it('should return the first n element that match the expression', function() {
            var users = [
                { id: 1, name: { first: 'foo', last: 'bar' } },
                { id: 2, name: { first: 'baz', last: 'bar' } },
                { id: 3, name: { first: 'bar', last: 'bar' } },
                { id: 4, name: { first: 'lol', last: 'bar' } }
            ];

            expect(filter(users, 2, 'name.first === name.last')).toEqual([ users[2] ]);
            expect(filter(users, 2, '!(id % 2)')).toEqual([ users[1], users[3] ]);
            expect(filter(users, 'id > 5')).toEqual([]);

            function mod2(elm) {
                return !(elm%2);
            }

            expect(filter([1, 2, 3, 4], 2, mod2)).toEqual([2, 4]);
            expect(filter([1, 2, 3, 4, 6], 2, mod2)).toEqual([2, 4]);
            expect(filter([1, 2], 2, mod2)).toEqual([2]);
        });

        it('should get !collection and return it as-is', function() {
            expect(filter('string')).toEqual('string');
            expect(filter(1010)).toEqual(1010);
            expect(filter(!0)).toBeTruthy();
        });

    });

    'use strict';

    describe('flattenFilter', function() {
        var filter;

        beforeEach(module('craft.flatten'));

        beforeEach(inject(function($filter) {
            filter = $filter('flatten');
        }));

        it('should get a multiple nested array and return it flatten', function() {
            expect(filter([[[[[0]]]]])).toEqual([0]);

            expect(filter([[], 'A', 'B', ['C', 'D'], ['E', ['F'], []]]))
                .toEqual(['A', 'B', 'C', 'D', 'E', 'F']);

            expect(filter([[[[null]]], [[null]], [null]]))
                .toEqual([null, null, null]);

            expect(filter([[], 1, 2, 3, [4, 5, 6, [7, 8, 9, [10, 11, [12, [[[[[13], [[[[14, 15]]]]]]]]]]]]]))
                .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        });

        it('should have ability to get object as a collection', function() {
            expect(filter({ 0: 1, 1: 2, 2: [3, 4], 3: [5, [6, 7, [8]]] }))
                .toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
            expect(filter({}))
                .toEqual([]);
        });

        it('should flattened a single level, if shallow set to true', function() {
            expect(filter(['out', ['out', ['in']], ['out', 'out', ['in', 'in']], ['out', 'out']], true))
                .toEqual(['out', 'out', ['in'], 'out', 'out', ['in', 'in'], 'out', 'out']);
            expect(filter([[], 1, [1, [0, [0, [0]]], 1, [0]], 1, [1, [0]]], true))
                .toEqual([1, 1, [0, [0, [0]]], 1, [0], 1, 1, [0]]);
        });

        it('should get !collection, and return it as-is', function() {
            expect(filter('string')).toEqual('string');
            expect(filter(1, true)).toEqual(1);
            expect(filter(~~undefined)).toEqual(0);
            expect(filter(null)).toEqual(null);
        });

    });

    'use strict';

    describe('fuzzyByFilter', function() {
        var filter,
            collection = [
                { title: 'The DaVinci Code' },
                { title: 'The Great Gatsby' },
                { title: 'Angels & Demons'  },
                { title: 'The Lost Symbol'  },
                { title: 'Old Man\'s War'   }
            ];

        beforeEach(module('craft.fuzzy-by'));

        beforeEach(inject(function ($filter) {
            filter = $filter('fuzzyBy');
        }));

        it('should get array as collection, property, search, and filter by fuzzy searching', function() {

            expect(filter(collection, 'title', 'tha')).toEqual([collection[0], collection[1]]);
            expect(filter(collection, 'title', 'thesy')).toEqual([collection[1], collection[3]]);
            expect(filter(collection, 'title', 'omwar')).toEqual([collection[4]]);


        });

        it('should be case sensitive if set to true', function() {

            expect(filter(collection, 'title', 'tha', true)).toEqual([]);
            expect(filter(collection, 'title', 'thesy', true)).toEqual([]);
            expect(filter(collection, 'title', 'omwar', true)).toEqual([]);

            expect(filter(collection, 'title', 'TDC', true)).toEqual([collection[0]]);
            expect(filter(collection, 'title', 'ThLSy', true)).toEqual([collection[3]]);
            expect(filter(collection, 'title', 'OldWar', true)).toEqual([collection[4]]);

        });

        it('should support nested properties', function() {

            collection = [
                { details: { title: 'The DaVinci Code' } },
                { details: { title: 'The Great Gatsby' } },
                { details: { title: 'Angels & Demons'  } },
                { details: { title: 'The Lost Symbol'  } },
                { details: { title: 'Old Man\'s War'   } }
            ];

            expect(filter(collection, 'details.title', 'tha')).toEqual([collection[0], collection[1]]);
            expect(filter(collection, 'details.title', 'thesy')).toEqual([collection[1], collection[3]]);
            expect(filter(collection, 'details.title', 'omwar')).toEqual([collection[4]]);

        });

        it('should not get a property and return the collection as-is', function() {

            var array = [{ name: 'foo' }];

            expect(filter(array)).toEqual(array);

        });

        it('should get a !collection and return it as-is', function() {

            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');

        });

    });

    'use strict';

    describe('fuzzyFilter', function() {
        var filter,
            collection = [
                { title: 'The DaVinci Code', author: 'F. Scott Fitzgerald' },
                { title: 'The Great Gatsby', author: 'Dan Browns' },
                { title: 'Angels & Demons',  author: 'Dan Louis' },
                { title: 'The Lost Symbol',  author: 'David Maine' },
                { title: 'Old Man\'s War',   author: 'Rob Grant' }
            ];

        beforeEach(module('craft.fuzzy'));

        beforeEach(inject(function ($filter) {
            filter = $filter('fuzzy');
        }));

        it('should get array as collection, search, and filter by fuzzy searching', function() {

            //search by title
            expect(filter(collection, 'tha')).toEqual([collection[0], collection[1]]);
            expect(filter(collection, 'thesy')).toEqual([collection[1], collection[3]]);
            expect(filter(collection, 'omwar')).toEqual([collection[4]]);

            //search by author
            expect(filter(collection, 'sfd')).toEqual([collection[0]]);
            expect(filter(collection, 'danos')).toEqual([collection[1], collection[2]]);
            expect(filter(collection, 'rgnt')).toEqual([collection[4]]);

        });

        it('should be case sensitive if set to true', function() {

            expect(filter(collection, 'tha', true)).toEqual([]);
            expect(filter(collection, 'thesy', true)).toEqual([]);
            expect(filter(collection, 'omwar', true)).toEqual([]);

            expect(filter(collection,'TDC', true)).toEqual([collection[0]]);
            expect(filter(collection,'ThLSy', true)).toEqual([collection[3]]);
            expect(filter(collection,'OldWar', true)).toEqual([collection[4]]);

        });

        it('should get array of strings, search, and filter by fuzzy searching', function() {

            var array = ['Dan Brown', 'Dan Louis', 'David Maine', 'Rob Grant', 'F. Scott Fitzgerald'];

            expect(filter(array)).toEqual(array);
            expect(filter(array, 'da')).toEqual([ 'Dan Brown', 'Dan Louis', 'David Maine' ]);
            expect(filter(array, 'oa')).toEqual([ 'Rob Grant', 'F. Scott Fitzgerald' ]);
            expect(filter(array, 'S', true)).toEqual([ 'F. Scott Fitzgerald' ]);

        });

        it('should not get a search and return the collection as-is', function() {

            var array = [{ name: 'foo' }];

            expect(filter(array)).toEqual(array);

        });

        it('should get a !collection and return it as-is', function() {

            expect(filter(!1)).toBeFalsy();
            expect(filter(1)).toEqual(1);
            expect(filter('string')).toEqual('string');

        });

    });

    'use strict';

    describe('groupByFilter', function() {
        var filter;

        beforeEach(module('craft.group-by'));
        beforeEach(inject(function ($filter) {
            filter = $filter('groupBy');
        }));

        it('should get array as collection, property(nested to) as identifier and ' +
            'returns the composed aggregate object.', function() {

            var players = [
                {name: 'Gene', team: 'alpha'},
                {name: 'George', team: 'beta'},
                {name: 'Steve', team: 'gamma'},
                {name: 'Paula', team: 'beta'},
                {name: 'Scruath', team: 'gamma'}
            ];

            expect(filter(players, 'team')).toEqual( {
                alpha: [players[0]],
                beta: [players[1], players[3]],
                gamma: [players[2], players[4]]
            });
        });

        it('should support nested properties to', function() {
            var orders = [
                { id:10, customer: { name: 'foo', id: 1 } },
                { id:11, customer: { name: 'bar', id: 2 } },
                { id:12, customer: { name: 'foo', id: 1 } },
                { id:13, customer: { name: 'bar', id: 2 } },
                { id:14, customer: { name: 'bar', id: 3 } },
                2, null, true
            ];

            expect(filter(orders, 'customer.name')).toEqual( {
                foo: [orders[0], orders[2]],
                bar: [orders[1], orders[3], orders[4]],
                undefined: [2, null, true]
            });
        });


        it('should get object as collection, property(nested to) as identifier and ' +
            'returns the composed aggregate object.', function() {
            var dataObject = {
                0: { id: 1, data: {} },
                1: { id: 1, data: {} },
                2: { id: 2, data: {} },
                3: { id: 2, data: {} }
            };

            expect(filter(dataObject, 'id')).toEqual({
                1: [dataObject[0], dataObject[1]],
                2: [dataObject[2], dataObject[3]]
            });
        });

        it('should get !collection and return it as-is ', function() {
            expect(filter('string')).toEqual('string');
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
            expect(filter(null)).toBeNull();
        });

        describe('inside the DOM', function() {
            it('should not throw and not trigger the infinite digest exception',
                inject(function($rootScope, $compile) {
                    var scope = $rootScope.$new();
                    scope.players = [
                        { name: 'foo', team: 'a' },
                        { name: 'lol', team: 'b' },
                        { name: 'bar', team: 'b' },
                        { name: 'baz', team: 'a' }
                    ];
                    scope.search = '';
                    var elm = angular.element(
                        '<ul>' +
                        '<li ng-repeat="(key, val) in players | filter: search | groupBy: \'team\'">' +
                        '{{ key }}' +
                        '<p ng-repeat="v in val"> {{ v }}</p>' +
                        '</li>' +
                        '</ul>'
                    );
                    var temp = $compile(elm)(scope);
                    expect(function() { scope.$digest() }).not.toThrow();
                    expect(temp.children().length).toEqual(2);
                }));
        });
    });

    'use strict';

    describe('isEmptyFilter', function() {
        var filter;

        beforeEach(module('craft.is-empty'));

        beforeEach(inject(function ($filter) {
            filter = $filter('isEmpty');
        }));

        it('should get collection or string, and return true if it empty', function() {

            expect(filter([])).toBeTruthy();
            expect(filter({})).toBeTruthy();
            expect(filter('')).toBeTruthy();

            expect(filter([1,2])).toBeFalsy();
            expect(filter({foo: 'bar'})).toBeFalsy();
            expect(filter('lorem ipsum')).toBeFalsy();

        });

    });

    'use strict';

    describe('isJoinFilter', function () {
        var joinFilter;

        beforeEach(module('craft.join'));

        beforeEach(inject(function (_joinFilter_) {
            joinFilter = _joinFilter_;
        }));

        describe('given a collection', function () {
            var arr;

            describe('which is empty', function () {
                beforeEach(function () {
                    arr = [];
                });

                it('should return an empty string', function () {
                    expect(joinFilter(arr)).toEqual('');
                });

            });

            describe('of strings', function () {
                beforeEach(function () {
                    arr = ['hello', 'world'];
                });

                describe('with no delimiter', function () {
                    it('should join elements with a space', function () {
                        expect(joinFilter(arr)).toEqual('hello world');
                    });
                });

                describe('with a custom delimiter', function () {
                    var delim;

                    describe('which is not a string', function () {
                        it('should join elements with a toString representation of the delimiter', function () {
                            delim = true;
                            expect(joinFilter(arr, delim)).toEqual('hellotrueworld');

                            delim = 10;
                            expect(joinFilter(arr, delim)).toEqual('hello10world');

                            delim = {toString: function () { return ' - ' }}
                            expect(joinFilter(arr, delim)).toEqual('hello - world');
                        });
                    });

                    it('should join elements with the given delimiter', function () {
                        delim = ', '
                        expect(joinFilter(arr, delim)).toEqual('hello, world');
                    });
                });
            });

        });

        describe('given something that is not a collection', function () {
            var str, obj, bool, num;
            beforeEach(function () {
                str = 'string';
                obj = {'a': 'b'};
                bool = true;
                num = 5;
            });

            it('should return the input as is', function () {
                expect(joinFilter(str)).toEqual(str);
                expect(joinFilter(obj)).toEqual(obj);
                expect(joinFilter(bool)).toEqual(bool);
                expect(joinFilter(num)).toEqual(num);
            });
        });
    });

    'use strict';

    describe('lastFilter', function() {

        var filter;

        beforeEach(module('craft.last'));

        beforeEach(inject(function($filter) {
            filter = $filter('last');
        }));

        it('should return the last member in a collection', function() {
            expect(filter([1,2,3,4,5])).toEqual(5);
            expect(filter(['a', 'b', 'c', 'd'])).toEqual('d');
            expect(filter([undefined, null, null])).toEqual(null);
            expect(filter({0: 'foo', 1: 'bar'})).toEqual('bar');
        });

        it('should return last n elements of a collection', function() {
            expect(filter([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
            expect(filter([undefined, null, null], 2)).toEqual([null, null]);
            expect(filter({0: 'foo', 1: 'bar'}, 2)).toEqual(['foo', 'bar']);
        });

        it('should return the last element that match the expression', function() {
            var users = [
                { id: 1, name: { first: 'foo', last: 'bar' } },
                { id: 2, name: { first: 'baz', last: 'bar' } },
                { id: 3, name: { first: 'bar', last: 'bar' } },
                { id: 4, name: { first: 'lol', last: 'bar' } }
            ];

            expect(filter(users, 'name.first === name.last')).toEqual([ users[2] ]);
            expect(filter(users, '!(id % 2)')).toEqual([ users[3] ]);
            expect(filter(users, 'name.first !== \'lol\' && name.last === \'bar\'')).toEqual([ users[2] ]);
            expect(filter(users, 'id > 5')).toEqual([]);
        });

        it('should return the last n element that match the expression', function() {
            var users = [
                { id: 1, name: { first: 'foo', last: 'bar' } },
                { id: 2, name: { first: 'baz', last: 'bar' } },
                { id: 3, name: { first: 'bar', last: 'bar' } },
                { id: 4, name: { first: 'lol', last: 'bar' } }
            ];

            expect(filter(users, 2, 'name.first !== name.last')).toEqual([users[1], users[3]]);
            expect(filter(users, 2, '(id % 2)')).toEqual([users[0], users[2]]);
            expect(filter(users, 'id > 5')).toEqual([]);

            function mod2(elm) {
                return !(elm%2);
            }

            expect(filter([1, 2, 3, 4, 5, 6], 2, mod2)).toEqual([4, 6]);
            expect(filter([1, 2, 3, 4, 6, 11], 2, mod2)).toEqual([4, 6]);
            expect(filter([2,1], 2, mod2)).toEqual([2]);
        });

        it('should get !collection and return it as-is', function() {
            expect(filter('string')).toEqual('string');
            expect(filter(1010)).toEqual(1010);
            expect(filter(!0)).toBeTruthy();
        });

    });

    'use strict';

    describe('mapFilter', function() {
        var filter;

        beforeEach(module('craft.map'));

        beforeEach(inject(function ($filter) {
            filter = $filter('map');
        }));

        it('should returns a new collection of the results of each expression execution', function() {

            var array = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, 'name')).toEqual(['foo', 'baz', 'ariel', 'bar']);
            expect(filter(array, 'id === 1 && name === "foo"')).toEqual([true, false, false, false]);
            expect(filter(array)).toEqual(array);

        });

        it('should get object as a collection and filter by expression', function() {

            var object = {
                0: { id: 1, name: 'foo' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, 'name')).toEqual(['foo', 'baz', 'ariel', 'bar']);
            expect(filter(object, 'id === 1 && name === "foo"')).toEqual([true, false, false, false]);
            expect(filter(object)).toEqual([object[0], object[1], object[2], object[3]]);

        });

        it('should get function ad expression', function() {

            var array = [1, 2, 3, 4, 5];

            function divide(elm) {
                return (elm/2);
            }

            expect(filter(array, divide)).toEqual([0.5, 1, 1.5, 2, 2.5]);

        });

        it('should get !collection and return it as-is', function() {

            expect(filter('lorem ipsum')).toEqual('lorem ipsum');
            expect(filter(1, null)).toEqual(1);
            expect(filter(!1)).toBeFalsy();

        });

    });

    'use strict';

    describe('omitFilter', function() {
        var filter;

        beforeEach(module('craft.omit'));

        beforeEach(inject(function ($filter) {
            filter = $filter('omit');
        }));

        it('should get array as a collection and filter by expression', function() {

            var array = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, 'id === 1')).toEqual([array[1]]);
            expect(filter(array, 'id === 1 && name === "foo"')).toEqual([array[1], array[2], array[3]]);
            expect(filter(array)).toEqual(array);

        });

        it('should get object as a collection and filter by expression', function() {

            var object = {
                0: { id: 1, name: 'foo' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, 'id === 1')).toEqual([object[1]]);
            expect(filter(object, 'id === 1 && name === "foo"')).toEqual([object[1], object[2], object[3]]);
            expect(filter(object, 'name === german')).toEqual([object[0], object[1], object[2], object[3]]);

        });

        it('should get function ad expression', function() {

            var array = [1, 2, 3, 4, 5];

            function mod2(elm) {
                return !(elm % 2);
            }

            expect(filter(array, mod2)).toEqual([1, 3, 5]);

        });

        it('should get !collection and return it as-is', function() {

            expect(filter('lorem ipsum')).toEqual('lorem ipsum');
            expect(filter(1, null)).toEqual(1);
            expect(filter(!1)).toBeFalsy();

        });

    });

    'use strict';

    describe('pickFilter', function() {
        var filter;

        beforeEach(module('craft.pick'));

        beforeEach(inject(function ($filter) {
            filter = $filter('pick');
        }));

        it('should get array as a collection and filter by expression', function() {

            var array = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, 'id === 2')).toEqual([array[1]]);
            expect(filter(array, 'id === 1 && name === "foo"')).toEqual([array[0]]);
            expect(filter(array)).toEqual(array);

        });

        it('should get object as a collection and filter by expression', function() {

            var object = {
                0: { id: 1, name: 'foo' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, 'id === 1')).toEqual([object[0], object[2], object[3]]);
            expect(filter(object, 'id === 1 && name === "foo"')).toEqual([object[0]]);
            expect(filter(object, 'name === german')).toEqual([]);

        });

        it('should get function ad expression', function() {

            var array = [1, 2, 3, 4, 5];

            function mod2(elm) {
                return !(elm % 2);
            }

            expect(filter(array, mod2)).toEqual([2, 4]);

        });

        it('should get !collection and return it as-is', function() {

            expect(filter('lorem ipsum')).toEqual('lorem ipsum');
            expect(filter(1, null)).toEqual(1);
            expect(filter(!1)).toBeFalsy();

        });

    });

    'use strict';

    describe('rangeFilter', function() {
        var filter;

        beforeEach(module('craft.range'));
        beforeEach(inject(function ($filter) {
            filter = $filter('range');
        }));

        it('should return an array of 10 items', function() {
            expect(filter([], 10)).toEqual([0,1,2,3,4,5,6,7,8,9]);
            expect(filter([], 10).length).toEqual(10);
        });

        it('should return 10 items starting at 10 incrementing by 1', function() {
            expect(filter([], 10, 10)).toEqual([10,11,12,13,14,15,16,17,18,19]);
            expect(filter([], 10).length).toEqual(10);
        });

        it('should return 10 items starting at 10 incrementing by 10 ', function() {
            expect(filter([], 10, 10, 10)).toEqual([10,20,30,40,50,60,70,80,90,100]);
            expect(filter([], 10).length).toEqual(10);
        });

        it('should return 10 items starting at 10 incrementing by 10 and multiplied by 2.', function() {
            expect(filter([], 10, 10, 10, function(n) { return 2 * n; }))
                .toEqual([20,40,60,80,100,120,140,160,180,200]);
            expect(filter([], 10).length).toEqual(10);
        });

    });
    'use strict';

    describe('removeWithFilter', function() {
        var filter;

        beforeEach(module('craft.remove-with'));

        beforeEach(inject(function ($filter) {
            filter = $filter('removeWith');
        }));

        it('should get array and properties object and return' +
            'array filtered by equivalent property values.', function() {

            var array = [
                { id: 1, name: 'ariel' },
                { id: 2, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, { id: 1 })).toEqual([{ id: 2, name: 'baz' }]);
            expect(filter(array, { id: 1, name: 'ariel' })).toEqual([{ id: 2, name: 'baz' }, { id: 1, name: 'bar' }]);

            expect(filter(array, {})).toEqual([]);

        });

        it('should get object and properties object and return' +
            'array of all elements that have equivalent property values.', function() {

            var object = {
                0: { id: 1, name: 'ariel' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, { id: 1 })).toEqual([ object[1] ]);
            expect(filter(object, { id: 1 , name: 'ariel' })).not.toContain(object[0]);

            expect(filter(object, {}).length).toEqual(0);

        });

        it('should not get properties object and return the collection as is', function() {

            expect(filter([{ a: 1 }])).toEqual([{ a:1 }]);
            expect(filter([{ a: 1 }, { b: 2 }])).toEqual([{ a:1 }, { b: 2 }]);

        });

        it('should get !collection and return it as-is', function() {
            expect(filter(999)).toEqual(999);
            expect(filter(!1)).toBeFalsy();
            expect(null).toEqual(null);
        });

    });

    'use strict';

    describe('removeFilter', function() {
        var filter;

        beforeEach(module('craft.remove'));

        beforeEach(inject(function ($filter) {
            filter = $filter('remove');
        }));

        it('should get array as a collection and members as an arguments' +
            'and remove them from collection', function() {

            var array = [
                { id: 1, name: 'ariel' },
                { id: 2, name: 'baz' },
                { id: 1, name: 'ariel' },
                { id: 1, name: 'bar' }
            ];

            expect(filter(array, { id: 1 , name: 'ariel' })).toEqual([{ id: 2, name: 'baz' }, { id: 1, name: 'bar' }]);
            expect(filter(array, { id: 1, name: 'ariel' }, { id: 1, name: 'bar' })).toEqual([{ id: 2, name: 'baz' }]);

            expect(filter([1,2,3, null], null, 2, 1)).toEqual([3]);

            expect(filter(array, {})).toEqual(array);

        });

        it('should get object as a collection and members as an arguments' +
            'and remove them from collection.', function() {

            var object = {
                0: { id: 1, name: 'ariel' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, { id: 1, name: 'ariel' })).toEqual([{ id: 2, name: 'baz' }, { id: 1, name: 'bar' }]);
            expect(filter(object, { id: 1 , name: 'ariel' })).not.toContain(object[0]);

            expect(filter(object, {}).length).toEqual(4);

        });

        it('should not arguments and return the collection as is', function() {

            expect(filter([{ a: 1 }])).toEqual([{ a:1 }]);
            expect(filter([{ a: 1 }, { b: 2 }])).toEqual([{ a:1 }, { b: 2 }]);

        });

        it('should get !collection and return it as-is', function() {

            expect(filter('lorem ipsum')).toEqual('lorem ipsum');
            expect(filter(1, null)).toEqual(1);

        });

    });

    'use strict';

    describe('reverseFilter', function() {
        var filter;

        beforeEach(module('craft.reverse'));

        beforeEach(inject(function ($filter) {
            filter = $filter('reverse');
        }));

        it('should get array as collection and return it revered', function() {

            var array = [1,2,3,4];

            expect(filter(array)).toEqual(array.reverse());
            expect(filter([1])).toEqual([1]);
            expect(filter(['foo', 'bar'])).toEqual(['bar', 'foo']);

        });

        it('should get object as collection and return it revered array', function() {

            var object = {
                0: { id: 1 },
                1: { id: 2 },
                2: { id: 3 }
            };

            expect(filter(object)).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);

        });

        it('should get string as a parameter and return it reversed', function() {

            expect(filter('foobar')).toEqual('raboof');
            expect(filter('Lorem Ipsum')).toEqual('muspI meroL');
            expect(filter('FOO, BAR, BAZ')).toEqual('ZAB ,RAB ,OOF');

        });

        it('should get !string and !collection and return it as-is', function() {

            expect(filter(999)).toEqual(999);
            expect(filter(!1)).toBeFalsy();
            expect(null).toEqual(null);

        });

    });

    'use strict';

    describe('searchFieldFilter', function() {
        var filter;

        beforeEach(module('craft.search-field'));

        beforeEach(inject(function ($filter) {
            filter = $filter('searchField');
        }));

        it('should get array as a collection, and several keys for searchFiled and' +
            'return new array with the new "searchField" property', function() {

            var input = [
                { first_name: 'Sharon', last_name: 'Melendez' },
                { first_name: 'Edmundo', last_name: 'Hepler' },
                { first_name: 'Marsha', last_name: 'Letourneau' }
            ];

            var output = [
                { first_name: 'Sharon', last_name: 'Melendez', searchField: 'Sharon Melendez' },
                { first_name: 'Edmundo', last_name: 'Hepler', searchField: 'Edmundo Hepler' },
                { first_name: 'Marsha', last_name: 'Letourneau', searchField: 'Marsha Letourneau' }
            ];

            expect(filter(input, 'first_name', 'last_name')).toEqual(output);

            expect(filter([{a: 'a', b: 'b'}], 'a', 'b')).toEqual([{a: 'a', b: 'b', searchField: 'a b'}]);

        });

        it('should support nested properties to', function() {

            var input = [
                { user: { first_name: 'Sharon', last_name: 'Melendez' } },
                { user: { first_name: 'Edmundo', last_name: 'Hepler' } },
                { user: { first_name: 'Marsha', last_name: 'Letourneau' } }
            ];

            var output = [
                { user: { first_name: 'Sharon', last_name: 'Melendez' }, searchField: 'Sharon Melendez' },
                { user: { first_name: 'Edmundo', last_name: 'Hepler' }, searchField: 'Edmundo Hepler' },
                { user: { first_name: 'Marsha', last_name: 'Letourneau' }, searchField: 'Marsha Letourneau' }
            ];

            var inputObject = { user: { details: { name: { first: 'Ariel', last: 'Mashraki' } } } },
                outputObject = { user: { details: { name: { first: 'Ariel', last: 'Mashraki' } } }, searchField: 'Ariel Mashraki' };

            expect(filter(input, 'user.first_name', 'user.last_name')).toEqual(output);

            expect(filter([inputObject], 'user.details.name.first', 'user.details.name.last')).toEqual([outputObject]);

        });

        it('should change the original/source collection', function() {

            var mutable = [{a: 'a', b: 'b'}];
            filter(mutable, 'a', 'b');

            expect(mutable).toEqual([{a: 'a', b: 'b', searchField: 'a b'}]);

        });

        it('should get !collection and return it as-is', function() {

            expect(filter('string', 'foo')).toEqual('string');
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
            expect(filter(null)).toBeNull();

        });

    });

    'use strict';

    describe('toArray', function() {
        var filter;

        beforeEach(module('craft.to-array'));

        beforeEach(inject(function($filter) {
            filter = $filter('toArray');
        }));

        it('should convert an object to an array of values', function() {
            var object = {
                0: { f: 'foo' },
                1: { b: 'bar' },
                2: { b: 'baz' }
            };

            expect(filter(object)).toEqual([object[0], object[1], object[2]]);

            expect(filter({ 0: 0, 1: 1, 2: 2 })).toEqual([0, 1, 2]);
        });

        it('should add $key property if addKey param is true', function() {
            var object = {
                0: { f: 'foo' },
                1: { b: 'bar' },
                2: { b: 'baz' }
            };

            expect(filter(object, true)).toEqual([
                { $key: '0', f: 'foo' },
                { $key: '1', b: 'bar' },
                { $key: '2', b: 'baz' }
            ]);
        });

        it('should get !object and return it as-is', function() {
            expect(filter(1)).toEqual(1);
            expect(filter(!0)).toBeTruthy();
            expect(filter('string')).toEqual('string');
            expect(filter(undefined)).toEqual(undefined);
        });

    });

    'use strict';

    describe('uniqFilter', function() {
        var filter;

        beforeEach(module('craft.unique'));
        beforeEach(inject(function ($filter) {
            filter = $filter('unique');
        }));


        it('should get a collection of primitives and return filtered collection', function() {
            //Boolean
            expect(filter([true, true, false, false, true])).toEqual([true, false]);
            //numbers
            expect(filter([1, 1, 2, 3, 4, 5, 5, 5, 5])).toEqual([1, 2, 3, 4, 5]);
            //strings
            expect(filter(["Ariel", "Ariel", "Ariel"])).toEqual(["Ariel"]);
        });

        it('should get array as collection, property(nested to) as identifier and filter', function() {

            var orders = [
                { id:10, customer: { name: 'foo', id: 1 } },
                { id:11, customer: { name: 'bar', id: 2 } },
                { id:12, customer: { name: 'foo', id: 1 } },
                { id:13, customer: { name: 'bar', id: 2 } },
                { id:14, customer: { name: 'baz', id: 3 } },
            ];

            var filteredOrders = [
                { id:10, customer: { name: 'foo', id: 1 } },
                { id:11, customer: { name: 'bar', id: 2 } },
                { id:14, customer: { name: 'baz', id: 3 } },
            ];

            expect(filter(orders, 'customer.id')).toEqual(filteredOrders);
            expect(filter(orders, 'customer.id').length).toEqual(filteredOrders.length);

            expect(filter(orders, 'customer.name')).toEqual(filteredOrders);
            expect(filter(orders, 'customer.name').length).toEqual(filteredOrders.length);

            expect(filter(orders, 'id')).toEqual(orders);
            expect(filter(orders, 'id').length).toEqual(orders.length);

        });

        it('should filtered by property and not touch members without this property', function() {

            var array = [
                { id: 1, person: { name: 'Ariel' , age: 25 } },
                { id: 2, person: { name: 'Joe' , age: 25 } },
                { id: 3, person: { name: 'Bob' , age: 42 } },
                { id: 4, person: { name: 'Marie' , age: 42 } },
                {}, [], 1,2, 'foo', true, null
            ];

            var filteredArray = [
                { id: 1, person: { name: 'Ariel' , age: 25 } },
                { id: 3, person: { name: 'Bob' , age: 42 } },
                {}, [], 1,2, 'foo', true, null
            ];

            //filter by person.age
            expect(filter(array, 'person.age')).toEqual(filteredArray);

            //should not touch members without this property
            expect(filter(array, 'id')).toEqual(array);

        });

        it('should get object as collection and return filtered collection', function() {

            var dataObject = {
                0: { id: 1, data: {} },
                1: { id: 1, data: {} },
                2: { id: 2, data: {} },
                3: { id: 2, data: {} }
            };
            var dataArray = [
                { id: 1, data: {} },
                { id: 2, data: {}}
            ];

            expect(filter(dataObject, 'id')).toEqual(dataArray);

        });

        it('should support advance nested properties', function() {
            var orders = [
                { order: { person: { credit: { information: { num: 99999 } } } } },
                { order: { person: { credit: { information: { num: 99999 } } } } },
                { order: { person: { credit: { information: { num: 99999 } } } } }
            ];
            expect(filter(orders, 'order.person.credit.information.num')).toEqual([orders[0]]);
        });

        it('should get a !collection and return as-is', function() {
            expect(filter(undefined)).toEqual(undefined);
            expect(filter('foo')).toEqual('foo');
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('whereFilter', function() {
        var filter;

        beforeEach(module('craft.where'));

        beforeEach(inject(function ($filter) {
            filter = $filter('where');
        }));

        it('should get array and properties object and return' +
            'array of all elements that have equivalent property values.', function() {

            var array = [
                { id: 0, name: 'ariel' },
                { id: 1, name: 'baz' },
                { id: 0, name: 'ariel' },
                { id: 0, name: 'bar' }
            ];

            expect(filter(array, { id: 0, name: 'ariel' })).toEqual([array[0], array[2]]);
            expect(filter(array, { id: 0 })).not.toContain(array[1]);

            expect(filter(array, {})).toEqual(array);

        });

        it('should get object and properties object and return' +
            'array of all elements that have equivalent property values.', function() {

            var object = {
                0: { id: 1, name: 'ariel' },
                1: { id: 2, name: 'baz' },
                2: { id: 1, name: 'ariel' },
                3: { id: 1, name: 'bar' }
            };

            expect(filter(object, { id: 1, name: 'ariel' })).toEqual([object[0], object[2]]);
            expect(filter(object, { id: 1 })).not.toContain(object[1]);

            expect(filter(object, {}).length).toEqual(4);

        });

        it('should not get properties object and return the collection as is', function() {

            expect(filter([{ a: 1 }])).toEqual([{ a:1 }]);
            expect(filter([{ a: 1 }, { b: 2 }])).toEqual([{ a:1 }, { b: 2 }]);

        });

        it('should get !collection and return it as-is', function() {
            expect(filter(999)).toEqual(999);
            expect(filter(!1)).toBeFalsy();
            expect(null).toEqual(null);
        });

    });

    'use strict';

    describe('xorFilter', function() {
        var filter;

        beforeEach(module('craft.xor'));

        beforeEach(inject(function($filter) {
            filter = $filter('xor');
        }));

        it('should get 2 array collection and return exclusive or between them', function() {
            expect(filter([1,2], [1])).toEqual([2]);
            expect(filter([1, 2, 3], [5, 2, 1, 4])).toEqual([3, 5, 4]);

            expect(filter([1, 2, 3], [4, 5])).toEqual([1, 2, 3, 4, 5]);
            expect(filter([1, 2, 3], [2, 3, 4])).toEqual([1, 4]);
        });

        it('should get objects as collection', function() {
            expect(filter({ 0: 1, 1: 2 }, { 0: 3 })).toEqual([1, 2, 3]);
            expect(filter({ 0: 1, 1: 2 }, { 0: 1 })).toEqual([2]);
        });

        it('should get an objects collection and filters by value', function() {

            var array = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'bar' },
                { id: 3, name: 'baz' }
            ];

            expect(filter(array, array)).toEqual([]); // A (xor) A
            expect(filter(array, [ { id: 1, name:'foo' } ])).toEqual([array[1], array[2]]);

            expect(filter(array, [ { id: 1 } ])).toEqual(
                array.concat([{ id: 1 }])
            );
        });

        it('should filter by specific property', function() {
            var users = [
                { id: 0, details: { first_name: 'foo', last_name: 'bar' } },
                { id: 1, details: { first_name: 'foo', last_name: 'baz' } },
                { id: 2, details: { first_name: 'foo', last_name: 'bag' } }
            ];

            expect(filter(users, [{ details: { first_name: 'foo' } }], 'details.first_name'))
                .toEqual([]);
            expect(filter(users, [{ id: 0 }, { id: 1 }], 'id')).toEqual([users[2]]);

            expect(filter(users, [{ id: 3, details: { first_name: 'foo', last_name: 'bag' }}], 'id'))
                .toEqual(
                    users.concat([{ id: 3, details: { first_name: 'foo', last_name: 'bag' }}]
                    ));
        });

        it('should filter by expression', function() {
            expect(filter([ { id: 2 }, { id: 3 }], [ { id: 4 } ], 'id % 2')).toEqual([{ id: 3 }]);
        });


        it('should get !collection and return it as-is', function() {
            expect(filter(999)).toEqual(999);
            expect(filter(!1)).toBeFalsy();
            expect(null).toEqual(null);
        });

    });

    'use strict';

    describe('absFilter', function () {

        var filter;

        beforeEach(module('craft.math.abs'));

        beforeEach(inject(function ($filter) {
            filter = $filter('abs');
        }));

        it('should return absolute values of any numbers inputted', function() {
            expect(filter(-123.45)).toEqual(123.45);
            expect(filter(123.45)).toEqual(123.45);
            expect(filter('-123.45')).toEqual(123.45);
            expect(filter('123.45')).toEqual(123.45);
        });
    });

    'use strict';

    describe('byteFmtFilter', function () {

        var filter;

        beforeEach(module('craft.math.byteFmt'));

        beforeEach(inject(function ($filter) {
            filter = $filter('byteFmt');
        }));

        it('should return the correct display from number of bytes', function() {
            expect(filter(0,2)).toEqual("0 B");
            expect(filter(5,2)).toEqual("5 B");
            expect(filter(1024,0)).toEqual("1 KB");
            expect(filter(1998,2)).toEqual("1.95 KB");
            expect(filter(1049901,5)).toEqual("1.00126 MB");
            expect(filter(909234901,1)).toEqual("867.1 MB");
            expect(filter(1339234901,5)).toEqual("1.24726 GB");
            expect(filter(23423234234,2)).toEqual("21.81 GB");
            expect(filter(23985391855616,2)).toEqual("21.81 TB");
            expect(filter(95340189555097611,1)).toEqual("84.7 PB");
            expect(filter(2249548013871562752,3)).toEqual("1.951 EB");
            expect(filter(5180591620717411303425,2)).toEqual("4.39 ZB");
            expect(filter(5123980591620717411303425,2)).toEqual("4.24 YB");
        });

        it('should return NaN if bytes is not a number', function(){
            expect(filter("0",2)).toEqual("NaN");
            expect(filter([0],2)).toEqual("NaN");
            expect(filter({number:0},0)).toEqual("NaN");
        });

        it('should return NaN if decimal point is less than zero or not a number', function(){
            expect(filter(0.45,-1)).toEqual("NaN");
            expect(filter(-0.25,-101)).toEqual("NaN");
            expect(filter(0.45,1.3)).toEqual("NaN");
            expect(filter(0.45,"0")).toEqual("NaN");
            expect(filter(0.45,[3])).toEqual("NaN");
            expect(filter(0.45,{num : 4})).toEqual("NaN");
        });

    });

    'use strict';

    describe('degreesFilter', function () {

        var filter;

        beforeEach(module('craft.math.degrees'));

        beforeEach(inject(function ($filter) {
            filter = $filter('degrees');
        }));

        it('should return the correct degrees from radians', function() {
            expect(filter(1.5,2)).toEqual(85.94);
            expect(filter(0,0)).toEqual(0);
            expect(filter(0.3235,0)).toEqual(19);
            expect(filter(0.8222235,5)).toEqual(47.10994);
            expect(filter(-0.8222235,5)).toEqual(-47.10994);
            expect(filter(45,2)).toEqual(2578.31);

        });

        it('should return NaN if radians is not a number', function(){
            expect(filter('0',2)).toEqual('NaN');
            expect(filter([0],2)).toEqual('NaN');
            expect(filter({number:0},0)).toEqual('NaN');
        });

        it('should return NaN if decimal point is less than zero or not a number', function(){
            expect(filter(0.45,-1)).toEqual('NaN');
            expect(filter(-0.25,-101)).toEqual('NaN');
            expect(filter(0.45,1.3)).toEqual('NaN');
            expect(filter(0.45,'0')).toEqual('NaN');
            expect(filter(0.45,[3])).toEqual('NaN');
            expect(filter(0.45,{num : 4})).toEqual('NaN');
        });
    });

    'use strict';

    describe('kbFmtFilter', function () {

        var filter;

        beforeEach(module('craft.math.kbFmt'));

        beforeEach(inject(function ($filter) {
            filter = $filter('kbFmt');
        }));

        it('should return the correct display from number of kilobytes', function() {
            expect(filter(0,2)).toEqual("0 KB");
            expect(filter(5,2)).toEqual("5 KB");
            expect(filter(1024,0)).toEqual("1 MB");
            expect(filter(1998,2)).toEqual("1.95 MB");
            expect(filter(1049901,5)).toEqual("1.00126 GB");
            expect(filter(909234901,1)).toEqual("867.1 GB");
            expect(filter(1339234901,5)).toEqual("1.24726 TB");
            expect(filter(23423234234,2)).toEqual("21.81 TB");
            expect(filter(23985391855616,2)).toEqual("21.81 PB");
            expect(filter(95340189555097611,1)).toEqual("84.7 EB");
            expect(filter(2249548013871562752,3)).toEqual("1.951 ZB");
            expect(filter(5180591620717411303425,2)).toEqual("4.39 YB");
            expect(filter(5123980591620717411303425,2)).toEqual("4340.18 YB");
        });

        it('should return NaN if kilobytes is not a number', function(){
            expect(filter("0",2)).toEqual("NaN");
            expect(filter([0],2)).toEqual("NaN");
            expect(filter({number:0},0)).toEqual("NaN");
        });

        it('should return NaN if decimal point is less than zero or not a number', function(){
            expect(filter(0.45,-1)).toEqual("NaN");
            expect(filter(-0.25,-101)).toEqual("NaN");
            expect(filter(0.45,1.3)).toEqual("NaN");
            expect(filter(0.45,"0")).toEqual("NaN");
            expect(filter(0.45,[3])).toEqual("NaN");
            expect(filter(0.45,{num : 4})).toEqual("NaN");
        });

    });

    'use strict';

    describe('maxFilter', function () {

        var filter;

        beforeEach(module('craft.math.max'));

        beforeEach(inject(function ($filter) {
            filter = $filter('max');
        }));

        it('should get an array of numbers and return the biggest one', function() {
            expect(filter([1,2,3,4,5])).toEqual(5);
            expect(filter([2,2,2,2,2])).toEqual(2);
            expect(filter([1])).toEqual(1);
        });

        it('should get an array and expression and return an object', function() {
            var users = [
                { user: { score: 988790 } },
                { user: { score: 123414 } },
                { user: { rank : 988999 } },
                { user: { score: 987621 } }
            ];
            expect(filter(users, 'user.score || user.rank')).toEqual(users[2]);
            expect(filter(users, 'user.score || 0')).toEqual(users[0]);
        });

        it('should get an !array and return it as-is', function() {
            expect(filter('string')).toEqual('string');
            expect(filter({})).toEqual({});
            expect(filter(!0)).toBeTruthy();
        });

    });

    'use strict';

    describe('minFilter', function () {

        var filter;

        beforeEach(module('craft.math.min'));

        beforeEach(inject(function ($filter) {
            filter = $filter('min');
        }));

        it('should get an array of numbers and return the lowest one', function() {
            expect(filter([1,2,3,4,5])).toEqual(1);
            expect(filter([2,0,2,2,2])).toEqual(0);
            expect(filter([1])).toEqual(1);
        });

        it('should get an array and expression and return an object', function() {
            var users = [
                { user: { score: 988790 } },
                { user: { score: 123414 } },
                { user: { rank : 100000 } },
                { user: { score: 987621 } }
            ];
            expect(filter(users, 'user.score || user.rank')).toEqual(users[2]);
            expect(filter(users, 'user.score || 1e9')).toEqual(users[1]);
        });


        it('should get an !array and return it as-is', function() {
            expect(filter('string')).toEqual('string');
            expect(filter({})).toEqual({});
            expect(filter(!0)).toBeTruthy();
        });

    });

    'use strict';

    describe('percentFilter', function () {

        var filter;

        beforeEach(module('craft.math.percent'));

        beforeEach(inject(function ($filter) {
            filter = $filter('percent');
        }));

        it('should return percentage between two numbers', function() {

            expect(filter(10, 100)).toEqual(10);
            expect(filter(1, 100)).toEqual(1);
            expect(filter(23, 500)).toEqual(4.6);

        });

        it('should get string as a number', function() {

            expect(filter('20', 400)).toEqual(5);
            expect(filter('100', 100)).toEqual(100);

        });

        it('should return a round number if set to true', function() {

            expect(filter('20.2', 400, true)).toEqual(5);
            expect(filter('100.3', 100, true)).toEqual(100);
            expect(filter(23.4, 100, true)).toEqual(23);

        });

        it('should set divided to 100, if not defined', function() {

            expect(filter(32)).toEqual(32);
            expect(filter(200)).toEqual(200);

        });

        it('should get a !number and return it as-is', function() {

            expect(filter('string')).toEqual('string');
            expect(filter({})).toEqual({});
            expect(filter(!0)).toBeTruthy();
            expect(filter([])).toEqual([]);

        });

    });

    'use strict';

    describe('radiansFilter', function () {

        var filter;

        beforeEach(module('craft.math.radians'));

        beforeEach(inject(function ($filter) {
            filter = $filter('radians');
        }));

        it('should return the correct radians from degrees', function() {
            expect(filter(180,2)).toEqual(3.14);
            expect(filter(180,0)).toEqual(3);
            expect(filter(50,2)).toEqual(0.87);
            expect(filter(130,2)).toEqual(2.27);
            expect(filter(-30,4)).toEqual(-0.5236);
            expect(filter(1030,5)).toEqual(17.97689);
        });

        it('should return NaN if degrees is not a number', function(){
            expect(filter("0",2)).toEqual("NaN");
            expect(filter([0],2)).toEqual("NaN");
            expect(filter({number:0},0)).toEqual("NaN");
        });

        it('should return NaN if decimal point is less than zero or not a number', function(){
            expect(filter(45,-1)).toEqual("NaN");
            expect(filter(-25,-101)).toEqual("NaN");
            expect(filter(45,1.3)).toEqual("NaN");
            expect(filter(45,"0")).toEqual("NaN");
            expect(filter(45,[3])).toEqual("NaN");
            expect(filter(45,{num : 4})).toEqual("NaN");
        });

    });

    'use strict';

    describe('radixFilter', function () {

        var filter;

        beforeEach(module('craft.math.radix'));

        beforeEach(inject(function ($filter) {
            filter = $filter('radix');
        }));

        it('should converting decimal numbers to different bases(radix)', function() {
            expect(filter(8, 2)).toEqual('1000');
            expect(filter(15, 16)).toEqual('F');
            expect(filter(32586, 16)).toEqual('7F4A');
            expect(filter(32, 8)).toEqual('40');
        });

        it('should not be able to convert base less than 2 , and bigger than 36', function() {
            expect(filter(998, 37)).toEqual(998);
            expect(filter(15, 1)).toEqual(15);
        });

        it('should get a !number and return it as-is', function() {

            expect(filter('string')).toEqual('string');
            expect(filter({})).toEqual({});
            expect(filter(!0)).toBeTruthy();

        });

    });

    'use strict';

    describe('shortFmtFilter', function () {

        var filter;

        beforeEach(module('craft.math.shortFmt'));

        beforeEach(inject(function ($filter) {
            filter = $filter('shortFmt');
        }));

        it('should return the correct display from the number', function() {
            expect(filter(0,2)).toEqual('0');
            expect(filter(5,2)).toEqual('5');
            expect(filter(1024,0)).toEqual("1 K");
            expect(filter(1993,2)).toEqual("1.99 K");
            expect(filter(1049901,5)).toEqual("1.0499 M");
            expect(filter(1909234901,2)).toEqual("1.91 B");

        });

        it('should return NaN if bytes is not a number', function(){
            expect(filter("0",2)).toEqual("NaN");
            expect(filter([0],2)).toEqual("NaN");
            expect(filter({number:0},0)).toEqual("NaN");
        });

        it('should return NaN if decimal point is less than zero or not a number', function(){
            expect(filter(0.45,-1)).toEqual("NaN");
            expect(filter(-0.25,-101)).toEqual("NaN");
            expect(filter(0.45,1.3)).toEqual("NaN");
            expect(filter(0.45,"0")).toEqual("NaN");
            expect(filter(0.45,[3])).toEqual("NaN");
            expect(filter(0.45,{num : 4})).toEqual("NaN");
        });

    });

    'use strict';

    describe('sumFilter', function () {

        var filter;

        beforeEach(module('craft.math.sum'));

        beforeEach(inject(function ($filter) {
            filter = $filter('sum');
        }));

        it('should return the sum of all members in array', function() {
            expect(filter([1,2,3,4,5,6])).toEqual(21);
            expect(filter([0,0,0,0,0,1])).toEqual(1);
        });

        it('should be able to get an initial value', function() {
            expect(filter([2,3,5], 10)).toEqual(20);
            expect(filter([2,3,5], -10)).toEqual(0);
        });

        it('should return a string if the members type != number', function() {
            expect(typeof filter([{}, 'string', 'foo'])).toEqual('string')
        });

        it('should return the input as-is if is not an array', function() {
            expect(filter('string')).toEqual('string');
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        })

    });

    'use strict';

    describe('endsWithFilter', function () {

        var filter;

        beforeEach(module('craft.ends-with'));

        beforeEach(inject(function ($filter) {
            filter = $filter('endsWith');
        }));

        it('should return whether string ends with the ends parameter', function() {

            expect(filter('string', 'g')).toBeTruthy();
            expect(filter('string', 'ing')).toBeTruthy();
            expect(filter('foo bar', 'BAR')).toBeTruthy();

            expect(filter('.JPG', '.jpg')).toBeTruthy();
            expect(filter('string', 'str')).toBeFalsy();
            expect(filter('string', 'fing')).toBeFalsy();
            expect(filter('foo bar', 'baz')).toBeFalsy();

        });

        it('should be case sensitive', function() {

            expect(filter('.JPG', '.jpg', true)).toBeFalsy();
            expect(filter('string', 'ING', true)).toBeFalsy();
            expect(filter('string', 'ING', false)).toBeTruthy();
            expect(filter('foo bar', 'Foo B', true)).toBeFalsy();

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('latinizeFilter', function () {

        var filter;

        beforeEach(module('craft.latinize'));

        beforeEach(inject(function ($filter) {
            filter = $filter('latinize');
        }));

        it('should get a string and replace accents/diacritics with the ASCII equivalent', function() {
            expect(filter('a ç')).toEqual('a c');
            expect(filter('föo bàr baz')).toEqual('foo bar baz');
            expect(filter('Lòrém Ìpsûm dölôr sít Àmet')).toEqual('Lorem Ipsum dolor sit Amet');
        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('ltrimFilter', function () {

        var filter;

        beforeEach(module('craft.ltrim'));

        beforeEach(inject(function ($filter) {
            filter = $filter('ltrim');
        }));

        it('should strip whitespace from the beginning of a string', function() {

            expect(filter('   a')).toEqual('a');
            expect(filter('   foo bar   ')).toEqual('foo bar   ');
            expect(filter('   ')).toEqual('');

        });

        it('should strip specific chars from the beginning of a string', function() {

            expect(filter('__a__', '__')).toEqual('a__');
            expect(filter('//foo bar//', '//')).toEqual('foo bar//');
            expect(filter('barfoobar', 'bar')).toEqual('foobar');

            expect(filter('barfoobar', 'foo')).toEqual('barfoobar');

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('matchFilter', function () {

        var filter;

        beforeEach(module('craft.match'));

        beforeEach(inject(function ($filter) {
            filter = $filter('match');
        }));

        it('should test a string with given pattern', function() {

            expect(filter('15/12/2003', '\\d+', 'g')).toEqual(['15', '12', '2003']);
            expect(angular.equals(filter('foobarbaz', '[a-z]{3}'), ['foo'])).toBeTruthy();
            expect(filter('foobarbaz', '[a-z]{3}', 'g')).toEqual(['foo', 'bar', 'baz']);

        });

        it('should get a !string and return null', function() {
            expect(filter({})).toEqual(null);
            expect(filter([])).toEqual(null);
            expect(filter(1)).toEqual(null);
            expect(filter(!1)).toBeFalsy(null);
        });

    });

    'use strict';

    describe('phoneUSFilter', function () {

        var filter;

        beforeEach(module('craft.phoneUS'));

        beforeEach(inject(function ($filter) {
            filter = $filter('phoneUS');
        }));

        it('should format a number as a US-style phone number', function () {
            expect(filter(1234567890)).toEqual('(123) 456-7890');
        });

        it('should format a string as a US-style phone number', function () {
            expect(filter('1234567890')).toEqual('(123) 456-7890');
        });

    });

    'use strict';

    describe('repeatFilter', function () {

        var filter;

        beforeEach(module('craft.repeat'));

        beforeEach(inject(function ($filter) {
            filter = $filter('repeat');
        }));

        it('should repeat a string  n times', function() {

            expect(filter('a')).toEqual('a');
            expect(filter('a', 3)).toEqual('aaa');
            expect(filter('a ', 3)).toEqual('a a a ');

            expect(filter('foo', 3)).toEqual('foofoofoo');

        });

        it('should add a separator if given', function() {

            expect(filter('foo', undefined, 'bar')).toEqual('foo');
            expect(filter('a', 3, '^')).toEqual('a^a^a');
            expect(filter('^', 2, '_')).toEqual('^_^');
            expect(filter('foo', 2, 'bar')).toEqual('foobarfoo');

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('rtrimFilter', function () {

        var filter;

        beforeEach(module('craft.rtrim'));

        beforeEach(inject(function ($filter) {
            filter = $filter('rtrim');
        }));

        it('should strip whitespace from the beginning of a string', function() {

            expect(filter('a   ')).toEqual('a');
            expect(filter('   foo bar   ')).toEqual('   foo bar');
            expect(filter('   ')).toEqual('');

        });

        it('should strip specific chars from the beginning of a string', function() {

            expect(filter('__a__', '__')).toEqual('__a');
            expect(filter('//foo bar//', '//')).toEqual('//foo bar');
            expect(filter('barfoobar', 'bar')).toEqual('barfoo');

            expect(filter('barfoobar', 'foo')).toEqual('barfoobar');

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('slugifyFilter', function () {

        var filter;

        beforeEach(module('craft.slugify'));

        beforeEach(inject(function ($filter) {
            filter = $filter('slugify');
        }));

        it('should get a string with no replacer and replace spaces with dash(-)', function() {
            expect(filter('a a')).toEqual('a-a');
            expect(filter('foo bar baz')).toEqual('foo-bar-baz');
            expect(filter('Lorem ipsum dolor sit amet')).toEqual('lorem-ipsum-dolor-sit-amet');
        });

        it('should get a string with replacer and replace spaces with it', function() {
            expect(filter('a a', 1)).toEqual('a1a');
            expect(filter('foo bar baz', '!')).toEqual('foo!bar!baz');
            expect(filter('lorem ipsum dolor sit amet', ' ')).toEqual('lorem ipsum dolor sit amet');
            expect(filter('Lorem ipsum dolor sit amet', '-')).toEqual('lorem-ipsum-dolor-sit-amet');
            expect(filter('Lorem ipsum dolor sit amet', '')).toEqual('loremipsumdolorsitamet');
        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('splitFilter', function () {

        var filter, sentence = "Today is a beautiful and sunny day!";

        beforeEach(module('craft.split'));

        beforeEach(inject(function ($filter) {
            filter = $filter('split');
        }));

        it('should test a string with given pattern', function() {

            expect(filter(sentence, ' ', 3)).toEqual(['Today is a beautiful', 'and', 'sunny', 'day!']);
            expect(angular.equals(filter(sentence, '.'), [sentence])).toBeTruthy();
            expect(filter(sentence, ' ')).toEqual(['Today', 'is', 'a', 'beautiful', 'and', 'sunny', 'day!']);

        });

        it('should get a !string and return null', function() {
            expect(filter({})).toEqual(null);
            expect(filter([])).toEqual(null);
            expect(filter(1)).toEqual(null);
            expect(filter(!1)).toBeFalsy(null);
        });

    });

    'use strict';

    describe('startsWithFilter', function () {

        var filter;

        beforeEach(module('craft.starts-with'));

        beforeEach(inject(function ($filter) {
            filter = $filter('startsWith');
        }));

        it('should return whether string starts with the starts parameter', function() {

            expect(filter('string', 's')).toBeTruthy();
            expect(filter('string', 'str')).toBeTruthy();
            expect(filter('foo bar', 'Foo B')).toBeTruthy();

            expect(filter('string', 'tring')).toBeFalsy();
            expect(filter('string', 'ig')).toBeFalsy();
            expect(filter('foo bar', 'bar')).toBeFalsy();

        });

        it('should be case sensitive', function() {

            expect(filter('string', 'STR', true)).toBeFalsy();
            expect(filter('string', 'STR', false)).toBeTruthy();
            expect(filter('foo bar', 'Foo B', true)).toBeFalsy();

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('stringularFilter', function () {

        var filter;

        beforeEach(module('craft.stringular'));

        beforeEach(inject(function ($filter) {
            filter = $filter('stringular');
        }));

        it('should return the text as it was if only one argument is passed', function () {
            expect(filter('lorem ipsum dolor sit amet')).toEqual('lorem ipsum dolor sit amet');
        });

        it('should replace {n} with arguments passed after the text argument', function () {
            expect(filter('lorem {0} dolor sit amet', 'ipsum')).toEqual('lorem ipsum dolor sit amet');
            expect(filter('lorem {0} dolor {1} amet', 'ipsum', 'sit')).toEqual('lorem ipsum dolor sit amet');
            expect(filter('{3} {0} dolor {1} amet', 'ipsum', 'sit', null, 'lorem')).toEqual('lorem ipsum dolor sit amet');
        });

        it('should keep {n} if no matching argument was found', function () {
            expect(filter('lorem {0} dolor sit amet')).toEqual('lorem {0} dolor sit amet');
            expect(filter('lorem {0} dolor {1} amet', 'ipsum')).toEqual('lorem ipsum dolor {1} amet');
        });

    });

    'use strict';

    describe('stripTagsFilter', function () {

        var filter;

        beforeEach(module('craft.strip-tags'));

        beforeEach(inject(function ($filter) {
            filter = $filter('stripTags');
        }));

        it('should get a string with tags and splash it', function() {
            expect(filter('<p>lorem ipsum</p>')).toEqual('lorem ipsum');
            expect(filter('<div class="block">foo bar</div>')).toEqual('foo bar');
            expect(filter('<title>awesome title</title>')).toEqual('awesome title');
        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('testFilter', function () {

        var filter;

        beforeEach(module('craft.test'));

        beforeEach(inject(function ($filter) {
            filter = $filter('test');
        }));

        it('should test a string with given pattern', function() {

            expect(filter('15/12/2003', '^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$', 'i')).toEqual(true);
            expect(filter('foobarbaz', '^[a-z]{3,}$')).toEqual(true);
            expect(filter('FOOBARBAZ', '^[a-z]{3,}$', 'i')).toEqual(true);
            expect(filter('FOOBARBAZ', '^[a-z]{3,}$')).toEqual(false);
            expect(filter('foobarbaz', '\\W')).toEqual(false);
            expect(filter('foobarbaz', '\\w')).toEqual(true);
            expect(filter('1a/bb/2003', '^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$', 'i')).toEqual(false);

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('trimFilter', function () {

        var filter;

        beforeEach(module('craft.trim'));

        beforeEach(inject(function ($filter) {
            filter = $filter('trim');
        }));

        it('should strip whitespace from the beginning and end of a string', function() {

            expect(filter('   a   ')).toEqual('a');
            expect(filter('   foo bar   ')).toEqual('foo bar');
            expect(filter('   ')).toEqual('');

        });

        it('should strip specific chars from the beginning and end of a string', function() {

            expect(filter('__a__', '__')).toEqual('a');
            expect(filter('//foo bar//', '//')).toEqual('foo bar');
            expect(filter('barfoobar', 'bar')).toEqual('foo');

            expect(filter('barfoobar', 'foo')).toEqual('barfoobar');

        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    describe('truncateFilter', function () {
        var filter;

        beforeEach(module('craft.truncate'));

        beforeEach(inject(function($filter) {
            filter = $filter('truncate');
        }));

        it('should cut a string if it is longer than the provided length', function () {

            expect(filter('lorem ipsum dolor sit amet', 5, '', false)).toEqual('lorem');
            expect(filter('lorem ipsum dolor sit amet', 11, '', false)).toEqual('lorem ipsum');
            expect(filter('lorem ipsum dolor sit amet', 50, '', false)).toEqual('lorem ipsum dolor sit amet');

            expect(filter('abcdef', 3, '', false)).toEqual('abc');
            expect(filter('abcd ef', 6, '', false)).toEqual('abcd e');

        });

        it('should not cut words in the middle if preserve is true', function () {

            expect(filter('lorem ipsum dolor sit amet', 7, '', true)).toEqual('lorem ipsum');
            expect(filter('lorem ipsum dolor sit amet', 13, '', true)).toEqual('lorem ipsum dolor');
            expect(filter('lorem ipsum dolor sit amet', 50, '', true)).toEqual('lorem ipsum dolor sit amet');

            expect(filter('abcdef', 3, '', true)).toEqual('abcdef');
            expect(filter('abcd ef', 6, '', true)).toEqual('abcd ef');

        });

        it('should append the provided prefix if a string has been cut', function () {

            expect(filter('lorem ipsum dolor sit amet', 7, '...', true)).toEqual('lorem ipsum...');
            expect(filter('lorem ipsum dolor sit amet', 13, '...', true)).toEqual('lorem ipsum dolor...');
            expect(filter('lorem ipsum dolor sit amet', 50, '...', true)).toEqual('lorem ipsum dolor sit amet');

        });

        it('should get !string and return it as-is', function() {

            expect(filter([])).toEqual([]);
            expect(filter({})).toEqual({});
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();

        });

    });
    'use strict';

    describe('ucfirstFilter', function () {

        var filter;

        beforeEach(module('craft.ucfirst'));

        beforeEach(inject(function ($filter) {
            filter = $filter('ucfirst');
        }));

        it('should get a string and return it uppercase each first letter', function() {
            expect(filter('a')).toEqual('A');
            expect(filter('foo bar baz')).toEqual('Foo Bar Baz');
            expect(filter('lorem ipsum is simply dummy.... industry.')).toEqual('Lorem Ipsum Is Simply Dummy.... Industry.');
        });

        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

    'use strict';

    describe('uriComponentEncodeFilter', function() {

        var filter;

        beforeEach(module('craft.uri-component-encode', function($provide) {
            $provide.value('$window', {
                encodeURIComponent: function(){}
            });
        }));

        beforeEach(inject(function($filter) {
            filter = $filter('uriComponentEncode');
        }));

        it('it should get string as parameter and called encodeURIComponent', inject(function($window) {

            var string = 'foo bar baz';

            spyOn($window, 'encodeURIComponent');

            filter(string);

            expect($window.encodeURIComponent).toHaveBeenCalledWith(string)
        }));

        it('should get !string as parameter and return it as is', inject(function($window) {

            spyOn($window, 'encodeURIComponent');

            expect(filter([])).toEqual([]);
            expect(filter({})).toEqual({});
            expect(filter(777)).toEqual(777);
            expect($window.encodeURIComponent).not.toHaveBeenCalled();
        }));

    });

    'use strict';

    describe('uriEncodeFilter', function() {

        var filter;

        beforeEach(module('craft.uri-encode', function($provide) {
            $provide.value('$window', {
                encodeURI: function(){}
            });
        }));

        beforeEach(inject(function($filter) {
            filter = $filter('uriEncode');
        }));

        it('it should get string as parameter and called encodeURI', inject(function($window) {

            var string = 'foo bar baz';

            spyOn($window, 'encodeURI');

            filter(string);

            expect($window.encodeURI).toHaveBeenCalledWith(string)
        }));

        it('should get !string as parameter and return it as is', inject(function($window) {

            spyOn($window, 'encodeURI');

            expect(filter([])).toEqual([]);
            expect(filter({})).toEqual({});
            expect(filter(777)).toEqual(777);
            expect($window.encodeURI).not.toHaveBeenCalled();
        }));

    });

    'use strict';

    describe('wrapFilter', function () {

        var filter;

        beforeEach(module('craft.wrap'));

        beforeEach(inject(function ($filter) {
            filter = $filter('wrap');
        }));

        it('should wrap a string with given wrapper', function() {

            expect(filter('a', 'b')).toEqual('bab');
            expect(filter('a', 1)).toEqual('1a1');
            expect(filter('a', '.')).toEqual('.a.');

        });

        it('should wrap a string with starts and ends wrapper', function() {

            expect(filter('b', 'a', 'c')).toEqual('abc');
            expect(filter('a', 1, 2)).toEqual('1a2');
            expect(filter('a', '/', '.')).toEqual('/a.');

        });


        it('should get a !string and not touch it', function() {
            expect(filter({})).toEqual({});
            expect(filter([])).toEqual([]);
            expect(filter(1)).toEqual(1);
            expect(filter(!1)).toBeFalsy();
        });

    });

});