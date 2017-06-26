/**
 * @author Ivan Tereshchenkov
 */

'use strict';

const formatter = require('./formatter');

module.exports = (result) => {
    if (process.env.TEAMCITY_VERSION) {
        formatter.formatReport(result.testResults, process.cwd());
    }

    return result;
};
