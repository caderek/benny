# CHANGELOG

## 1.0.0

Initial release.

## 2.0.0

- Removed `run` function (suites will now run automatically).
- Added optional third parameter to the `add` function - an options object to tweak each case.
- `suite` function now returns a `Promise` with all results, instead of internal `Suite` object.
