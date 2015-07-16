angular.module('flowApp').filter('availableRules', function() {
  return function(flow, forRule) {
    if (!flow)
      return [];
    let usedRules = _(_.zip(_.pluck(flow.rules, 'failedRuleId'), _.pluck(flow.rules, 'passedRuleId')))
                    .flatten().uniq().pull(undefined).value();

    let filterted = _(flow.rules).drop(1);
    if (!!forRule) {
      return filterted.reject((rule) => forRule.passedRuleId != rule.id
                                        && forRule.failedRuleId != rule.id
                                        && _.includes(usedRules, rule.id))
                      .reject(forRule).value();
    } else {
      return filterted.reject((rule) => _.includes(usedRules, rule.id)).value();
    }
  };
});
