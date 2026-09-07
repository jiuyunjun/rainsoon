// Both GSI and JMA use XYZ Web Mercator tiles. Child tiles cover exactly the
// same bounds, while their boundary lines stay crisp on larger displays.
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
    img.src=`https://cyberjapandata.gsi.go.jp/xyz/blank/${z}/${tile.x*factor+x}/${tile.y*factor+y}.png`;
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
    const density=rain ? .08+.92*Math.log1p(inferRainMm(p[i],p[i+1],p[i+2]).mm)/Math.log(91) : 0;
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
  // Overlapping rounded lobes, not high-frequency surface noise. Fixed seeds keep
  // the relief stable when switching forecast frames or reopening the same tile.
  const lobes=new Float32Array(extent*extent);
  const hash=(x,y)=>{let n=Math.imul(x,374761393)+Math.imul(y,668265263); n=Math.imul(n^(n>>>13),1274126177); return ((n^(n>>>16))>>>0)/4294967295;};
  for(const [spacing,amplitude] of [[23,1],[11,.24],[5,.035]]){
    for(let gy=-1;gy<extent/spacing+1;gy++) for(let gx=-1;gx<extent/spacing+1;gx++){
      const cx=(gx+hash(gx+91,gy))*spacing,cy=(gy+hash(gx,gy+73))*spacing;
      const radius=spacing*(.65+hash(gx+11,gy+19)*.55);
      const weight=amplitude*(.65+hash(gx+39,gy+41)*.7);
      for(let y=Math.max(0,Math.floor(cy-radius));y<Math.min(extent,cy+radius);y++){
        for(let x=Math.max(0,Math.floor(cx-radius));x<Math.min(extent,cx+radius);x++){
          const r2=((x-cx)**2+(y-cy)**2)/(radius*radius);
          if(r2<1) lobes[y*extent+x]+=weight*(1-r2)**2;
        }
      }
    }
  }
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const i=y*size+x,density=coverage[i*4+3]/255;
    if(density<.004) continue;
    const u=x/size*(extent-1),v=y/size*(extent-1),ix=Math.floor(u),iy=Math.floor(v),fx=u-ix,fy=v-iy;
    const j=iy*extent+ix;
    const billow=(lobes[j]*(1-fx)+lobes[j+1]*fx)*(1-fy)+(lobes[j+extent]*(1-fx)+lobes[j+extent+1]*fx)*fy;
    // Height is an illustrative rain-intensity encoding in source-pixel units,
    // not a measurement of atmospheric cloud height. No geographic displacement.
    heights[i]=22*Math.pow(density,1.35)*(.38+billow*.85);
  }
  canvas.width=canvas.height=size;
  const out=canvas.getContext('2d'), pixels=out.createImageData(size,size);
  const step=2,derivative=2*step*extent/size;
  for(let y=step;y<size-step;y++) for(let x=step;x<size-step;x++){
    const i=y*size+x,h=heights[i]; if(!h) continue;
    const density=coverage[i*4+3]/255;
    const nx=(heights[i-step]-heights[i+step])/derivative;
    const ny=(heights[i-step*size]-heights[i+step*size])/derivative;
    const diffuse=Math.max(0,(-.48*nx-.56*ny+.68)/Math.hypot(nx,ny,1));
    // Short soft-shadow march towards the upper-left light source. Tall lobes
    // shade adjacent valleys, giving thick rain cores a readable sense of depth.
    let shadow=0;
    for(let k=1;k<=5;k++){
      const sx=x-k*9,sy=y-k*11;
      if(sx<0||sy<0) break;
      shadow=Math.max(shadow,Math.min(1,Math.max(0,(heights[sy*size+sx]-h-k*2.7)/5)));
    }
    const light=Math.max(0,Math.min(1,.32+diffuse*.66-shadow*.12));
    const k=i*4;
    pixels.data[k]=65+light*184; pixels.data[k+1]=85+light*167; pixels.data[k+2]=110+light*145;
    // Optical depth: weak cells stay transparent; stronger cells gain an opaque
    // body, rather than all palette buckets saturating to the same flat white.
    pixels.data[k+3]=255*(1-Math.exp(-density*3.8))*Math.min(1,h*1.8);
  }
  out.putImageData(pixels,0,0);
}

// Render two low-resolution wispy veils once per frame. Only their transform and
// opacity animate; the expensive relief and measured rain footprint stay still.
function renderCloudMist(source){
  const wrap=document.getElementById('cloudMist');
  wrap.querySelectorAll('canvas').forEach((canvas,layer)=>{
    const size=512;
    canvas.width=canvas.height=size;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.filter='blur(3px)';
    ctx.drawImage(source,0,0,size,size);
    ctx.filter='none';
    const pixels=ctx.getImageData(0,0,size,size);
    for(let y=0;y<size;y++) for(let x=0;x<size;x++){
      const i=(y*size+x)*4;
      // Broad, winding ribbons break up the veil without adding dry-area clouds.
      const bend=Math.sin(x*.021+layer*2.4)*18+Math.sin(x*.047+y*.011)*7;
      const ribbon=.5+.5*Math.sin((y+bend)*.075+layer*3);
      pixels.data[i]=204;pixels.data[i+1]=220;pixels.data[i+2]=232;
      pixels.data[i+3]*=(.16+.8*ribbon*ribbon);
    }
    ctx.putImageData(pixels,0,0);
  });
  wrap.hidden=false;
  syncCloudMotion();
}
const cloudMotionMedia=matchMedia('(prefers-reduced-motion: reduce)');
let cloudMotionOverride=null;
function cloudMotionEnabled(){ return cloudMotionOverride ?? !cloudMotionMedia.matches; }
function syncCloudMotion(){
  const enabled=cloudMotionEnabled();
  document.documentElement.classList.toggle('mist-motion-on',enabled);
  const button=document.getElementById('cloudMotionToggle');
  button.textContent=t(enabled?'cloud_motion_on':'cloud_motion_off');
  button.setAttribute('aria-pressed',String(enabled));
  button.disabled=document.getElementById('cloudMap').classList.contains('raw-view');
}
cloudMotionMedia.addEventListener('change',syncCloudMotion);
document.addEventListener('visibilitychange',()=>{
  document.documentElement.classList.toggle('page-hidden',document.hidden);
});

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
