#CHANGELOG

## 1.5.0 - 2019-10-07

### Changed

- Updated dependencies
- Add Prettier
- Add support of TeamCity FlowID

## 1.4.0 - 2019-02-05

### Changed

- Updated dependencies

## 1.3.0 - 2017-06-27

### Fixed

- Fixed issue with doing exit(1) in case of failed test suites

## 1.2.1, 1.2.2 - 2017-06-26

### Removed

- Removed captureStandardOutput attr from report in order to allow test suite do exist(1)

## 1.2.0 - 2017-05-18

### Added

- Included filename into suite hierarchy

## 1.1.0 - 2017-05-04

### Added

- covered with Unit Tests

### Removed

- Removed `parsec` dependency

### Changed

- Use `TEAMCITY_VERSION` env param instead of using `--teamcity` to activate a reporter
- Updated usage section in README.md

## 1.0.0 - 2016-12-25

### Added

- Formatter module
- Use `--teamcity` params to enable reporter
