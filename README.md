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
```
"jest": {
    "testResultsProcessor": "jest-teamcity"
}
```

To enable TeamCity reporter, use the following option:
`jest --teamcity`

Package.json example:
```
"scripts": {
    "test": "jest",
    "test:teamcity": "jest --teamcity"
}
```

### License

MIT © [Ivan Tereshchenkov]
