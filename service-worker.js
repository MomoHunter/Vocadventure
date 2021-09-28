importScripts('files.js');
var CACHE_NAME = 'vocadventure';
var CACHE_NAME_TEMP = 'vocadventure-temp';
var useTemp = false;
var CACHE = caches || CacheStorage;

self.addEventListener('install', (event) => {
  sendMessage({ type: 'newUpdate' });
  event.waitUntil(renewCache());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fromCache(event.request));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'update') {
    renewCache();
  }
});

function renewCache () {
  return new Promise((resolve, reject) => {
    let openRequest = indexedDB.open('updatedb');
  
    openRequest.onupgradeneeded = (event) => {
      let db = event.target.result;
      db.createObjectStore('allow', { autoIncrement: false, keyPath: 'index' });
    };
  
    openRequest.onsuccess = (event) => {
      let db = event.target.result; // returned database
      let trans = db.transaction(['allow'], 'readonly');
  
      trans.objectStore('allow').get(1).onsuccess = (event) => {
        if (event.target.result) {
          resolve(event.target.result.value);
        } else {
          resolve(true);
        }
      };
    };
  
    openRequest.onerror = (event) => {
      resolve(true);
    };
  }).then((allowUpdates) => {
    return CACHE.has(CACHE_NAME).then((cacheExists) => {
      if (cacheExists && allowUpdates) {
        return cacheAll(CACHE_NAME_TEMP).then(() => {
          useTemp = true;
          return CACHE.delete(CACHE_NAME).then((cacheDeleted) => {
            if (cacheDeleted) {
              return cacheAll(CACHE_NAME).then(() => {
                useTemp = false;
                CACHE.delete(CACHE_NAME_TEMP);
                sendMessage({ type: 'updateFinished' });
                return true;
              });
            }
            return true;
          });
        });
      } else if (!cacheExists) {
        return cacheAll(CACHE_NAME);
      } else {
        return Promise.resolve('Updates are turned off.');
      }
    });
  });
}

function cacheAll (cacheName) {
  return new Promise((resolve, reject) => {
    CACHE.open(cacheName).then((cache) => {
      let amount = Object.values(FILES).length;
      let finished = 0;
      for (let url of Object.values(FILES)) {
        cache.match(url).then((response) => {
          if (!response || !response.ok) {
            cache.add(url).then(() => {
              finished += 1;
              if (amount === finished) {
                resolve(true);
              }
            }).catch((error) => {
              console.error(error, url);
              amount -= 1;
              if (amount === finished) {
                resolve(true);
              }
            });
          } else {
            amount -= 1;
            if (amount === finished) {
              resolve(true);
            }
          }
        });
      }
      if (amount === 0) {
        resolve(true);
      }
    });
  })
}

function fromCache (request) {
  let cacheName = useTemp ? CACHE_NAME_TEMP : CACHE_NAME;
  return CACHE.open(cacheName).then((cache) => {
    return cache.match(request).then((matching) => {
      if (!matching || !matching.ok) {
        return fetch(request).then((response) => {
          return cache.put(request, response);
        }).then(() => {
          return cache.match(request).then((matching) => {
            return matching;
          });
        }).catch((error) => {
          console.error(error, request.url);
          return new Response();
        });
      }
      return matching;
    });
  });
}

function sendMessage (data) {
  self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    if (clients && clients.length) {
      for (let client of clients) {
        client.postMessage(data);
      }
    }
  }).catch((error) => {
    console.error(error);
  });
}
