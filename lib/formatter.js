"use strict";

const path = require("path");
const errorMessageStackSeparator = "\n    ";

module.exports = {
  /**
   * Escape text message to be compatible with Teamcity
   * @param {string} str
   * @returns {string}
   */
  escape(str) {
    if (!str) {
      return "";
    }

    return str
      .toString()
      .replace(/\x1B.*?m/g, "")
      .replace(/\|/g, "||")
      .replace(/\n/g, "|n")
      .replace(/\r/g, "|r")
      .replace(/\[/g, "|[")
      .replace(/\]/g, "|]")
      .replace(/\u0085/g, "|x")
      .replace(/\u2028/g, "|l")
      .replace(/\u2029/g, "|p")
      .replace(/'/g, "|'");
  },

  /**
   * Prints test message
   * @param {object} tests
   */
  printTestLog(tests, flowId) {
    if (tests) {
      Object.keys(tests).forEach((suiteName) => {
        if (suiteName === "_tests_") {
          // print test details
          tests[suiteName].forEach((test) => {
            this.log(`##teamcity[testStarted name='${this.escape(test.title)}' flowId='${flowId}']`);
            switch (test.status) {
              case "failed":
                if (test.failureMessages) {
                  test.failureMessages.forEach((error) => {
                    const [message, ...stack] = error.split(errorMessageStackSeparator);
                    this.log(
                      `##teamcity[testFailed name='${this.escape(test.title)}' message='${this.escape(
                        message,
                      )}' details='${this.escape(stack.join(errorMessageStackSeparator))}' flowId='${flowId}']`,
                    );
                  });
                } else {
                  this.log(`##teamcity[testFailed name='${this.escape(test.title)}' flowId='${flowId}']`);
                }

                break;
              case "pending":
                this.log(
                  `##teamcity[testIgnored name='${this.escape(test.title)}' message='pending' flowId='${flowId}']`,
                );
                break;
              case "passed":
                break;
            }
            this.log(
              `##teamcity[testFinished name='${this.escape(test.title)}' duration='${
                test.duration
              }' flowId='${flowId}']`,
            );
          });
        } else {
          // print suite names
          this.printSuiteBlock(suiteName, flowId, () => this.printTestLog(tests[suiteName], flowId));
        }
      });
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
  collectSuites(testResults, cwd) {
    if (!testResults) {
      return {};
    }
    if (!cwd) {
      throw new Error("cwd not specified");
    }

    const suites = {};
    testResults.forEach((testFile) => {
      const filename = path.relative(cwd, testFile.testFilePath);
      testFile.testResults.forEach((test) => {
        const path = [filename].concat(test.ancestorTitles);

        // find current suite, creating each level if necessary
        let currentSuite = suites;
        for (const p of path) {
          if (!Object.prototype.hasOwnProperty.call(currentSuite, p)) {
            currentSuite[p] = {};
          }
          currentSuite = currentSuite[p];
        }

        // last level is array of test results
        if (!currentSuite["_tests_"]) {
          currentSuite["_tests_"] = [];
        }

        // add the current test
        currentSuite["_tests_"].push(test);
      });

      if (testFile.testExecError) {
        suites[filename] = suites[filename] || {};
        suites[filename]["_tests_"] = [
          {
            status: "failed",
            title: "Jest failed to execute suite",
            duration: 0,
            failureMessages: [
              `${testFile.testExecError.message}${errorMessageStackSeparator}${testFile.testExecError.stack}`,
            ],
          },
        ];
      }
    });

    return suites;
  },

  /**
   * @param {string} suiteName
   * @param {string} flowId
   * @param {function} printLogFn
   */
  printSuiteBlock(suiteName, flowId, printLogFn) {
    this.log(`##teamcity[testSuiteStarted name='${this.escape(suiteName)}' flowId='${flowId}']`);
    printLogFn();
    this.log(`##teamcity[testSuiteFinished name='${this.escape(suiteName)}' flowId='${flowId}']`);
  },

  /**
   * Formats and outputs tests results
   * @param {array} testResults
   * @param {string} cwd
   * @param {string} flowId
   * @param {string} [projectSuiteName]
   */
  formatReport(testResults, cwd, flowId, projectSuiteName) {
    const suites = this.collectSuites(testResults, cwd);

    if (projectSuiteName) {
      this.printSuiteBlock(projectSuiteName, flowId, () => this.printTestLog(suites, flowId));
    } else {
      this.printTestLog(suites, flowId);
    }
  },
};
