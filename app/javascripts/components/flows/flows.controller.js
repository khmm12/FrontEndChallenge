class FlowsController {
  constructor(Flow) {
    Flow.fetchAll()
    .then((flows) => this.flows = flows);
  }

  destroyFlow(flow) {
    flow.destroy()
    .then(() => _.remove(this.flows, {id: flow.id}));
  }
};

angular.module('flowApp').controller('FlowsController', FlowsController);
FlowsController.$inject = ['Flow']
