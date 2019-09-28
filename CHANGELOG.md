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

- Improved documentation (table of contents, better overview)
