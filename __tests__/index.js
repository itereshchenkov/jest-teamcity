'use strict';

const consoleOutput = [
    ["##teamcity[testSuiteStarted name=\'foo/__tests__/file.js\']"],
    ["##teamcity[testSuiteStarted name=\'path\']"],
    ["##teamcity[testSuiteStarted name=\'to\']"],
    ["##teamcity[testSuiteStarted name=\'test1\']"],
    ["##teamcity[testStarted name=\'title1\']"],
    ["##teamcity[testFailed name=\'title1\']"],
    ["##teamcity[testFinished name=\'title1\' duration=\'123\']"],
    ["##teamcity[testSuiteFinished name=\'test1\']"],
    ["##teamcity[testSuiteStarted name=\'test2\']"],
    ["##teamcity[testStarted name=\'title2\']"],
    ["##teamcity[testIgnored name=\'title2\' message=\'pending\']"],
    ["##teamcity[testFinished name=\'title2\' duration=\'123\']"],
    ["##teamcity[testSuiteFinished name=\'test2\']"],
    ["##teamcity[testSuiteFinished name=\'to\']"],
    ["##teamcity[testSuiteFinished name=\'path\']"],
    ["##teamcity[testSuiteFinished name=\'foo/__tests__/file.js\']"],
    ["##teamcity[testSuiteStarted name=\'foo/__tests__/file2.js\']"],
    ["##teamcity[testSuiteStarted name=\'path2\']"],
    ["##teamcity[testSuiteStarted name=\'to\']"],
    ["##teamcity[testSuiteStarted name=\'test3\']"],
    ["##teamcity[testStarted name=\'title3\']"],
    ["##teamcity[testFinished name=\'title3\' duration=\'123\']"],
    ["##teamcity[testSuiteFinished name=\'test3\']"],
    ["##teamcity[testSuiteStarted name=\'test4\']"],
    ["##teamcity[testStarted name=\'title4\']"],
    ["##teamcity[testFailed name=\'title4\']"],
    ["##teamcity[testFinished name=\'title4\' duration=\'123\']"],
    ["##teamcity[testSuiteFinished name=\'test4\']"],
    ["##teamcity[testSuiteFinished name=\'to\']"],
    ["##teamcity[testSuiteFinished name=\'path2\']"],
    ["##teamcity[testSuiteFinished name=\'foo/__tests__/file2.js\']"]
];
const testData = require('./data');
const reporter = require('../lib/index');

describe('jest-teamcity', () => {
    beforeAll(() => {
        console.log = jest.fn().mockImplementation(s => s);
    });

    beforeEach(() => {
        console.log.mockReset();
    });

    afterAll(() => {
        console.log = consoleFn;
    });

    describe('module', () => {
        test('enabled (with TEAMCITY_VERSION)', () => {
            process.env.TEAMCITY_VERSION = '0.0.0';
            const originalCwd = process.cwd();
            process.cwd = function () { return '/Users/test'; };
            reporter({ testResults: testData });
            expect(console.log.mock.calls).toEqual(consoleOutput);
            process.cwd = originalCwd;
        });

        test('disabled', () => {
            delete process.env.TEAMCITY_VERSION;
            const result = reporter({ test: 1 });
            expect(result).toEqual({ test: 1 });
        });
    });
});
