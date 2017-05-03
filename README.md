# jest-teamcity

 TeamCity Reporter for Jest testing framework which groups tests using TeamCity Test Suites.

## Features

* grouping tests by test suites
* output tests duration
* output pending, failed test with message and stack

## Install
Install with npm: `npm install --save-dev jest-teamcity`

## Usage

Put this into jest configuration file or package.json
```javascript
"jest": {
    "testResultsProcessor": "jest-teamcity"
}
```

The reported is enabled only if `TEAMCITY_VERSION` variable is set. It should work in TeamCity be default.

To be able to run the tests with the reporter locally, environment variable should be set:

```bash
export TEAMCITY_VERSION="some_version"
```

To enable TeamCity reporter, use the following option:
`jest --teamcity`

Package.json example:
```javascript
"scripts": {
    "test": "jest"
}
```

### License

MIT © [Ivan Tereshchenkov]
