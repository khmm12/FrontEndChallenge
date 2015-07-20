angular.module('flowApp').filter('availableRules', function() {
  return function(flow, forRule) {
    if (!flow) return [];
    let usedRules = _(flow.rules).map((rule) => [rule.failedRuleId, rule.passedRuleId]).flatten()
                                 .pull(undefined).uniq().value();

    let filterted = _(flow.rules).drop(1);
    if (!!forRule) {
      let forRuleUsedNextRules = [forRule.failedRuleId, forRule.passedRuleId];
      return filterted.reject((rule) => forRule === rule ||
                                        !_.includes(forRuleUsedNextRules, rule.id) &&
                                        _.includes(usedRules, rule.id)).value();
    } else {
      return filterted.reject((rule) => _.includes(usedRules, rule.id)).value();
    }
  };
});
