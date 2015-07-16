class FlowShowController {
  constructor(Flow, FlowExecuterService, $routeParams) {
    this.FlowExecuterService = FlowExecuterService;
    this.flow = null;
    Flow.fetchById($routeParams.id)
    .then((flow) => this.flow = flow);

    this.codemirrorConfig = {
      mode: 'Javascript',
      lineNumbers: true,
      tabSize: 2
    };
  }

  submitNewRule() {
    angular.extend(this.newRule, {id: _.uuid()});
    this.flow.rules.push(this.newRule);
    this.newRule = {};
    this.saveFlow();
  }

  newRuleFormToggle() {
    this.newRuleFormHiden = !this.newRuleFormHiden;
  }

  saveFlow() {
    this.savingFlow = true;
    let promise = this.flow.save()
    promise.finally(() => this.savingFlow = false);
    return promise;
  }

  executeFlow() {
    this.executionLog = this.FlowExecuterService.executeFlow(this.flow, this.executionObjectsBody);
  }

};

FlowShowController.$inject = ['Flow', 'FlowExecuterService', '$routeParams'];
angular.module('flowApp').controller('FlowShowController', FlowShowController);
