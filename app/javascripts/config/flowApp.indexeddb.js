angular.module('flowApp').config(['$indexedDBProvider', function ($indexedDBProvider) {
  $indexedDBProvider
  .connection('flowApp')
  .upgradeDatabase(2, function(event, db, tx) {
    db.createObjectStore('flows', {keyPath: 'id'});
  });
}]);
