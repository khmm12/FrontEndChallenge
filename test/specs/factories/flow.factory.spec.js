'use strict';

describe('Spec: FlowFactory', function() {

  var Flow, $rootScope, $q;

  beforeEach(function() {
    angular.mock.module('flowApp');

    angular.mock.inject(function(_Flow_, _$rootScope_, _$q_) {
      Flow = _Flow_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    });
  });

  it('should exist', function() {
    expect(Flow).toBeDefined();
  });

  describe('new', function() {
    it('constructor initialize object with default and service values', function() {
      var flow = new Flow();
      expect(flow._destroyed).toBeFalsy();
      expect(flow.id).not.toBeDefined();
      expect(flow.rules).toEqual([]);
    });

    it('#isNew returns true', function() {
      var flow = new Flow();
      expect(flow.isNew()).toBeTruthy();
    });

    it('#isDestroyed returns false', function() {
      var flow = new Flow();
      expect(flow.isDestroyed()).toBeFalsy();
    });
  });

  describe('#fetchAll', function() {
    it('resolve promise with empty array if records isnt exists', function() {
      indexedDBGetAllResolve([]);
      var promise = Flow.fetchAll();
      var flows;
      promise.then(function(flowsData) {
        flows = flowsData;
      });
      promise.finally(function() {
        expect(flows).toBeDefined();
        expect(flows).toEqual([]);
        done();
      });
      $rootScope.$digest();
    });

    it('resolve promise with records if exists', function() {
      var flowsResolveData = [{id: '1', title: 'Flow Test', rules: []}];
      indexedDBGetAllResolve(flowsResolveData);
      var promise = Flow.fetchAll();
      var flows;
      promise.then(function(flowsData) {
        flows = flowsData;
      });
      promise.finally(function() {
        expect(flows).toBeDefined();
        expect(flows.length).toBe(1);
        expect(flows[0]).toEqual(jasmine.any(Flow));
        expect(flows[0].id).toBe('1');
        expect(flows[0].title).toBe('Flow Test');
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('#fetchById', function() {
    it('reject promise if record isnt finded', function(done) {
      indexedDBFindByIDReject();
      var promise = Flow.fetchById('5645');
      var isRejected = false;
      promise.catch(function() {
        isRejected = true;
      });
      promise.finally(function() {
        expect(isRejected).toBe(true);
        done();
      });
      $rootScope.$digest();
    });

    it('resolve promise with record', function(done) {
      indexedDBFindByIDResolve({id: 1, title: 'Flow 1', rules: []});
      var promise = Flow.fetchById('5645');
      var flow;
      promise.then(function(flowData) {
        flow = flowData;
      });
      promise.finally(function() {
        expect(flow).toBeDefined();
        expect(flow).toEqual(jasmine.any(Flow));
        expect(flow.isNew()).toBeFalsy();
        expect(flow.isDestroyed()).toBeFalsy();
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('#save', function() {
    var store;
    beforeEach(function() {
      store = {
        insert: function() {},
        upsert: function() {}
      };
      spyOn(store, 'insert').and.returnValue($q.defer().promise);
      spyOn(store, 'upsert').and.returnValue($q.defer().promise);
      MockIndexedDB(store);
    });

    it('call insert for new records', function() {
      var flow = new Flow();
      flow.save();
      expect(store.insert).toHaveBeenCalled();
    });

    it('call upsert for existing records', function() {
      var flow = new Flow();
      flow.id = '1';
      flow.save();
      expect(store.upsert).toHaveBeenCalled();
    });

    it('return promise', function() {
      var flow = new Flow();
      var ngPromise = $q.defer().promise.constructor;
      expect(flow.save()).toEqual(jasmine.any(ngPromise));
    });
  });

  describe('#destroy', function() {
    var store;
    beforeEach(function() {
      store = {
        delete: function() {},
      };
      spyOn(store, 'delete').and.returnValue($q.defer().promise);
      MockIndexedDB(store);
    });

    it('doesnt delete unsaved records', function() {
      var flow = new Flow();
      flow.destroy();
      expect(store.delete).not.toHaveBeenCalled();
    });

    it('doesnt delete destroyed records', function() {
      var flow = new Flow();
      flow.id = '1';
      flow._destroyed = true;
      flow.destroy();
      expect(store.delete).not.toHaveBeenCalled();
    });

    it('call delete', function() {
      var flow = new Flow();
      flow.id = '1';
      flow.destroy();
      expect(store.delete).toHaveBeenCalled();
    });

  });

});
