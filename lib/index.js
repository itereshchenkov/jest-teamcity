/**
 * @author Ivan Tereshchenkov
 */
const parsec = require('parsec');
const _ = require('lodash');

const internal = {
    /**
     * Escape text message to be compatible with Teamcity
     * @param {string} str
     * @returns {string}
     */
    escape(str) {
        if (!str) {
            return '';
        }

        return str
            .toString()
            .replace(/\x1B.*?m/g, '')
            .replace(/\|/g, '||')
            .replace(/\n/g, '|n')
            .replace(/\r/g, '|r')
            .replace(/\[/g, '|[')
            .replace(/\]/g, '|]')
            .replace(/\u0085/g, '|x')
            .replace(/\u2028/g, '|l')
            .replace(/\u2029/g, '|p')
            .replace(/'/g, '|\'')
    },

    /**
     * Prints test message
     * @param {object} test
     */
    printTestLog(test) {
        if (!test.title) {
            // print suite names
            Object.keys(test).forEach((suiteName) => {
                this.log(`##teamcity[testSuiteStarted name='${this.escape(suiteName)}']`);
                this.printTestLog(test[suiteName]);
                this.log(`##teamcity[testSuiteFinished name='${this.escape(suiteName)}']`);
            });
        } else {
            // print test details
            this.log(`##teamcity[testStarted name='${this.escape(test.title)}' captureStandardOutput='true']`);
            switch (test.status) {
                case 'failed':
                    test.failureMessages.forEach((error) => {
                        const [message, stack] = error.split('\n    ');
                        this.log(`##teamcity[testFailed name='${this.escape(test.title)}' message='${this.escape(message)}' details='${this.escape(stack)}' captureStandardOutput='true']`);
                    });
                    break;
                case 'pending':
                    this.log(`##teamcity[testIgnored name='${this.escape(test.title)}' message='pending']`);
                    break;
                case 'passed':
                    break;
            }
            this.log(`##teamcity[testFinished name='${this.escape(test.title)}' duration='${test.duration}']`);
        }
    },

    /**
     * Outputs teamcity service message
     * @param {string} text
     */
    log(text) {
        console.log(text);
    },

    /**
     * Collects test suites
     * @param {array} testResults
     * @returns {object}
     */
    collectSuites(testResults) {
        const suites = {};
        testResults.forEach((testFile) => {
            testFile.testResults.forEach((test) => {
                _.set(suites, test.ancestorTitles.join('.'), test);
            });
        });

        return suites;
    },

    /**
     * Formats and outputs tests results
     * @param {array} testResults
     */
    formatReport(testResults) {
        const suites = this.collectSuites(testResults);
        this.printTestLog(suites);
    }
};

module.exports = (result) => {
    if (!parsec().teamcity) {
        return result;
    }

    return internal.formatReport(result.testResults);
};
