let pwaKey = 'udemy-pwa1.0';
let gifyKey = 'gify-v0.1';
let localRes = ['index.html','main.js', 'images/flame.png','images/icon.png','images/launch.png', 'images/logo.png'
, 'vendor/bootstrap-4.3.1-dist/css/bootstrap.min.css', 'vendor/jquery-3.3.1.js'];

// intercept network request
self.addEventListener('fetch', (e)=> {

 //App shell 
  if(e.request.url.match(location.origin)){
    e.respondWith(
      staticCache(e.request, pwaKey)
    )
  }

  //API request
  else if(e.request.url.match('api.giphy.com/v1/gifs/trending')) {
    e.respondWith(
      cacheFallBack(e.request)
    )
  }

  //Gify
  else if(e.request.url.match('.giphy.com/media/')){
    e.respondWith(
      staticCache(e.request, gifyKey)
    )
  }

})

//Clear gifys that are not active on the app
const clearGify = (gifys)=> {

  //open cache
  caches.open(gifyKey).then((cache)=> {
    //get cache keys
    cache.keys().then((keys)=> {
      keys.forEach((key)=> {

        //If cache entry is not part of current gifys delete
        if(!gifys.includes(key.url)){
          cache.delete(key);
        }
      })
    })
  })
}

// Dynamic content: Network with cache fallback
const cacheFallBack = (req)=> {

  return fetch(req).then((networkRes)=> {
    //Response not ok throw an error
    if(!networkRes.ok) {
      throw 'Fetch error response';
    }

    //Update cache when response is okay
    caches.open(pwaKey).then(cache => cache.put(req, networkRes))
    return networkRes.clone();

  })
  // Check the request in the cache
  .catch(err => caches.match(req))
}


// Static cache local resources with network fallback strategy
const staticCache = (req, cacheName) => {
    
  return caches.match(req).then((cacheResponse)=> {
    if(cacheResponse){
      return cacheResponse
    }
      return fetch(req).then((networkResponse)=> {

          caches.open(cacheName).then((cache)=> {
            cache.put(req, networkResponse)
          })
          return networkResponse.clone();
      })
  })
}

// Service worker installed
self.addEventListener('install', (e)=> {

console.log('Service worker installing')

  //Open and create the cache
  //if(window.caches) {
    let resourcesAdded = caches.open(pwaKey).then((cache)=> {
      return cache.addAll(localRes);
    }).catch((reason)=> {
      console.log(reason)
    })
    e.waitUntil(resourcesAdded);
  //}
})

// Service worker installed
// Cleanup and delete old cache
self.addEventListener('activate', (e)=> {
   console.log('Service worker activated')

   e.waitUntil(   
    caches.keys().then((keys)=> {
      keys.forEach((key)=> {
        if(key !== pwaKey && key.match('udemy')) {
          console.log('Old cache udemy key deleted');
          caches.delete(key);
        }
        if (key !== gifyKey && key.match('gify')) {
          console.log('Old cache gify key deleted');
          caches.delete(key);
        }
    })
  }))

})

self.addEventListener('message', (e)=> {
  if(e.data.action === 'clearGify'){
    console.log('Message received to clear gifys')
    clearGify(e.data.gifys);
  }
})

