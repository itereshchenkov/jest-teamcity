/**
 * @author Ivan Tereshchenkov
 */

const formatter = require("./formatter");

module.exports = function (result) {
  const flowId = process.env.TEAMCITY_FLOWID || process.pid.toString();
  const teamCityVersion = process.env.TEAMCITY_VERSION;
  const projectSuiteName = process.env.PROJECT_NAME;
  
  // Constructor call means usage as a Jest reporter
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target
  if (new.target) {
    if (teamCityVersion) {
      this.onTestResult = (_, result) => {
        formatter.formatReport([result], process.cwd(), flowId, projectSuiteName);
      };
    }

    return;
  }

  if (teamCityVersion) {
    formatter.formatReport(result.testResults, process.cwd(), flowId, projectSuiteName);
  }

  return result;
};
