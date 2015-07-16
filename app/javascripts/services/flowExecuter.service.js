class FlowExecuterService {
  executeFlow(flow, inputObjectBlock) {
    let executionLog = []

    if (!(flow.rules instanceof Array) || flow.rules.length === 0) {
      this.pushEventToLog(executionLog, 'Need at least one rule', 'error');
      return executionLog;
    }

    let inputBlockEvalResult = this.secureEval(inputObjectBlock);
    if (!inputBlockEvalResult.success) {
      this.pushEventToLog(executionLog, 'Invalid input block', 'error');
      return executionLog;
    }
    let inputObject = inputBlockEvalResult.result;

    var rule = flow.rules[0];
    while (true) {
      let ruleFunctionEvalResult = this.secureEval(rule.body);
      if (ruleFunctionEvalResult.success) {
        let ruleFunction = ruleFunctionEvalResult.result;
        var executionResult;

        try {
          executionResult = ruleFunction(inputObject)
        } catch(e) {
          this.pushEventToLog(executionLog, `${rule.title} raised exception. End`, 'error');
          break;
        }

        if (executionResult) {
          let nextRule = flow.findRuleById(rule.passedRuleId);
          if (nextRule) {
            this.pushEventToLog(executionLog, `${rule.title} Success`, 'passed');
            rule = nextRule;
            continue;
          } else {
            this.pushEventToLog(executionLog, `${rule.title} Success. End`, 'passed');
            break;
          }
        } else {
          let nextRule = flow.findRuleById(rule.failedRuleId);
          if (nextRule) {
            this.pushEventToLog(executionLog, `${rule.title} Failed`, 'failed');
            rule = nextRule;
            continue;
          } else {
            this.pushEventToLog(executionLog, `${rule.title} Failed. End`, 'failed');
            break;
          }
        }
      } else {
        this.pushEventToLog(executionLog, `${rule.title} Invalid. End`, 'error');
      }
      break;
    }
    return executionLog;
  }

  secureEval(evalBlock) {
    var ret;
    var success = true;
    let block = `(${evalBlock})`;
    (function() {
      'use strict';
      try {
        ret = eval(block)
      } catch(e) {
        success = false;
      }
    }());
    return { result: ret, success: success };
  }

  pushEventToLog(log, title, type) {
    log.push({title: title, type: type});
    return log;
  }
}

angular.module('flowApp').service('FlowExecuterService', FlowExecuterService);
