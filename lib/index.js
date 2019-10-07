/**
 * @author Ivan Tereshchenkov
 */

'use strict';

const formatter = require('./formatter');
const flowId = process.env['TEAMCITY_FLOWID'] || process.pid.toString();

module.exports = (result) => {
    if (process.env.TEAMCITY_VERSION) {
        formatter.formatReport(result.testResults, process.cwd(), flowId);
    }

    return result;
};
