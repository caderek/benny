# CHANGELOG

## 1.0.0

Initial release.

## 2.0.0

- Removed `run` function (suites will now run automatically).
- Added optional third parameter to the `add` function - an options object to tweak each case.
- Added name string as a required first parameter of `suite` function.
- Added suite name and fastest result to saved file content.
- `suite` function now returns a `Promise` with all results, instead of internal `Suite` object.

## 2.0.1

- Improved documentation (table of contents, better overview).

## 2.0.2

- Improved README (installation instruction).
- Improved type definitions.

## 2.0.3

- Added snippets.

## 2.0.4

- Added snippet for ES/TS modules.

## 3.0.0

- Simplified objects that are passed to `complete`, `cycle` and returned as a promise by running `suite` function (raw benchmark events are now hidden).
- Added support for async benchmarks and async setup.
- Added slowest case info to the file content.

## 3.0.1

- Improved type definitions for `suite` function.
- Added async example to /examples folder.
- Replaced example GIF with the current version.

## 3.0.2

- Improved snippets (fixed descriptions).
- Improved grammar in README.

## 3.1.0

- Added relative differences between cases (default cycle output and file content)

## 3.2.0

- Added progress status
- Added examples for custom logging
- Updated example GIF
