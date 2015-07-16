angular.module('flowApp').controller('AppController', ['$router', AppController]);

AppController.$routeConfig = [
  { path: '/', component: 'flows' },
  { path: '/flow/:id', component: 'flowShow' }
];

function AppController($router) {}

angular.module('flowApp').config(['$componentLoaderProvider', function ($componentLoaderProvider) {
   $componentLoaderProvider.setTemplateMapping(function (name) {
     return `components/${name}/${name}.html`;
  });
}]);
