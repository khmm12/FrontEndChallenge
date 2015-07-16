angular.module('flowApp').directive('flowCreate', function() {
  return {
    restrict: 'E',
    controller: flowCreateController,
    controllerAs: 'flowCreateCtrl',
    bindToController: true,
    scope: {
      flows: '='
    },
    templateUrl: 'components/flowCreate/flowCreate.html'
  }
})

class flowCreateController {
  constructor(Flow) {
    this.Flow = Flow;
    this.newFlow = new Flow();
  }
  submit() {
    this.newFlow.save()
    .then((flow) => this.flows.push(flow));
    this.newFlow = new this.Flow();
  }
}


flowCreateController.$inject = ['Flow']
