// Both GSI and JMA use XYZ Web Mercator tiles. Child tiles cover exactly the
// same bounds, while their extra labels remain legible on larger displays.
function updateGSIBasemap(tile, zoom){
  if(!tile) return;
  const layer=document.getElementById('gsiBasemap');
  const factor=document.getElementById('cloudMap').clientWidth>=480?2:1;
  const z=zoom+(factor===2?1:0), key=`${z}/${tile.x}/${tile.y}/${factor}`;
  if(layer.dataset.key===key) return;
  layer.dataset.key=key;
  const grid=document.createElement('div'); grid.className='gsi-grid';
  grid.style.gridTemplateColumns=`repeat(${factor},1fr)`;
  grid.style.gridTemplateRows=`repeat(${factor},1fr)`;
  layer.replaceChildren(grid);
  setBasemapStatus('map_loading');
  let pending=factor*factor, loaded=0;
  for(let y=0;y<factor;y++) for(let x=0;x<factor;x++){
    const img=new Image(); img.alt=''; img.decoding='async'; img.draggable=false;
    let settled=false;
    const finish=ok=>{
      if(settled) return;
      settled=true; clearTimeout(timer); img.onload=img.onerror=null;
      if(ok){ loaded++; img.classList.add('is-ready'); }
      pending--;
      // A coordinate or breakpoint change must never expose a stale tile/status.
      if(!pending && grid.parentElement===layer) setBasemapStatus(loaded===factor*factor?'':loaded?'map_partial':'map_failed');
    };
    const timer=setTimeout(()=>finish(false),12000);
    img.onload=()=>finish(true); img.onerror=()=>finish(false);
    grid.append(img);
    img.src=`https://cyberjapandata.gsi.go.jp/xyz/pale/${z}/${tile.x*factor+x}/${tile.y*factor+y}.png`;
  }
}
function setBasemapStatus(key){
  document.getElementById('basemapStatus').dataset.key=key;
  syncBasemapStatus();
}
function syncBasemapStatus(){
  const status=document.getElementById('basemapStatus');
  status.textContent=status.dataset.key?t(status.dataset.key):'';
}

/* Display-only relief: the original precipitation pixels remain the source for all measurements. */
function renderCloudTexture(source, canvas){
  const size=1024, pad=16, extent=288;
  const mask=document.createElement('canvas');
  mask.width=mask.height=size;
  const ctx=mask.getContext('2d',{willReadFrequently:true});
  // Convert precipitation coverage to neutral density before interpolation: palette hues
  // must never become false edges in the cloud surface.
  const small=document.createElement('canvas'); small.width=small.height=256;
  const sc=small.getContext('2d',{willReadFrequently:true}); sc.drawImage(source,0,0,256,256);
  const data=sc.getImageData(0,0,256,256);
  for(let i=0;i<data.data.length;i+=4){
    const p=data.data, rain=p[i+3]>20 && !(p[i]>245&&p[i+1]>245&&p[i+2]>245);
    const density=rain ? .42+.58*Math.log1p(inferRainMm(p[i],p[i+1],p[i+2]).mm)/Math.log(91) : 0;
    p[i]=p[i+1]=p[i+2]=255; p[i+3]=Math.round(density*255);
  }
  sc.putImageData(data,0,0);
  ctx.filter=`blur(${size/extent*2.2}px)`;
  const unit=size/extent, inset=pad*unit, span=256*unit, spill=7*unit;
  // Only edge coverage spills into the decorative margin; no new rain cells are added.
  ctx.drawImage(small,0,0,1,256,inset-spill,inset,spill,span);
  ctx.drawImage(small,255,0,1,256,inset+span,inset,spill,span);
  ctx.drawImage(small,0,0,256,1,inset,inset-spill,span,spill);
  ctx.drawImage(small,0,255,256,1,inset,inset+span,span,spill);
  ctx.drawImage(small,inset,inset,span,span);
  const coverage=ctx.getImageData(0,0,size,size).data;
  const heights=new Float32Array(size*size);
  const hash=(x,y)=>{let n=Math.imul(x,374761393)+Math.imul(y,668265263); n=Math.imul(n^(n>>>13),1274126177); return ((n^(n>>>16))>>>0)/4294967295;};
  const noise=(x,y)=>{
    const ix=Math.floor(x),iy=Math.floor(y); let fx=x-ix,fy=y-iy;
    fx=fx*fx*(3-2*fx); fy=fy*fy*(3-2*fy);
    const a=hash(ix,iy),b=hash(ix+1,iy),c=hash(ix,iy+1),d=hash(ix+1,iy+1);
    return (a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy;
  };
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const i=y*size+x, density=coverage[i*4+3]/255;
    if(density<.004) continue;
    const u=x/size*extent,v=y/size*extent;
    const billow=.76*noise(u*.065,v*.065)+.19*noise(u*.16+43,v*.16)+.04*noise(u*.4,v*.4+71)+.01*noise(u*.9,v*.9);
    heights[i]=Math.pow(density,.65)*(.35+billow*.95);
  }
  canvas.width=canvas.height=size;
  const out=canvas.getContext('2d'), pixels=out.createImageData(size,size);
  for(let y=1;y<size-1;y++) for(let x=1;x<size-1;x++){
    const i=y*size+x,h=heights[i]; if(!h) continue;
    const slope=(heights[i-1]-heights[i+1])*.65+(heights[i-size]-heights[i+size])*.85;
    const light=Math.max(0,Math.min(1,.24+slope*12+h*.65));
    const k=i*4;
    pixels.data[k]=105+light*145; pixels.data[k+1]=127+light*123; pixels.data[k+2]=146+light*107;
    pixels.data[k+3]=Math.min(248,coverage[k+3]*2.8)*Math.min(1,h*8);
  }
  out.putImageData(pixels,0,0);
}

