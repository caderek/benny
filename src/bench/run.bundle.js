(() => {
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/platform/platform.js
  var require_platform = __commonJS({
    "node_modules/platform/platform.js"(exports, module) {
      (function() {
        "use strict";
        var objectTypes = {
          "function": true,
          "object": true
        };
        var root = objectTypes[typeof window] && window || this;
        var oldRoot = root;
        var freeExports = objectTypes[typeof exports] && exports;
        var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
        var freeGlobal = freeExports && freeModule && typeof global == "object" && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
          root = freeGlobal;
        }
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var reOpera = /\bOpera/;
        var thisBinding = this;
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var toString = objectProto.toString;
        function capitalize(string) {
          string = String(string);
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        function cleanupOS(os, pattern, label) {
          var data = {
            "10.0": "10",
            "6.4": "10 Technical Preview",
            "6.3": "8.1",
            "6.2": "8",
            "6.1": "Server 2008 R2 / 7",
            "6.0": "Server 2008 / Vista",
            "5.2": "Server 2003 / XP 64-bit",
            "5.1": "XP",
            "5.01": "2000 SP1",
            "5.0": "2000",
            "4.0": "NT",
            "4.90": "ME"
          };
          if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
            os = "Windows " + data;
          }
          os = String(os);
          if (pattern && label) {
            os = os.replace(RegExp(pattern, "i"), label);
          }
          os = format(os.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0]);
          return os;
        }
        function each(object, callback) {
          var index = -1, length = object ? object.length : 0;
          if (typeof length == "number" && length > -1 && length <= maxSafeInteger) {
            while (++index < length) {
              callback(object[index], index, object);
            }
          } else {
            forOwn(object, callback);
          }
        }
        function format(string) {
          string = trim(string);
          return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
        }
        function forOwn(object, callback) {
          for (var key in object) {
            if (hasOwnProperty.call(object, key)) {
              callback(object[key], key, object);
            }
          }
        }
        function getClassOf(value) {
          return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
        }
        function isHostType(object, property) {
          var type = object != null ? typeof object[property] : "number";
          return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == "object" ? !!object[property] : true);
        }
        function qualify(string) {
          return String(string).replace(/([ -])(?!$)/g, "$1?");
        }
        function reduce(array, callback) {
          var accumulator = null;
          each(array, function(value, index) {
            accumulator = callback(accumulator, value, index, array);
          });
          return accumulator;
        }
        function trim(string) {
          return String(string).replace(/^ +| +$/g, "");
        }
        function parse(ua) {
          var context = root;
          var isCustomContext = ua && typeof ua == "object" && getClassOf(ua) != "String";
          if (isCustomContext) {
            context = ua;
            ua = null;
          }
          var nav = context.navigator || {};
          var userAgent = nav.userAgent || "";
          ua || (ua = userAgent);
          var isModuleScope = isCustomContext || thisBinding == oldRoot;
          var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());
          var objectClass = "Object", airRuntimeClass = isCustomContext ? objectClass : "ScriptBridgingProxyObject", enviroClass = isCustomContext ? objectClass : "Environment", javaClass = isCustomContext && context.java ? "JavaPackage" : getClassOf(context.java), phantomClass = isCustomContext ? objectClass : "RuntimeObject";
          var java = /\bJava/.test(javaClass) && context.java;
          var rhino = java && getClassOf(context.environment) == enviroClass;
          var alpha = java ? "a" : "\u03B1";
          var beta = java ? "b" : "\u03B2";
          var doc = context.document || {};
          var opera = context.operamini || context.opera;
          var operaClass = reOpera.test(operaClass = isCustomContext && opera ? opera["[[Class]]"] : getClassOf(opera)) ? operaClass : opera = null;
          var data;
          var arch = ua;
          var description = [];
          var prerelease = null;
          var useFeatures = ua == userAgent;
          var version = useFeatures && opera && typeof opera.version == "function" && opera.version();
          var isSpecialCasedOS;
          var layout = getLayout([
            { "label": "EdgeHTML", "pattern": "Edge" },
            "Trident",
            { "label": "WebKit", "pattern": "AppleWebKit" },
            "iCab",
            "Presto",
            "NetFront",
            "Tasman",
            "KHTML",
            "Gecko"
          ]);
          var name = getName([
            "Adobe AIR",
            "Arora",
            "Avant Browser",
            "Breach",
            "Camino",
            "Electron",
            "Epiphany",
            "Fennec",
            "Flock",
            "Galeon",
            "GreenBrowser",
            "iCab",
            "Iceweasel",
            "K-Meleon",
            "Konqueror",
            "Lunascape",
            "Maxthon",
            { "label": "Microsoft Edge", "pattern": "(?:Edge|Edg|EdgA|EdgiOS)" },
            "Midori",
            "Nook Browser",
            "PaleMoon",
            "PhantomJS",
            "Raven",
            "Rekonq",
            "RockMelt",
            { "label": "Samsung Internet", "pattern": "SamsungBrowser" },
            "SeaMonkey",
            { "label": "Silk", "pattern": "(?:Cloud9|Silk-Accelerated)" },
            "Sleipnir",
            "SlimBrowser",
            { "label": "SRWare Iron", "pattern": "Iron" },
            "Sunrise",
            "Swiftfox",
            "Vivaldi",
            "Waterfox",
            "WebPositive",
            { "label": "Yandex Browser", "pattern": "YaBrowser" },
            { "label": "UC Browser", "pattern": "UCBrowser" },
            "Opera Mini",
            { "label": "Opera Mini", "pattern": "OPiOS" },
            "Opera",
            { "label": "Opera", "pattern": "OPR" },
            "Chromium",
            "Chrome",
            { "label": "Chrome", "pattern": "(?:HeadlessChrome)" },
            { "label": "Chrome Mobile", "pattern": "(?:CriOS|CrMo)" },
            { "label": "Firefox", "pattern": "(?:Firefox|Minefield)" },
            { "label": "Firefox for iOS", "pattern": "FxiOS" },
            { "label": "IE", "pattern": "IEMobile" },
            { "label": "IE", "pattern": "MSIE" },
            "Safari"
          ]);
          var product = getProduct([
            { "label": "BlackBerry", "pattern": "BB10" },
            "BlackBerry",
            { "label": "Galaxy S", "pattern": "GT-I9000" },
            { "label": "Galaxy S2", "pattern": "GT-I9100" },
            { "label": "Galaxy S3", "pattern": "GT-I9300" },
            { "label": "Galaxy S4", "pattern": "GT-I9500" },
            { "label": "Galaxy S5", "pattern": "SM-G900" },
            { "label": "Galaxy S6", "pattern": "SM-G920" },
            { "label": "Galaxy S6 Edge", "pattern": "SM-G925" },
            { "label": "Galaxy S7", "pattern": "SM-G930" },
            { "label": "Galaxy S7 Edge", "pattern": "SM-G935" },
            "Google TV",
            "Lumia",
            "iPad",
            "iPod",
            "iPhone",
            "Kindle",
            { "label": "Kindle Fire", "pattern": "(?:Cloud9|Silk-Accelerated)" },
            "Nexus",
            "Nook",
            "PlayBook",
            "PlayStation Vita",
            "PlayStation",
            "TouchPad",
            "Transformer",
            { "label": "Wii U", "pattern": "WiiU" },
            "Wii",
            "Xbox One",
            { "label": "Xbox 360", "pattern": "Xbox" },
            "Xoom"
          ]);
          var manufacturer = getManufacturer({
            "Apple": { "iPad": 1, "iPhone": 1, "iPod": 1 },
            "Alcatel": {},
            "Archos": {},
            "Amazon": { "Kindle": 1, "Kindle Fire": 1 },
            "Asus": { "Transformer": 1 },
            "Barnes & Noble": { "Nook": 1 },
            "BlackBerry": { "PlayBook": 1 },
            "Google": { "Google TV": 1, "Nexus": 1 },
            "HP": { "TouchPad": 1 },
            "HTC": {},
            "Huawei": {},
            "Lenovo": {},
            "LG": {},
            "Microsoft": { "Xbox": 1, "Xbox One": 1 },
            "Motorola": { "Xoom": 1 },
            "Nintendo": { "Wii U": 1, "Wii": 1 },
            "Nokia": { "Lumia": 1 },
            "Oppo": {},
            "Samsung": { "Galaxy S": 1, "Galaxy S2": 1, "Galaxy S3": 1, "Galaxy S4": 1 },
            "Sony": { "PlayStation": 1, "PlayStation Vita": 1 },
            "Xiaomi": { "Mi": 1, "Redmi": 1 }
          });
          var os = getOS([
            "Windows Phone",
            "KaiOS",
            "Android",
            "CentOS",
            { "label": "Chrome OS", "pattern": "CrOS" },
            "Debian",
            { "label": "DragonFly BSD", "pattern": "DragonFly" },
            "Fedora",
            "FreeBSD",
            "Gentoo",
            "Haiku",
            "Kubuntu",
            "Linux Mint",
            "OpenBSD",
            "Red Hat",
            "SuSE",
            "Ubuntu",
            "Xubuntu",
            "Cygwin",
            "Symbian OS",
            "hpwOS",
            "webOS ",
            "webOS",
            "Tablet OS",
            "Tizen",
            "Linux",
            "Mac OS X",
            "Macintosh",
            "Mac",
            "Windows 98;",
            "Windows "
          ]);
          function getLayout(guesses) {
            return reduce(guesses, function(result, guess) {
              return result || RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
            });
          }
          function getManufacturer(guesses) {
            return reduce(guesses, function(result, value, key) {
              return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp("\\b" + qualify(key) + "(?:\\b|\\w*\\d)", "i").exec(ua)) && key;
            });
          }
          function getName(guesses) {
            return reduce(guesses, function(result, guess) {
              return result || RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
            });
          }
          function getOS(guesses) {
            return reduce(guesses, function(result, guess) {
              var pattern = guess.pattern || qualify(guess);
              if (!result && (result = RegExp("\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(ua))) {
                result = cleanupOS(result, pattern, guess.label || guess);
              }
              return result;
            });
          }
          function getProduct(guesses) {
            return reduce(guesses, function(result, guess) {
              var pattern = guess.pattern || qualify(guess);
              if (!result && (result = RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(ua) || RegExp("\\b" + pattern + " *\\w+-[\\w]*", "i").exec(ua) || RegExp("\\b" + pattern + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(ua))) {
                if ((result = String(guess.label && !RegExp(pattern, "i").test(guess.label) ? guess.label : result).split("/"))[1] && !/[\d.]+/.test(result[0])) {
                  result[0] += " " + result[1];
                }
                guess = guess.label || guess;
                result = format(result[0].replace(RegExp(pattern, "i"), guess).replace(RegExp("; *(?:" + guess + "[_-])?", "i"), " ").replace(RegExp("(" + guess + ")[-_.]?(\\w)", "i"), "$1 $2"));
              }
              return result;
            });
          }
          function getVersion(patterns) {
            return reduce(patterns, function(result, pattern) {
              return result || (RegExp(pattern + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(ua) || 0)[1] || null;
            });
          }
          function toStringPlatform() {
            return this.description || "";
          }
          layout && (layout = [layout]);
          if (/\bAndroid\b/.test(os) && !product && (data = /\bAndroid[^;]*;(.*?)(?:Build|\) AppleWebKit)\b/i.exec(ua))) {
            product = trim(data[1]).replace(/^[a-z]{2}-[a-z]{2};\s*/i, "") || null;
          }
          if (manufacturer && !product) {
            product = getProduct([manufacturer]);
          } else if (manufacturer && product) {
            product = product.replace(RegExp("^(" + qualify(manufacturer) + ")[-_.\\s]", "i"), manufacturer + " ").replace(RegExp("^(" + qualify(manufacturer) + ")[-_.]?(\\w)", "i"), manufacturer + " $2");
          }
          if (data = /\bGoogle TV\b/.exec(product)) {
            product = data[0];
          }
          if (/\bSimulator\b/i.test(ua)) {
            product = (product ? product + " " : "") + "Simulator";
          }
          if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
            description.push("running in Turbo/Uncompressed mode");
          }
          if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
            data = parse(ua.replace(/like iPhone OS/, ""));
            manufacturer = data.manufacturer;
            product = data.product;
          } else if (/^iP/.test(product)) {
            name || (name = "Safari");
            os = "iOS" + ((data = / OS ([\d_]+)/i.exec(ua)) ? " " + data[1].replace(/_/g, ".") : "");
          } else if (name == "Konqueror" && /^Linux\b/i.test(os)) {
            os = "Kubuntu";
          } else if (manufacturer && manufacturer != "Google" && (/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua) || /\bVita\b/.test(product)) || /\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua)) {
            name = "Android Browser";
            os = /\bAndroid\b/.test(os) ? os : "Android";
          } else if (name == "Silk") {
            if (!/\bMobi/i.test(ua)) {
              os = "Android";
              description.unshift("desktop mode");
            }
            if (/Accelerated *= *true/i.test(ua)) {
              description.unshift("accelerated");
            }
          } else if (name == "UC Browser" && /\bUCWEB\b/.test(ua)) {
            description.push("speed mode");
          } else if (name == "PaleMoon" && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
            description.push("identifying as Firefox " + data[1]);
          } else if (name == "Firefox" && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
            os || (os = "Firefox OS");
            product || (product = data[1]);
          } else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
            if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))) {
              name = null;
            }
            if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
              name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + " Browser";
            }
          } else if (name == "Electron" && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
            description.push("Chromium " + data);
          }
          if (!version) {
            version = getVersion([
              "(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|HeadlessChrome|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$)|UCBrowser|YaBrowser)",
              "Version",
              qualify(name),
              "(?:Firefox|Minefield|NetFront)"
            ]);
          }
          if (data = layout == "iCab" && parseFloat(version) > 3 && "WebKit" || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && "WebKit" || !layout && /\bMSIE\b/i.test(ua) && (os == "Mac OS" ? "Tasman" : "Trident") || layout == "WebKit" && /\bPlayStation\b(?! Vita\b)/i.test(name) && "NetFront") {
            layout = [data];
          }
          if (name == "IE" && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
            name += " Mobile";
            os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
            description.unshift("desktop mode");
          } else if (/\bWPDesktop\b/i.test(ua)) {
            name = "IE Mobile";
            os = "Windows Phone 8.x";
            description.unshift("desktop mode");
            version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
          } else if (name != "IE" && layout == "Trident" && (data = /\brv:([\d.]+)/.exec(ua))) {
            if (name) {
              description.push("identifying as " + name + (version ? " " + version : ""));
            }
            name = "IE";
            version = data[1];
          }
          if (useFeatures) {
            if (isHostType(context, "global")) {
              if (java) {
                data = java.lang.System;
                arch = data.getProperty("os.arch");
                os = os || data.getProperty("os.name") + " " + data.getProperty("os.version");
              }
              if (rhino) {
                try {
                  version = context.require("ringo/engine").version.join(".");
                  name = "RingoJS";
                } catch (e) {
                  if ((data = context.system) && data.global.system == context.system) {
                    name = "Narwhal";
                    os || (os = data[0].os || null);
                  }
                }
                if (!name) {
                  name = "Rhino";
                }
              } else if (typeof context.process == "object" && !context.process.browser && (data = context.process)) {
                if (typeof data.versions == "object") {
                  if (typeof data.versions.electron == "string") {
                    description.push("Node " + data.versions.node);
                    name = "Electron";
                    version = data.versions.electron;
                  } else if (typeof data.versions.nw == "string") {
                    description.push("Chromium " + version, "Node " + data.versions.node);
                    name = "NW.js";
                    version = data.versions.nw;
                  }
                }
                if (!name) {
                  name = "Node.js";
                  arch = data.arch;
                  os = data.platform;
                  version = /[\d.]+/.exec(data.version);
                  version = version ? version[0] : null;
                }
              }
            } else if (getClassOf(data = context.runtime) == airRuntimeClass) {
              name = "Adobe AIR";
              os = data.flash.system.Capabilities.os;
            } else if (getClassOf(data = context.phantom) == phantomClass) {
              name = "PhantomJS";
              version = (data = data.version || null) && data.major + "." + data.minor + "." + data.patch;
            } else if (typeof doc.documentMode == "number" && (data = /\bTrident\/(\d+)/i.exec(ua))) {
              version = [version, doc.documentMode];
              if ((data = +data[1] + 4) != version[1]) {
                description.push("IE " + version[1] + " mode");
                layout && (layout[1] = "");
                version[1] = data;
              }
              version = name == "IE" ? String(version[1].toFixed(1)) : version[0];
            } else if (typeof doc.documentMode == "number" && /^(?:Chrome|Firefox)\b/.test(name)) {
              description.push("masking as " + name + " " + version);
              name = "IE";
              version = "11.0";
              layout = ["Trident"];
              os = "Windows";
            }
            os = os && format(os);
          }
          if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ";" + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && "a")) {
            prerelease = /b/i.test(data) ? "beta" : "alpha";
            version = version.replace(RegExp(data + "\\+?$"), "") + (prerelease == "beta" ? beta : alpha) + (/\d+\+?/.exec(data) || "");
          }
          if (name == "Fennec" || name == "Firefox" && /\b(?:Android|Firefox OS|KaiOS)\b/.test(os)) {
            name = "Firefox Mobile";
          } else if (name == "Maxthon" && version) {
            version = version.replace(/\.[\d.]+/, ".x");
          } else if (/\bXbox\b/i.test(product)) {
            if (product == "Xbox 360") {
              os = null;
            }
            if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
              description.unshift("mobile mode");
            }
          } else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == "Windows CE" || /Mobi/i.test(ua))) {
            name += " Mobile";
          } else if (name == "IE" && useFeatures) {
            try {
              if (context.external === null) {
                description.unshift("platform preview");
              }
            } catch (e) {
              description.unshift("embedded");
            }
          } else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(ua) || 0)[1] || version)) {
            data = [data, /BB10/.test(ua)];
            os = (data[1] ? (product = null, manufacturer = "BlackBerry") : "Device Software") + " " + data[0];
            version = null;
          } else if (this != forOwn && product != "Wii" && (useFeatures && opera || /Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua) || name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os) || name == "IE" && (os && !/^Win/.test(os) && version > 5.5 || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua))) && !reOpera.test(data = parse.call(forOwn, ua.replace(reOpera, "") + ";")) && data.name) {
            data = "ing as " + data.name + ((data = data.version) ? " " + data : "");
            if (reOpera.test(name)) {
              if (/\bIE\b/.test(data) && os == "Mac OS") {
                os = null;
              }
              data = "identify" + data;
            } else {
              data = "mask" + data;
              if (operaClass) {
                name = format(operaClass.replace(/([a-z])([A-Z])/g, "$1 $2"));
              } else {
                name = "Opera";
              }
              if (/\bIE\b/.test(data)) {
                os = null;
              }
              if (!useFeatures) {
                version = null;
              }
            }
            layout = ["Presto"];
            description.push(data);
          }
          if (data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1]) {
            data = [parseFloat(data.replace(/\.(\d)$/, ".0$1")), data];
            if (name == "Safari" && data[1].slice(-1) == "+") {
              name = "WebKit Nightly";
              prerelease = "alpha";
              version = data[1].slice(0, -1);
            } else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
              version = null;
            }
            data[1] = (/\b(?:Headless)?Chrome\/([\d.]+)/i.exec(ua) || 0)[1];
            if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == "WebKit") {
              layout = ["Blink"];
            }
            if (!useFeatures || !likeChrome && !data[1]) {
              layout && (layout[1] = "like Safari");
              data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? "4+" : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : data < 602 ? 9 : data < 604 ? 10 : data < 606 ? 11 : data < 608 ? 12 : "12");
            } else {
              layout && (layout[1] = "like Chrome");
              data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.1 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.3 ? 11 : data < 535.01 ? 12 : data < 535.02 ? "13+" : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.1 ? 19 : data < 537.01 ? 20 : data < 537.11 ? "21+" : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != "Blink" ? "27" : "28");
            }
            layout && (layout[1] += " " + (data += typeof data == "number" ? ".x" : /[.+]/.test(data) ? "" : "+"));
            if (name == "Safari" && (!version || parseInt(version) > 45)) {
              version = data;
            } else if (name == "Chrome" && /\bHeadlessChrome/i.test(ua)) {
              description.unshift("headless");
            }
          }
          if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
            name += " ";
            description.unshift("desktop mode");
            if (data == "zvav") {
              name += "Mini";
              version = null;
            } else {
              name += "Mobile";
            }
            os = os.replace(RegExp(" *" + data + "$"), "");
          } else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
            description.unshift("desktop mode");
            name = "Chrome Mobile";
            version = null;
            if (/\bOS X\b/.test(os)) {
              manufacturer = "Apple";
              os = "iOS 4.3+";
            } else {
              os = null;
            }
          } else if (/\bSRWare Iron\b/.test(name) && !version) {
            version = getVersion("Chrome");
          }
          if (version && version.indexOf(data = /[\d.]+$/.exec(os)) == 0 && ua.indexOf("/" + data + "-") > -1) {
            os = trim(os.replace(data, ""));
          }
          if (os && os.indexOf(name) != -1 && !RegExp(name + " OS").test(os)) {
            os = os.replace(RegExp(" *" + qualify(name) + " *"), "");
          }
          if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != "Safari" && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|SRWare Iron|Vivaldi|Web)/.test(name) && layout[1])) {
            (data = layout[layout.length - 1]) && description.push(data);
          }
          if (description.length) {
            description = ["(" + description.join("; ") + ")"];
          }
          if (manufacturer && product && product.indexOf(manufacturer) < 0) {
            description.push("on " + manufacturer);
          }
          if (product) {
            description.push((/^on /.test(description[description.length - 1]) ? "" : "on ") + product);
          }
          if (os) {
            data = / ([\d.+]+)$/.exec(os);
            isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == "/";
            os = {
              "architecture": 32,
              "family": data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
              "version": data ? data[1] : null,
              "toString": function() {
                var version2 = this.version;
                return this.family + (version2 && !isSpecialCasedOS ? " " + version2 : "") + (this.architecture == 64 ? " 64-bit" : "");
              }
            };
          }
          if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
            if (os) {
              os.architecture = 64;
              os.family = os.family.replace(RegExp(" *" + data), "");
            }
            if (name && (/\bWOW64\b/i.test(ua) || useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua))) {
              description.unshift("32-bit");
            }
          } else if (os && /^OS X/.test(os.family) && name == "Chrome" && parseFloat(version) >= 39) {
            os.architecture = 64;
          }
          ua || (ua = null);
          var platform2 = {};
          platform2.description = ua;
          platform2.layout = layout && layout[0];
          platform2.manufacturer = manufacturer;
          platform2.name = name;
          platform2.prerelease = prerelease;
          platform2.product = product;
          platform2.ua = ua;
          platform2.version = name && version;
          platform2.os = os || {
            "architecture": null,
            "family": null,
            "version": null,
            "toString": function() {
              return "null";
            }
          };
          platform2.parse = parse;
          platform2.toString = toStringPlatform;
          if (platform2.version) {
            description.unshift(version);
          }
          if (platform2.name) {
            description.unshift(name);
          }
          if (os && name && !(os == String(os).split(" ")[0] && (os == name.split(" ")[0] || product))) {
            description.push(product ? "(" + os + ")" : "on " + os);
          }
          if (description.length) {
            platform2.description = description.join(" ");
          }
          return platform2;
        }
        var platform = parse();
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          root.platform = platform;
          define(function() {
            return platform;
          });
        } else if (freeExports && freeModule) {
          forOwn(platform, function(value, key) {
            freeExports[key] = value;
          });
        } else {
          root.platform = platform;
        }
      }).call(exports);
    }
  });

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
        while (stats.margin > 0.1 || stats.n < 1e6) {
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
        return {
          val: BigInt(Math.round(stats.mean)),
          boundary: stats.mean * (stats.margin / 100),
          margin: stats.margin
        };
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
        return {
          val: stats.mean,
          boundary: stats.mean * (stats.margin / 100),
          margin: stats.margin
        };
      };
      var noop = isNode_1.default ? noopNode() : noopBrowser();
      exports.default = noop;
    }
  });

  // lib/bench/tools/detectTimerResolution.js
  var require_detectTimerResolution = __commonJS({
    "lib/bench/tools/detectTimerResolution.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var runningStats_1 = require_runningStats();
      var isNode_1 = require_isNode();
      var round = (n) => {
        if (n === 0) {
          return 0;
        }
        const [whole, fraction] = String(n).split(".");
        const x = n >= 1 ? -(whole.length - 1) : Number(fraction.match(/[1-9]/)?.index) + 1;
        return Math.round(n * 10 ** x) / 10 ** x;
      };
      var getNodeSample = () => {
        const t0 = process.hrtime.bigint();
        while (true) {
          const t1 = process.hrtime.bigint();
          if (t0 !== t1) {
            return Number(t1 - t0);
          }
        }
      };
      var getBrowserSample = () => {
        const t0 = performance.now();
        while (true) {
          const t1 = performance.now();
          if (t0 !== t1) {
            return t1 - t0;
          }
        }
      };
      var detectTimerResolution = () => {
        const getSample = isNode_1.default ? getNodeSample : getBrowserSample;
        const rs = (0, runningStats_1.default)();
        let stats = { n: 0, mean: 0, margin: Infinity };
        while (stats.margin > 1 || stats.n < 1e3) {
          stats = rs(getSample());
        }
        return round(stats.mean);
      };
      exports.default = detectTimerResolution;
    }
  });

  // lib/bench/tools/timer.js
  var require_timer = __commonJS({
    "lib/bench/tools/timer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var isNode_1 = require_isNode();
      var detectTimerResolution_1 = require_detectTimerResolution();
      var noop_1 = require_noop();
      var measureNode = (test) => {
        const t0 = process.hrtime.bigint();
        test();
        const t1 = process.hrtime.bigint();
        return Number(t1 - t0 - noop_1.default.val);
      };
      var measureBrowser = (test) => {
        const t0 = performance.now();
        test();
        const t1 = performance.now();
        return t1 - t0 - noop_1.default.val;
      };
      var getTimer = () => {
        const resolution = (0, detectTimerResolution_1.default)();
        if (isNode_1.default) {
          let start2;
          return {
            measure: measureNode,
            init() {
              start2 = process.hrtime.bigint();
            },
            since() {
              return Number(process.hrtime.bigint() - start2) / 1e9;
            },
            resolution
          };
        }
        let start;
        return {
          measure: measureBrowser,
          init() {
            start = performance.now();
          },
          since() {
            return (performance.now() - start) / 1e3;
          },
          resolution
        };
      };
      exports.default = getTimer();
    }
  });

  // lib/bench/bench.js
  var require_bench = __commonJS({
    "lib/bench/bench.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var runningStats_1 = require_runningStats();
      var timer_1 = require_timer();
      var noop_1 = require_noop();
      var isNode_1 = require_isNode();
      var MIN_USEFUL_SAMPLES = 2;
      var defaultOptions = {
        minSamples: 1e3,
        minTime: 5,
        maxTime: 30,
        maxMargin: 1
      };
      var bench = async (name, test, options = {}) => {
        const rs = (0, runningStats_1.default)();
        const opt = { ...defaultOptions, ...options };
        let stats = { n: 0, mean: 0, margin: Infinity };
        let benchTime = 0;
        timer_1.default.init();
        while (true) {
          benchTime = timer_1.default.since();
          if ((benchTime > opt.maxTime || benchTime > opt.minTime && stats.n >= opt.minSamples && stats.margin < opt.maxMargin && stats.n >= MIN_USEFUL_SAMPLES) && stats.n >= MIN_USEFUL_SAMPLES) {
            break;
          }
          const time = timer_1.default.measure(test);
          stats = rs(Number(time));
        }
        console.log({ mean: stats.mean, res: timer_1.default.resolution });
        if (stats.mean <= noop_1.default.boundary) {
          stats.mean = 0;
          stats.margin = Infinity;
        }
        const ops = isNode_1.default ? 1e9 / stats.mean : 1e3 / stats.mean;
        return {
          name,
          stats: { ...stats, ops },
          time: benchTime
        };
      };
      exports.default = bench;
    }
  });

  // lib/bench/run.js
  var require_run = __commonJS({
    "lib/bench/run.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var platform = require_platform();
      var noop_1 = require_noop();
      var bench_1 = require_bench();
      var format = (num) => {
        const [whole, fraction] = String(num).split(".");
        const chunked = [];
        whole.split("").reverse().forEach((char, index) => {
          if (index % 3 === 0) {
            chunked.unshift([char]);
          } else {
            chunked[0].unshift(char);
          }
        });
        return chunked.map((chunk) => chunk.join("")).join(" ") + (fraction ? `.${fraction}` : "");
      };
      var display = ({ name, stats, time }) => {
        const ops = stats.ops === Infinity ? "MAX" : format(Number(stats.ops.toFixed(2)));
        const margin = stats.margin === Infinity ? "" : `\xB1${stats.margin.toFixed(2)}% `;
        console.log(`Custom - ${name}:`);
        console.log(`${ops} ops/s ${margin}(${format(stats.n)} samples in ${time.toFixed(2)}s)
`);
      };
      var main = async () => {
        const data = new Array(1e3).fill(null).map((_, i) => i);
        const options = {
          minSamples: 1e3,
          minTime: 5,
          maxTime: 30,
          maxMargin: 1
        };
        console.log({ noop: noop_1.default });
        console.log(`Platform: ${platform.description}
`);
        await (0, bench_1.default)("empty", () => {
        }, options).then(display);
        await (0, bench_1.default)("sum", () => {
          1 + 1;
        }, options).then(display);
        await (0, bench_1.default)("sum 2 elements", () => {
          ;
          [1, 2].reduce((a, b) => a + b);
        }, options).then(display);
        await (0, bench_1.default)("sum 5 elements", () => {
          ;
          [1, 2, 3, 4, 5].reduce((a, b) => a + b);
        }, options).then(display);
        await (0, bench_1.default)(`sum ${data.length} elements`, () => {
          data.reduce((a, b) => a + b);
        }, options).then(display);
      };
      main();
    }
  });
  require_run();
})();
/*!
 * Platform.js v1.3.6
 * Copyright 2014-2020 Benjamin Tan
 * Copyright 2011-2013 John-David Dalton
 * Available under MIT license
 */
