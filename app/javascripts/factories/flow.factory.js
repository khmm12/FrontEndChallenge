angular.module('flowApp').factory('Flow', ['$indexedDB', '$q', function($indexedDB, $q) {
  return class Flow {
    constructor() {
      this._destroyed = false;
      this.rules = [];
    }

    static fetchAll() {
      var deferred = $q.defer();
      $indexedDB.openStore('flows', function(store) {
        store.getAll()
        .then(function(flowsData) {
          let flows = flowsData.map(function(flowData) { let flow = new Flow(); angular.extend(flow, flowData); return flow; })
          deferred.resolve(flows);
        });
      });
      return deferred.promise;
    }

    static fetchById(id) {
      var deferred = $q.defer();
      $indexedDB.openStore('flows', function(store) {
        store.find(id)
        .then(function(flowData) {
          let flow = new Flow()
          angular.extend(flow, flowData);
          deferred.resolve(flow);
        })
        .catch(function() { deferred.reject(); });
      });
      return deferred.promise;
    }

    destroy() {
      var deferred = $q.defer();
      if (this.isDestroyed() || this.isNew()) {
        deferred.resolve(this);
      } else {
        $indexedDB.openStore('flows', (store) => {
          store.delete(this.id)
          .then(() => { deferred.resolve(this); })
          .catch(function() { deferred.reject(); });
        });
      }
      return deferred.promise;
    }

    isNew() {
      return !this.id;
    }

    isDestroyed() {
      return !!this._destroyed;
    }

    save() {
      var deferred = $q.defer();
      if (this._destroyed) {
        deferred.resolve(this);
        return deferred.promise;
      }
      $indexedDB.openStore('flows', (store) => {
        let isNew = this.isNew();
        if (isNew)
          this.id = _.uuid();
        let dataToInsert = {id: this.id, title: this.title, rules: this.rules};
        
        if (isNew) {
          store.insert(dataToInsert)
          .then((flow) => { deferred.resolve(this); })
        } else {
          store.upsert(dataToInsert)
          .then((flow) => { deferred.resolve(this); })
        }
      });
      return deferred.promise;
    }

    findRuleById(id) {
      return _.find(this.rules, {id: id});
    }
  };
}]);
