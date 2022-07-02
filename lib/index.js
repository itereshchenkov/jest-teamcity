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
      const rootDir = (optionsIfReporter && optionsIfReporter.rootDir) || process.cwd();

      this.onTestResult = (_, result) => {
        formatter.formatReport([result], rootDir, flowId)
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
