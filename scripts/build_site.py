"""Build the tablet-ready static PWA. No server-side account or user data required."""
from pathlib import Path
import json, sys, subprocess, hashlib
from PIL import Image, ImageDraw
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'dist'
out.mkdir(parents=True,exist_ok=True)
index=out/'index.html'
subprocess.run([sys.executable,str(root/'scripts/build_standalone.py'),str(index)],check=True)
for size in [192,512]:
    im=Image.new('RGB',(size,size),'#203b32'); d=ImageDraw.Draw(im); pad=int(size*.17)
    d.rounded_rectangle((pad,pad,size-pad,size-pad),radius=int(size*.11),fill='#e5efe2')
    gap=int(size*.045); box=int(size*.18); start=(size-2*box-gap)//2
    for r in range(2):
        for c in range(2):
            x=start+c*(box+gap);y=start+r*(box+gap)
            d.rounded_rectangle((x,y,x+box,y+box),radius=int(size*.03),fill=['#608771','#36564a','#c1a36b','#749889'][r*2+c])
    im.save(out/f'icon-{size}.png')
manifest={'id':'./','name':'내 보드게임 룰마스터','short_name':'룰마스터','lang':'ko','start_url':'./','scope':'./','display':'standalone','background_color':'#f4f5ef','theme_color':'#203b32','icons':[{'src':f'icon-{s}.png','sizes':f'{s}x{s}','type':'image/png','purpose':'any'} for s in [192,512]]}
(out/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
s=index.read_text().replace('</head>','<meta name="theme-color" content="#203b32"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"></head>',1)
# Register only on HTTPS or local development. The standalone release does not register a worker.
s=s.replace('</body></html>','<script>if("serviceWorker" in navigator&&window.isSecureContext){navigator.serviceWorker.register("sw.js").catch(e=>console.warn("Offline cache unavailable",e))}</script></body></html>')
index.write_text(s)
version=hashlib.sha256(index.read_bytes()).hexdigest()[:16]
(out/'sw.js').write_text('''// Network-first for the document so online users receive updates. Offline fallback is the last cached complete app.
const CACHE='rulemaster-'''+version+'''',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rulemaster-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{let r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(async res=>{if(res.ok){let c=await caches.open(CACHE);await c.put('./index.html',res.clone())}return res}).catch(()=>caches.match('./index.html')));return;}
 if(FILES.some(f=>new URL(f,self.registration.scope).href===u.href))e.respondWith(caches.match(r).then(v=>v||fetch(r)));
});
''')
(out/'.nojekyll').write_text('')
print(f'PWA ready: {out} ({version})')
