'use strict';

function MockIndexedDB(storeMock) {
  angular.mock.inject(function(_$indexedDB_) {
    var $indexedDB = _$indexedDB_;
    spyOn($indexedDB, 'openStore').and.callFake(function(storeName, callback) {
      callback(storeMock);
    });
  });
}

function indexedDBFindByIDReject() {
  angular.mock.inject(function(_$rootScope_, _$indexedDB_, _$q_) {
    var store = {
      find: function() {
        var deferred = _$q_.defer();
        _$rootScope_.$apply(function() {
          deferred.reject();
        });
        return deferred.promise;
      }
    };
    MockIndexedDB(store);
  });
}

function indexedDBFindByIDResolve(resolveData) {
  angular.mock.inject(function(_$rootScope_, _$indexedDB_, _$q_) {
    var store = {
      find: function() {
        var deferred = _$q_.defer();
        _$rootScope_.$apply(function() {
          deferred.resolve(resolveData);
        });
        return deferred.promise;
      }
    };
    MockIndexedDB(store);
  });
}

function indexedDBGetAllResolve(resolveData) {
  angular.mock.inject(function(_$rootScope_, _$indexedDB_, _$q_) {
    var store = {
      getAll: function() {
        var deferred = _$q_.defer();
        _$rootScope_.$apply(function() {
          deferred.resolve(resolveData);
        });
        return deferred.promise;
      }
    };
    MockIndexedDB(store);
  });
}
