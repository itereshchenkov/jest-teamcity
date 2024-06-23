# jest-teamcity

[![Build Status](https://travis-ci.org/itereshchenkov/jest-teamcity.svg?branch=master)](https://travis-ci.org/itereshchenkov/jest-teamcity)
![Package Verifier](https://github.com/itereshchenkov/jest-teamcity/workflows/Package%20Verifier/badge.svg)

TeamCity Reporter for Jest testing framework which groups tests using TeamCity Test Suites.

## Features

- grouping tests by test suites
- output tests duration
- output pending, failed test with message and stack

## Install

Install with npm: `npm install --save-dev jest-teamcity`

## Usage

Add this into the jest configuration file:

```javascript
"reporters": ["default", "jest-teamcity"]
```

The reporter is enabled only if `TEAMCITY_VERSION` environment variable is set. It should work in TeamCity by default.

To be able to run the tests with the reporter locally, environment variable should be set:

```bash
export TEAMCITY_VERSION="some_version"
```

Package.json example:

```javascript
"scripts": {
    "test": "jest"
}
```

With this configuration, you can run the tests with `npm test`. If the `TEAMCITY_VERSION` environment variable is set, it produces the output in TeamCity's format. Otherwise, standard jest output is produced.

### License

MIT © [Ivan Tereshchenkov]
