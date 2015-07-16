'use strict';

describe('Spec: FlowExecuterService', function() {

  var service;

  beforeEach(function() {
    angular.mock.module('flowApp');

    angular.mock.inject(function(FlowExecuterService) {
      service = FlowExecuterService;
    });
  });

  it('should exist', function() {
    expect(service).toBeDefined();
  });

  describe('#executeFlow', function() {
    it("return correctly log for empty flow", function() {
      var flow = {
        title: 'Test1',
        rules: []
      };
      var evalResult = service.executeFlow(flow);
      expect(evalResult).toEqual([{title: 'Need at least one rule', type: 'error'}]);
    });

    it("return correctly log for empty input object", function() {
      var flow = {
        title: 'Test1',
        rules: [{title: 'Rule 1', body: 'function() { return true; }'}]
      };
      var evalResult = service.executeFlow(flow, '');
      expect(evalResult).toEqual([{title: 'Invalid input block', type: 'error'}]);
    });

    it('return correctly log for invalid rule body', function() {
      var flow = {
        title: 'Test1',
        rules: [{title: 'Rule 1', body: 'function { return true; }'}]
      };
      var evalResult = service.executeFlow(flow, '{aza: 13}');
      expect(evalResult).toEqual([{title: 'Rule 1 Invalid. End', type: 'error'}]);
    });

  });

  describe('#secureEval', function() {
    it('successfully evalute valid function', function() {
      var evalBlock = 'function() { return 4; }'
      var evalResult = service.secureEval(evalBlock);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result()).toBe(4);
    });

    it('successfully evalute valid object', function() {
      var evalBlock = '{aza: 12, baza: 15}'
      var evalResult = service.secureEval(evalBlock);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toEqual({aza: 12, baza: 15});
    });

    it('return success false for invalid string', function() {
      var evalBlock = 'function return 4'
      var evalResult = service.secureEval(evalBlock);
      expect(evalResult.success).toBe(false);
      expect(evalResult.result).toBe(undefined);
    });

  });

});
