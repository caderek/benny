(() => {
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // lib/bench/tools/isNode.js
  var require_isNode = __commonJS({
    "lib/bench/tools/isNode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var isNode = typeof process !== "undefined";
      var isModernBrowser = typeof performance !== "undefined";
      if (isNode) {
        if (process?.hrtime?.bigint === void 0) {
          throw new Error("Unsupported Node version (< v10.7.0)");
        }
      } else if (!isModernBrowser) {
        throw new Error("Unsupported browser");
      }
      exports.default = isNode;
    }
  });

  // lib/bench/stats/tTable.js
  var require_tTable = __commonJS({
    "lib/bench/stats/tTable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tTable = [
        2.326,
        31.821,
        6.965,
        4.541,
        3.747,
        3.365,
        3.143,
        2.998,
        2.896,
        2.821,
        2.764,
        2.718,
        2.681,
        2.65,
        2.624,
        2.602,
        2.583,
        2.567,
        2.552,
        2.539,
        2.528,
        2.518,
        2.508,
        2.5,
        2.492,
        2.485,
        2.479,
        2.473,
        2.467,
        2.462,
        2.457,
        2.453,
        2.449,
        2.445,
        2.441,
        2.438,
        2.434,
        2.431,
        2.429,
        2.426,
        2.423,
        2.421,
        2.418,
        2.416,
        2.414,
        2.412,
        2.41,
        2.408,
        2.407,
        2.405,
        2.403,
        2.402,
        2.4,
        2.399,
        2.397,
        2.396,
        2.395,
        2.394,
        2.392,
        2.391,
        2.39,
        2.389,
        2.388,
        2.387,
        2.386,
        2.385,
        2.384,
        2.383,
        2.382,
        2.382,
        2.381,
        2.38,
        2.379,
        2.379,
        2.378,
        2.377,
        2.376,
        2.376,
        2.375,
        2.374,
        2.374,
        2.373,
        2.373,
        2.372,
        2.372,
        2.371,
        2.37,
        2.37,
        2.369,
        2.369,
        2.368,
        2.368,
        2.368,
        2.367,
        2.367,
        2.366,
        2.366,
        2.365,
        2.365,
        2.365,
        2.364
      ];
      exports.default = tTable;
    }
  });

  // lib/bench/stats/runningStats.js
  var require_runningStats = __commonJS({
    "lib/bench/stats/runningStats.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tTable_1 = require_tTable();
      var addToMean = (mean, n, newValue) => {
        return mean + (newValue - mean) / (n + 1);
      };
      var runningStats = () => {
        let n = 0;
        let sum = 0;
        let sumOfSquares = 0;
        let mean = 0;
        return (num) => {
          n++;
          mean = n === 1 ? num : addToMean(mean, n, num);
          sum += num;
          sumOfSquares += num ** 2;
          const standardDeviation = Math.sqrt(sumOfSquares / n - Math.pow(sum / n, 2));
          const standardErrorOfMean = standardDeviation / Math.sqrt(n);
          const critical = tTable_1.default[n - 1 || 1] || tTable_1.default[0];
          const marginOfError = standardErrorOfMean * critical;
          const relativeMarginOfError = marginOfError / mean * 100 || 0;
          return {
            n,
            mean,
            margin: relativeMarginOfError
          };
        };
      };
      exports.default = runningStats;
    }
  });

  // lib/bench/tools/noop.js
  var require_noop = __commonJS({
    "lib/bench/tools/noop.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var isNode_1 = require_isNode();
      var runningStats_1 = require_runningStats();
      var identity = (a) => a;
      var noopNode = () => {
        const rs = (0, runningStats_1.default)();
        let stats = { n: 0, mean: 0, margin: Infinity };
        let n = 0;
        while (stats.margin > 1 || stats.n < 1e6) {
          const arg = Math.random();
          const t0 = process.hrtime.bigint();
          const result = identity(arg);
          const t1 = process.hrtime.bigint();
          stats = rs(Number(t1 - t0));
          n += result;
        }
        if (n <= 0) {
          throw "Noop initializing error";
        }
        return stats;
      };
      var noopBrowser = () => {
        const rs = (0, runningStats_1.default)();
        let stats = { n: 0, mean: 0, margin: Infinity };
        let n = 0;
        while (stats.margin > 1 || stats.n < 1e6) {
          const arg = Math.random();
          const t0 = performance.now();
          const result = identity(arg);
          const t1 = performance.now();
          stats = rs(t1 - t0);
          n += result;
        }
        if (n <= 0) {
          throw "Noop initializing error";
        }
        return stats.mean * 1e6;
      };
      var noop = isNode_1.default ? noopNode() : noopBrowser();
      console.log(noop);
      exports.default = noop;
    }
  });
  require_noop();
})();
