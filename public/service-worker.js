var FILES = importScripts('files.json')
var CACHE = 'vocadventure'

self.addEventListener('install', function (event) {
  console.log('Installing service worker...')

  event.waitUntil(precache())
})

self.addEventListener('fetch', function (event) {
  console.log('Serving the assets...')
  event.respondWith(fromCache(event.request))
  if (JSON.parse(window.localStorage.getItem('allowUpdates'))) {
    event.waitUntil(update(event.request))
  }
})

function precache () {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(Object.values(FILES))
  })
}

function fromCache (request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match')
    })
  })
}

function update (request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response)
    })
  })
}
