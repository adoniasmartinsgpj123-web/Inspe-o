const C='inspecao-canteiro-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./config.js','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// Abre do cache na hora (funciona offline) e, se houver internet, baixa a versão nova para a próxima abertura
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  const net=fetch(e.request).then(res=>{ if(res&&res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(e.request,cp)); } return res; }).catch(()=>null);
  e.waitUntil(net.then(()=>{}));
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||net.then(r=>r||caches.match('./index.html'))));
});
