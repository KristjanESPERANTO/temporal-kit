# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.0.3](https://github.com/KristjanESPERANTO/temporal-kit/compare/v0.0.2...v0.0.3) (2025-11-30)


### Features

* add Intl-based formatting module with locale support ([fccf89f](https://github.com/KristjanESPERANTO/temporal-kit/commit/fccf89f678f06b581e77cb6a8e96c92fec713181))
* implement math module (add, subtract, startOf, endOf) ([bf769df](https://github.com/KristjanESPERANTO/temporal-kit/commit/bf769df1fd28c48a3c7171c92f2a55b399ca17f6))
* implement utils module (pipe, compose) ([2ab5e83](https://github.com/KristjanESPERANTO/temporal-kit/commit/2ab5e832cb533256e7d02b1d39f3f36349745024))
* **parse:** add smart string-to-Temporal parsing with format detection ([a6d4e46](https://github.com/KristjanESPERANTO/temporal-kit/commit/a6d4e46743aa50adb536cdc41bc1889f43704b09))


### Bug Fixes

* **compare:** Handle cross-timezone ZonedDateTime comparison correctly ([481d88c](https://github.com/KristjanESPERANTO/temporal-kit/commit/481d88c43a8f158a4c8d5546532d5865c75a6b0a))
* export Temporal from polyfilled entry and fix example ([0158094](https://github.com/KristjanESPERANTO/temporal-kit/commit/0158094d0a57d57d2259c9159ba4f4ce90f0383e))


### Chores

* update temporal-kit version to 0.0.2 in GitHub page ([d61eeee](https://github.com/KristjanESPERANTO/temporal-kit/commit/d61eeeefefd8c87dc6b9cf33fa55d558e4c700eb))


### Documentation

* add comprehensive documentation ([a11b247](https://github.com/KristjanESPERANTO/temporal-kit/commit/a11b247e63e987ca53e267b6feb15c4aa240983f))
* **examples:** add comprehensive timezone and DST examples ([94ad492](https://github.com/KristjanESPERANTO/temporal-kit/commit/94ad49287aeae237a5d9bb161de78d1d24f7ea62))

## [0.0.2](https://github.com/KristjanESPERANTO/temporal-kit/compare/v0.0.1...v0.0.2) (2025-11-30)


### Features

* add GitHub Pages ([22e3519](https://github.com/KristjanESPERANTO/temporal-kit/commit/22e3519cc8c959ecee1a56af2a5dfb4fe272c2ad))
* implement comparison functions (isBefore, isAfter, isSame, min, max) ([768e224](https://github.com/KristjanESPERANTO/temporal-kit/commit/768e2244932b1a60619136faefa5d8eb20e2f21f))
* implement convert module (now, fromISO, type conversions) ([a2f8244](https://github.com/KristjanESPERANTO/temporal-kit/commit/a2f8244ef2059be5cfbdf915aa1839c8569a03ab))


### Chores

* add commit-and-tag-version for automated releases ([b1e266e](https://github.com/KristjanESPERANTO/temporal-kit/commit/b1e266e8b46aaab3d6705cda99093c94d43076b3))
* remove dist/ from git tracking ([2145003](https://github.com/KristjanESPERANTO/temporal-kit/commit/2145003f1bada8f134e5e6c58de5ee6938b83b0d))

## [0.0.1] (2025-11-30)

Initial release of Temporal Kit, a functional utility library for working with Temporal API in TypeScript and JavaScript.
