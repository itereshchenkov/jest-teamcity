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
   * Default test name generator
   * @param {object} test
   * @returns {string}
   */
  testName(test) {
    if (!test) {
      return "";
    }
    return test.title;
  },

  /**
   * Default suite name generator
   * @param {object} test
   * @returns {string}
   */
  suiteName(test, filename, suites) {
    // todo this should probably be easier to read
    const path = [filename].concat(test.ancestorTitles);

    // find current suite, creating each level if necessary
    let currentSuite = suites;
    let p;
    for (p of path) {
      if (!Object.prototype.hasOwnProperty.call(currentSuite, p)) {
        currentSuite[p] = {};
      }
      currentSuite = currentSuite[p];
    }
    return p;
  },


  /**
   * Prints test message
   * @param {object} tests
   */
  printTestLog(tests, flowId, nameGenerator) {
    if (tests) {
      Object.keys(tests).forEach(suiteName => {
        if (suiteName === "_tests_") {
          // print test details
          tests[suiteName].forEach(test => {
            const testName = this.escape(nameGenerator(test));
            this.log(`##teamcity[testStarted name='${testName}' flowId='${flowId}']`);
            switch (test.status) {
              case "failed":
                if (test.failureMessages) {
                  test.failureMessages.forEach(error => {
                    const [message, ...stack] = error.split(errorMessageStackSeparator);
                    this.log(
                      `##teamcity[testFailed name='${testName}' message='${this.escape(
                        message
                      )}' details='${this.escape(stack.join(errorMessageStackSeparator))}' flowId='${flowId}']`
                    );
                  });
                } else {
                  this.log(`##teamcity[testFailed name='${testName}' flowId='${flowId}']`);
                }

                break;
              case "pending":
                this.log(
                  `##teamcity[testIgnored name='${testName}' message='pending' flowId='${flowId}']`
                );
                break;
              case "passed":
                break;
            }
            this.log(
              `##teamcity[testFinished name='${testName}' duration='${
                test.duration
              }' flowId='${flowId}']`
            );
          });
        } else {
          // print suite names
          this.log(`##teamcity[testSuiteStarted name='${this.escape(suiteName)}' flowId='${flowId}']`);
          this.printTestLog(tests[suiteName], flowId, nameGenerator);
          this.log(`##teamcity[testSuiteFinished name='${this.escape(suiteName)}' flowId='${flowId}']`);
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
  collectSuites(testResults, cwd, suiteNameGenerator) {
    if (!testResults) {
      return {};
    }
    if (!cwd) {
      throw new Error("cwd not specified");
    }

    const suites = {};
    const suitesByFileName = {};
    testResults.forEach(testFile => {
      const filename = path.relative(cwd, testFile.testFilePath);
      testFile.testResults.forEach(test => {
        const suiteName = suiteNameGenerator(test, filename, suites);

        if(!suites[suiteName]){
          suites[suiteName] = {};
        }

        const currentSuite = suites[suiteName];
        suitesByFileName[filename] = currentSuite;

        // last level is array of test results
        if (!currentSuite["_tests_"]) {
          currentSuite["_tests_"] = [];
        }

        // add the current test
        currentSuite["_tests_"].push({
          ...test,
          filename,
        });
      });

      if (testFile.testExecError) {
        if(!suitesByFileName[filename]) {
          suites[filename] = {};
        }

        const suite = suitesByFileName[filename] || suites[filename];

        suite['_tests_'] = [{
          status: 'failed',
          title: 'Jest failed to execute suite',
          duration: 0,
          failureMessages: [`${testFile.testExecError.message}${errorMessageStackSeparator}${testFile.testExecError.stack}`],
        }];
      }
    });

    return suites;
  },

  /**
   * Formats and outputs tests results
   * @param {array} testResults
   */
  formatReport(testResults, cwd, flowId, testNameGenerator, suiteNameGenerator) {
    const suites = this.collectSuites(testResults, cwd, suiteNameGenerator || this.suiteName);
    this.printTestLog(suites, flowId, testNameGenerator || this.testName);
  }
};
