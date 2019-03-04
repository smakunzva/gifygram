// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"sw.js":[function(require,module,exports) {
var pwaKey = 'udemy-pwa1.0';
var gifyKey = 'gify-v0.1';
var localRes = ['index.html', 'main.js', 'images/flame.png', 'images/icon.png', 'images/launch.png', 'images/logo.png', 'vendor/bootstrap-4.3.1-dist/css/bootstrap.min.css', 'vendor/jquery-3.3.1.js']; // intercept network request

self.addEventListener('fetch', function (e) {
  //App shell 
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request, pwaKey));
  } //API request
  else if (e.request.url.match('api.giphy.com/v1/gifs/trending')) {
      e.respondWith(cacheFallBack(e.request));
    } //Gify
    else if (e.request.url.match('.giphy.com/media/')) {
        e.respondWith(staticCache(e.request, gifyKey));
      }
}); //Clear gifys that are not active on the app

var clearGify = function clearGify(gifys) {
  //open cache
  caches.open(gifyKey).then(function (cache) {
    //get cache keys
    cache.keys().then(function (keys) {
      keys.forEach(function (key) {
        //If cache entry is not part of current gifys delete
        if (!gifys.includes(key.url)) {
          cache.delete(key);
        }
      });
    });
  });
}; // Dynamic content: Network with cache fallback


var cacheFallBack = function cacheFallBack(req) {
  return fetch(req).then(function (networkRes) {
    //Response not ok throw an error
    if (!networkRes.ok) {
      throw 'Fetch error response';
    } //Update cache when response is okay


    caches.open(pwaKey).then(function (cache) {
      return cache.put(req, networkRes);
    });
    return networkRes.clone();
  }) // Check the request in the cache
  .catch(function (err) {
    return caches.match(req);
  });
}; // Static cache local resources with network fallback strategy


var staticCache = function staticCache(req, cacheName) {
  return caches.match(req).then(function (cacheResponse) {
    if (cacheResponse) {
      return cacheResponse;
    }

    return fetch(req).then(function (networkResponse) {
      caches.open(cacheName).then(function (cache) {
        cache.put(req, networkResponse);
      });
      return networkResponse.clone();
    });
  });
}; // Service worker installed


self.addEventListener('install', function (e) {
  console.log('Service worker installing'); //Open and create the cache
  //if(window.caches) {

  var resourcesAdded = caches.open(pwaKey).then(function (cache) {
    return cache.addAll(localRes);
  }).catch(function (reason) {
    console.log(reason);
  });
  e.waitUntil(resourcesAdded); //}
}); // Service worker installed
// Cleanup and delete old cache

self.addEventListener('activate', function (e) {
  console.log('Service worker activated');
  e.waitUntil(caches.keys().then(function (keys) {
    keys.forEach(function (key) {
      if (key !== pwaKey && key.match('udemy')) {
        console.log('Old cache udemy key deleted');
        caches.delete(key);
      }

      if (key !== gifyKey && key.match('gify')) {
        console.log('Old cache gify key deleted');
        caches.delete(key);
      }
    });
  }));
});
self.addEventListener('message', function (e) {
  if (e.data.action === 'clearGify') {
    console.log('Message received to clear gifys');
    clearGify(e.data.gifys);
  }
});
},{}],"../../../../.nvm/versions/node/v10.11.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54119" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../.nvm/versions/node/v10.11.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","sw.js"], null)
//# sourceMappingURL=/sw.map