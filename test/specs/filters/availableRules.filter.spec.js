'use strict';

describe('Spec: availableRules filter', function() {

  var availableRules;

  beforeEach(function() {
    angular.mock.module('flowApp');

    angular.mock.inject(function(_$filter_) {
      availableRules = _$filter_('availableRules');
    });
  });

  it('should exist', function() {
    expect(availableRules).toBeDefined();
  });

  describe('(flow, undefined)', function() {
    it('return none rules for empty rules list', function() {
      expect(availableRules({rules: []})).toEqual([]);
    });

    it('return empty array of rules for 1 rules list', function() {
      var rules = [{title: 'Rule1'}];
      expect(availableRules({rules: rules})).toEqual([]);
    });

    it('return 2 rule for 2 rules list', function() {
      var rules = [{title: 'Rule1'}, {title: 'Rule2'}];
      expect(availableRules({rules: rules})).toEqual([{title: 'Rule2'}]);
    });

    it('return empty array of rules for 2 rules list. Rule2 used', function() {
      var rules = [{id: '1', title: 'Rule1', passedRuleId: '2'}, {id: '2', title: 'Rule2'}];
      expect(availableRules({rules: rules})).toEqual([]);
    });
  });

  describe('(flow, rule)', function() {
    it('return empty array of rules for 1 rules list', function() {
      var rules = [{title: 'Rule1'}];
      expect(availableRules({rules: rules}, rules[0])).toEqual([]);
    });

    it('return 2 rule for 2 rules list. Filter for rule 1', function() {
      var rules = [{title: 'Rule1'}, {title: 'Rule2'}];
      expect(availableRules({rules: rules}, rules[0])).toEqual([rules[1]]);
    });

    it('return empty array of rules for 2 rules list. Filter for rule 2', function() {
      var rules = [{title: 'Rule1'}, {title: 'Rule2'}];
      expect(availableRules({rules: rules}, rules[1])).toEqual([]);
    });

    it('return empty array of rules for 3 rules list.  Rule2 used Filter for rule 3', function() {
      var rules = [{id: '1', title: 'Rule1', passedRuleId: '2'}, {id: '2', title: 'Rule2'}, {id: '3', title: 'Rule3'}];
      expect(availableRules({rules: rules}, rules[2])).toEqual([]);
    });
  });

});
