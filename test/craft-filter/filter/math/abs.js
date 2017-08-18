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
