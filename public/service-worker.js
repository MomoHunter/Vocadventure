importScripts('files.js');
var CACHE = 'vocadventure';
var allowUpdates = false;

self.addEventListener('install', function (event) {
  event.waitUntil(precache());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(fromCache(event.request));
  if (allowUpdates) {
    event.waitUntil(update(event.request));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'allowUpdates') {
    allowUpdates = event.data.value
  }
})

function precache () {
  return caches.open(CACHE).then(function (cacheobj) {
    for (let url of Object.values(FILES)) {
      fetch(url).then(function(response) {
        if (!response.ok) {
          throw new TypeError('bad response status ' + url);
        }
      });
    }
    return cacheobj.addAll(Object.values(FILES));
  });
}

function fromCache (request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching) {
        return fetch(request).then(function (response) {
          return cache.put(request, response);
        });
      }
      return matching;
    });
  });
}

function update (request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}
