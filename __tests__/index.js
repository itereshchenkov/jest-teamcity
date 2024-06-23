const consoleOutput = [
  ["##teamcity[testSuiteStarted name='foo/__tests__/file.js' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='path' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='to' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='test1' flowId='12345']"],
  ["##teamcity[testStarted name='title1' flowId='12345']"],
  ["##teamcity[testFailed name='title1' flowId='12345']"],
  ["##teamcity[testFinished name='title1' duration='123' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='test1' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='test2' flowId='12345']"],
  ["##teamcity[testStarted name='title2' flowId='12345']"],
  ["##teamcity[testIgnored name='title2' message='pending' flowId='12345']"],
  ["##teamcity[testFinished name='title2' duration='123' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='test2' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='to' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='path' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='foo/__tests__/file.js' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='foo/__tests__/file2.js' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='path2' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='to' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='test3' flowId='12345']"],
  ["##teamcity[testStarted name='title3' flowId='12345']"],
  ["##teamcity[testFinished name='title3' duration='123' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='test3' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='test4' flowId='12345']"],
  ["##teamcity[testStarted name='title4' flowId='12345']"],
  ["##teamcity[testFailed name='title4' flowId='12345']"],
  ["##teamcity[testFinished name='title4' duration='123' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='test4' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='test5' flowId='12345']"],
  ["##teamcity[testStarted name='title5' flowId='12345']"],
  [
    "##teamcity[testFailed name='title5' message='Unexpected exception' details='at path/to/file1.js:1|n    at path/to/file2.js:2' flowId='12345']",
  ],
  ["##teamcity[testFinished name='title5' duration='123' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='test5' flowId='12345']"],
  ["##teamcity[testSuiteStarted name='constructor' flowId='12345']"],
  ["##teamcity[testStarted name='title6' flowId='12345']"],
  ["##teamcity[testFinished name='title6' duration='123' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='constructor' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='to' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='path2' flowId='12345']"],
  ["##teamcity[testSuiteFinished name='foo/__tests__/file2.js' flowId='12345']"],
];
const testData = require("./data");
const reporter = require("../lib/index");

describe("jest-teamcity", () => {
  beforeAll(() => {
    process.env.TEAMCITY_FLOWID = 12345;
    console.log = jest.fn().mockImplementation((s) => s);
  });

  beforeEach(() => {
    console.log.mockReset();
  });

  describe("module", () => {
    it("enabled (with TEAMCITY_VERSION)", () => {
      process.env.TEAMCITY_VERSION = "0.0.0";

      const originalCwd = process.cwd();
      process.cwd = function () {
        return "/Users/test";
      };
      reporter({ testResults: testData });
      expect(console.log.mock.calls).toEqual(consoleOutput);
      process.cwd = originalCwd;
    });

    it("disabled", () => {
      delete process.env.TEAMCITY_VERSION;
      const result = reporter({ test: 1 });
      expect(result).toEqual({ test: 1 });
    });
  });
});
