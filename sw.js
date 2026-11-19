// 本地圖片離線版。四張官方圖片齊備後，首次連線會預先快取所有內容。
const CACHE='constitution-adventure-interactive-v6-checked';
const FILES=['./','./index.html','./images/national-flag.png','./images/national-emblem.png','./images/hk-flag.gif','./images/hk-emblem.gif'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('constitution-adventure-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const u=new URL(event.request.url);if(u.origin!==self.location.origin)return;event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(event.request);if(hit)return hit;try{const r=await fetch(event.request);if(r.ok)c.put(event.request,r.clone()).catch(()=>{});return r}catch(e){if(event.request.mode==='navigate')return (await c.match('./index.html'))||Response.error();return Response.error()}})())});
