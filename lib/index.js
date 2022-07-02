/**
 * @author Ivan Tereshchenkov
 */

const formatter = require("./formatter");

module.exports = function(resultOrGlobalConfig, optionsIfReporter) {
  const flowId = process.env.TEAMCITY_FLOWID || process.pid.toString();
  const teamCityVersion = process.env.TEAMCITY_VERSION;

  // Constructor call means usage as a Jest reporter
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target
  if (new.target) {
    if (teamCityVersion) {
      if(!optionsIfReporter) {
        optionsIfReporter = {};
      }

      const rootDir = optionsIfReporter.rootDir || process.cwd();
      const testNameGenerator = optionsIfReporter.testNameGenerator;
      const suiteNameGenerator = optionsIfReporter.suiteNameGenerator;

      this.onTestResult = (_, result) => {
        formatter.formatReport([result], rootDir, flowId, testNameGenerator, suiteNameGenerator)
      }
    }

    return
  }

  // at this point, we are not a reporter.
  const result = resultOrGlobalConfig;

  if (teamCityVersion) {
    formatter.formatReport(result.testResults, process.cwd(), flowId);
  }

  return result;
};
