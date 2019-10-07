/**
 * @author Ivan Tereshchenkov
 */

const formatter = require("./formatter");

module.exports = result => {
  const flowId = process.env.TEAMCITY_FLOWID || process.pid.toString();
  const teamCityVersion = process.env.TEAMCITY_VERSION;

  if (teamCityVersion) {
    formatter.formatReport(result.testResults, process.cwd(), flowId);
  }

  return result;
};