function renderCloudAxes(tile, zoom){
  if(!tile) return;
  const n=2**zoom;
  const lon=f=>(tile.x+f)/n*360-180;
  const lat=f=>Math.atan(Math.sinh(Math.PI*(1-2*(tile.y+f)/n)))*180/Math.PI;
  const format=(value,pos,neg)=>`${Math.abs(value).toFixed(2)}°${value<0?neg:pos}`;
  const parts=[];
  for(let i=0;i<=4;i++){
    const p=i*64,f=i/4;
    if(i>0&&i<4) parts.push(`<path d="M ${p} 0 V 256 M 0 ${p} H 256" stroke="#91afc3" stroke-opacity=".13" stroke-dasharray="2 4" fill="none"/>`);
    parts.push(`<path d="M ${p} 256 v 4 M 0 ${p} h -4" stroke="#93afc3" fill="none"/>`);
    if(i%2===0) parts.push(`<text x="${p}" y="269" text-anchor="middle">${format(lon(f),'E','W')}</text><text x="-7" y="${p+2}" text-anchor="end">${format(lat(f),'N','S')}</text>`);
  }
  const mapWidth=document.getElementById('cloudMap').clientWidth;
  const fontSize=Math.max(6.4,10*256/Math.max(1,mapWidth));
  document.getElementById('cloudAxes').innerHTML=`<g fill="#a4bdcf" font-family="system-ui,sans-serif" font-size="${fontSize}">${parts.join('')}</g>`;
  // Ground distance at the tile's centre latitude; scale follows responsive map width.
  const km=40075.016686*Math.cos(lat(.5)*Math.PI/180)/n;
  const target=km/4, exponent=10**Math.floor(Math.log10(target));
  const distance=[5,2,1].map(v=>v*exponent).find(v=>v<=target)||exponent/2;
  const scale=document.getElementById('cloudScale');
  scale.innerHTML=`<span>≈ ${distance} km</span><i></i>`;
  scale.style.flexShrink='0';
  // The scale container only occupies the length of its bar in the footer.
  scale.style.width=(distance/km*document.getElementById('cloudMap').clientWidth)+'px';
  scale.querySelector('i').style.width='100%';
}
