"use strict";

const path = require("path");
const formatter = require("../lib/formatter");
const testData = require("./data");
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

describe("jest-teamcity", () => {
  describe("formatter", () => {
    let consoleFn = console.log;
    let formatterFn = formatter.log;

    beforeAll(() => {
      console.log = jest.fn().mockImplementation((s) => s);
      const formatterMock = path.sep == "/" ? (s) => formatterFn(s) : (s) => formatterFn(s.replace(/\\/g, "/"));
      formatter.log = jest.fn().mockImplementation(formatterMock);
    });

    beforeEach(() => {
      console.log.mockReset();
      formatter.log.mockClear();
    });

    afterAll(() => {
      console.log = consoleFn;
      formatter.log = formatterFn;
    });

    describe("escape()", () => {
      test("empty string", () => {
        expect(formatter.escape("")).toEqual("");
        expect(formatter.escape(null)).toEqual("");
        expect(formatter.escape(undefined)).toEqual("");
      });

      test("escape", () => {
        expect(
          formatter.escape(`|test[test2]|
test3`),
        ).toEqual("||test|[test2|]|||ntest3");
      });
    });

    describe("printTestLog", () => {
      test("empty tests", () => {
        ["", null, undefined, {}, [], 0].forEach((data) => {
          formatter.printTestLog(data);
          expect(console.log.mock.calls).toHaveLength(0);
        });
      });

      test("with data", () => {
        formatter.printTestLog(formatter.collectSuites(testData, "/Users/test"), "12345");
        expect(console.log.mock.calls).toEqual(consoleOutput);
      });
    });

    test("log", () => {
      formatter.log("test");
      expect(console.log.mock.calls[0][0]).toEqual("test");
    });

    describe("collectSuites", () => {
      test("empty", () => {
        expect(formatter.collectSuites()).toEqual({});
        expect(formatter.collectSuites(null)).toEqual({});
        expect(formatter.collectSuites(undefined)).toEqual({});
        expect(formatter.collectSuites("")).toEqual({});
        expect(formatter.collectSuites([], "/")).toEqual({});
      });

      test("with result", () => {
        const fileKey = ["foo", "__tests__", "file.js"].join(path.sep);
        const file2Key = ["foo", "__tests__", "file2.js"].join(path.sep);
        expect(formatter.collectSuites(testData, "/Users/test")).toEqual({
          [fileKey]: {
            path: expect.objectContaining({
              to: expect.objectContaining({
                test1: expect.any(Object),
                test2: expect.any(Object),
              }),
            }),
          },
          [file2Key]: {
            path2: expect.objectContaining({
              to: expect.objectContaining({
                test3: expect.any(Object),
                test4: expect.any(Object),
              }),
            }),
          },
        });
      });
    });

    test("formatReport", () => {
      formatter.formatReport(testData, "/Users/test/", "12345");
      expect(console.log.mock.calls).toEqual(consoleOutput);
    });

    test("textExecError", () => {
      formatter.formatReport(
        [
          {
            testFilePath: "/Users/spec-with-error/failing.spec.ts",
            testResults: [],
            testExecError: {
              message: "Error:\nSomething bad is happened!",
              stack:
                "Error: Timeout of 181000 waiting for jest process 168 reached!\nThat means that your test suite, the spec file, took too much time to execute. Try spliting the spec to multiple specs.\n    at Timeout._onTimeout (evalmachine.<anonymous>:1901:31)\n    at listOnTimeout (internal/timers.js:549:17)\n    at processTimers (internal/timers.js:492:7)",
              type: "Error",
            },
          },
        ],
        "/Users/spec-with-error",
        "12345",
      );
      expect(console.log.mock.calls).toEqual([
        ["##teamcity[testSuiteStarted name='failing.spec.ts' flowId='12345']"],
        ["##teamcity[testStarted name='Jest failed to execute suite' flowId='12345']"],
        [
          "##teamcity[testFailed name='Jest failed to execute suite' message='Error:|nSomething bad is happened!' details='Error: Timeout of 181000 waiting for jest process 168 reached!|nThat means that your test suite, the spec file, took too much time to execute. Try spliting the spec to multiple specs.|n    at Timeout._onTimeout (evalmachine.<anonymous>:1901:31)|n    at listOnTimeout (internal/timers.js:549:17)|n    at processTimers (internal/timers.js:492:7)' flowId='12345']",
        ],
        ["##teamcity[testFinished name='Jest failed to execute suite' duration='0' flowId='12345']"],
        ["##teamcity[testSuiteFinished name='failing.spec.ts' flowId='12345']"],
      ]);
    });
  });
});
