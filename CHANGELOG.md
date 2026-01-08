# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.1](https://github.com/KristjanESPERANTO/temporal-kit/compare/v0.2.0...v0.2.1) (2026-01-08)


### Features

* add IIFE builds for browser usage without bundlers ([115e68f](https://github.com/KristjanESPERANTO/temporal-kit/commit/115e68f9350f709d80416e73ad9fa0ddacd0b767))


### Chores

* enforce conventional commits with commitlint ([5aa3470](https://github.com/KristjanESPERANTO/temporal-kit/commit/5aa347074027f2fad2e041d795587be1938439f9))
* enforce noAccumulatingSpread as error ([8e01d37](https://github.com/KristjanESPERANTO/temporal-kit/commit/8e01d37be92fe611031c98a215a3264dbb1a67da))
* remove redundant lcov coverage reporter ([1e51cca](https://github.com/KristjanESPERANTO/temporal-kit/commit/1e51ccaf3eb1e98e6df7271c123a0ae8446d46ba))
* update biome schema version to 2.3.11 ([6ebaad3](https://github.com/KristjanESPERANTO/temporal-kit/commit/6ebaad364d055f3cb802c8ec140a323557cff044))
* update devDependencies ([77e1062](https://github.com/KristjanESPERANTO/temporal-kit/commit/77e1062025f60511a5955a0c1f2e2650885acb86))
* update scripts to use 'node --run' instead of 'npm run' ([c4b85e5](https://github.com/KristjanESPERANTO/temporal-kit/commit/c4b85e5f0eabdcbdc1e3e6f8c9dec3f2d40b894c))


### Documentation

* fix event handlers and improve locale examples ([e144bf6](https://github.com/KristjanESPERANTO/temporal-kit/commit/e144bf6683305778d25117787fb748beead58e48))
* fix race condition in examples by merging scripts into module ([6df6df0](https://github.com/KristjanESPERANTO/temporal-kit/commit/6df6df0ca7c2e2d02af7a31f9ecf3ee94f621b66))
* fix size description in README ([a687bd7](https://github.com/KristjanESPERANTO/temporal-kit/commit/a687bd7966d12df0eaa30a8055330a50d6ecb576))

## [0.2.0](https://github.com/KristjanESPERANTO/temporal-kit/compare/v0.1.1...v0.2.0) (2025-12-01)


### Features

* add business day utilities and missing type guards ([3dd96e1](https://github.com/KristjanESPERANTO/temporal-kit/commit/3dd96e1d3eddc06cf46d4e784dd08e0cdff0a0ee))
* add security infrastructure ([0fc054d](https://github.com/KristjanESPERANTO/temporal-kit/commit/0fc054d0c2b56f7d98defbf7e12cabbe746946cd))
* enhance landing page with improvements ([3efe9a5](https://github.com/KristjanESPERANTO/temporal-kit/commit/3efe9a50d06654c235aee7a728ff10fc7373e176))


### Bug Fixes

* update includes in biome.json to include examples directory; clean up README.md ([e646ec1](https://github.com/KristjanESPERANTO/temporal-kit/commit/e646ec16b132c1591f855d806fed99ee9a553564))


### Code Refactoring

* **release:** convert update-html-version script from CJS to ESM ([ad47b87](https://github.com/KristjanESPERANTO/temporal-kit/commit/ad47b87db0bc444fc386045120f409bec50be9f6))
* switch biome to blacklist approach; fix all linting issues ([5eaba3d](https://github.com/KristjanESPERANTO/temporal-kit/commit/5eaba3d3e6b4b39f3d14cbe518a841d7bbd8ca4e))

## [0.1.1](https://github.com/KristjanESPERANTO/temporal-kit/compare/v0.1.0...v0.1.1) (2025-12-01)


### Bug Fixes

* disable noConsole rule in linter and clean up TypeScript example formatting ([1d8a9c0](https://github.com/KristjanESPERANTO/temporal-kit/commit/1d8a9c0d9aa8c7fc76644501a276c9c535e1fc13))
* make format tests timezone-independent for CI ([35a68a1](https://github.com/KristjanESPERANTO/temporal-kit/commit/35a68a18b78abe17e6df6e76a68cde4ae16beabb))


### Chores

* improve npm keywords for better discoverability ([414a0c7](https://github.com/KristjanESPERANTO/temporal-kit/commit/414a0c7f948acd04b1147a351031a38866a542e3))


### Documentation

* add bundle size and license badges to README ([d9381bc](https://github.com/KristjanESPERANTO/temporal-kit/commit/d9381bcb405bb76a72bd8f154eca2b38ecb24c26))
* add SEO meta tags to landing page ([4db6f43](https://github.com/KristjanESPERANTO/temporal-kit/commit/4db6f43598b9d9d1bb87bf9f03c29d78617d11ed))
* cleanup examples and update readme ([0a1d0b6](https://github.com/KristjanESPERANTO/temporal-kit/commit/0a1d0b6c3037aa36497fb856836cc64a0cb6396c))

## [0.1.0](https://github.com/KristjanESPERANTO/temporal-kit/compare/v0.0.3...v0.1.0) (2025-12-01)


### Features

* add functional rounding utilities ([7a14ca2](https://github.com/KristjanESPERANTO/temporal-kit/commit/7a14ca29e73429e1964ea41773ca02086a224051))
* add isBetween/clamp helpers and finalize documentation ([929e188](https://github.com/KristjanESPERANTO/temporal-kit/commit/929e1889ab7ea7e80794ae7c6c475777440c9a84))
* add nextDay/previousDay helpers ([4859861](https://github.com/KristjanESPERANTO/temporal-kit/commit/48598611b08852b0d0e50dade474ae88dd6439d9))
* add timezone utilities isValidTimezone() and getTimezoneName() ([4895b46](https://github.com/KristjanESPERANTO/temporal-kit/commit/4895b46c16fdde3dad6983585410f3df95c18125))
* add version updater script for HTML documentation ([a79cd15](https://github.com/KristjanESPERANTO/temporal-kit/commit/a79cd158908dc9c46c0ae69aecc4c16000dc5b36))
* **collection:** add sortAsc, sortDesc, closestTo helpers ([dee23d2](https://github.com/KristjanESPERANTO/temporal-kit/commit/dee23d2698cb4771eab75a92eb17d10570d6b299))
* **compare:** add specific comparison helpers (isSameDay, isSameWeek, etc.) ([63056c4](https://github.com/KristjanESPERANTO/temporal-kit/commit/63056c4903f41b6ea738f19f01548fcf88fe3408))
* **format:** Enhance formatRelative with time unit support ([00c8976](https://github.com/KristjanESPERANTO/temporal-kit/commit/00c89764e92eea8e4af4f2c2664b9f4c0b0ecb48))
* implement validation helpers `isValidDateString`, `isValidTimeString`, and `isValidDateTimeString` ([039529c](https://github.com/KristjanESPERANTO/temporal-kit/commit/039529c57af1db8a053876dd2bfd35429603accf))
* **range:** Add range operations module ([bc00773](https://github.com/KristjanESPERANTO/temporal-kit/commit/bc007733f915b910f949a07f84a7c825dcdb4379))


### Bug Fixes

* resolve type errors in parse tests ([ddd88dd](https://github.com/KristjanESPERANTO/temporal-kit/commit/ddd88dd935d3518d8104167aef796dac116956c5))


### Chores

* setup pre-commit hooks with simple-git-hooks and lint-staged ([701d0dc](https://github.com/KristjanESPERANTO/temporal-kit/commit/701d0dc403dd88b82f7177d35f83c11ccce1e401))
* update cspell configuration words list ([6e1b610](https://github.com/KristjanESPERANTO/temporal-kit/commit/6e1b61094676890829a7e79d1784d7b1414b54ac))


### Documentation

* redesign landing page features and API overview ([ae42978](https://github.com/KristjanESPERANTO/temporal-kit/commit/ae429783841d45528bdd080cdbfcd36867ebc0a4))
* update status to 'Ready for Early Adopters' in README and index.html ([40b00bb](https://github.com/KristjanESPERANTO/temporal-kit/commit/40b00bb80892e0db921f5dd7f4c127e0ea934ed4))


### Code Refactoring

* fix linting issues in collection and format modules ([251f0e5](https://github.com/KristjanESPERANTO/temporal-kit/commit/251f0e5b8f1ebef36dca71e3439c078eae46bacc))

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
