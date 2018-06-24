'use strict';

const formatter = require('../lib/formatter');
const testData = require('./data');
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

describe('jest-teamcity', () => {
    describe('formatter', () => {
        let consoleFn = console.log;

        beforeAll(() => {
            console.log = jest.fn().mockImplementation(s => s);
        });

        beforeEach(() => {
            console.log.mockReset();
        });

        afterAll(() => {
            console.log = consoleFn;
        });

        describe('escape()', () => {
            test('empty string', () => {
                expect(formatter.escape('')).toEqual('');
                expect(formatter.escape(null)).toEqual('');
                expect(formatter.escape(undefined)).toEqual('');
            });

            test('escape', () => {
                expect(formatter.escape(`|test[test2]|
test3`)).toEqual('||test|[test2|]|||ntest3');
            });
        });

        test('log', () => {
            formatter.log('test');
            expect(console.log.mock.calls[0][0]).toEqual('test');
        });

        describe('collectSuites', () => {
            test('empty', () => {
                expect(formatter.collectSuites()).toEqual({});
                expect(formatter.collectSuites(null)).toEqual({});
                expect(formatter.collectSuites(undefined)).toEqual({});
                expect(formatter.collectSuites('')).toEqual({});
                expect(formatter.collectSuites([], '/')).toEqual({});
            });

            test('with result', () => {
                expect(formatter.collectSuites(testData, '/Users/test')).toEqual({
                    'foo/__tests__/file.js': {
                        path: expect.objectContaining({
                            to: expect.objectContaining({
                                test1: expect.any(Object),
                                test2: expect.any(Object),
                            })
                        }),
                    },
                    'foo/__tests__/file2.js': {
                        path2: expect.objectContaining({
                            to: expect.objectContaining({
                                test3: expect.any(Object),
                                test4: expect.any(Object),
                            })
                        })
                    }
                });
            });
        });

        test('formatReport', () => {
            formatter.formatReport(testData, '/Users/test/');
            expect(console.log.mock.calls).toEqual(consoleOutput);
        });
    });
});
