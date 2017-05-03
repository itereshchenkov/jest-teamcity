/**
 * @author Ivan Tereshchenkov
 */

'use strict';

const formatter = require('./formatter');

module.exports = (result) => {
    if (!process.env.TEAMCITY_VERSION) {
        return result;
    }

    return formatter.formatReport(result.testResults);
};
