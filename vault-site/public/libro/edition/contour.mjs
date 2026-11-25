// Fixed art + a live CSS float exclusion in the scroll coordinate system.
export function attachContour(page,reading,prose,art,title,mask){
 let frame=0,profile=[],drawnHeight=0,oldShape='',disposed=false;
 const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
 function measure(){
  if(!art.naturalWidth||!page.clientWidth)return;
  const p=page.getBoundingClientRect(),a=art.getBoundingClientRect(),t=title.getBoundingClientRect();
  const width=reading.clientWidth-parseFloat(getComputedStyle(reading).paddingRight);
  const height=reading.clientHeight;
  const offsetX=a.left-p.left,offsetY=a.top-p.top;
  const w=Math.max(1,Math.round(a.width)),h=Math.max(1,Math.round(a.height));
  ctx.canvas.width=w;ctx.canvas.height=h;ctx.drawImage(art,0,0,w,h);
  const pixels=ctx.getImageData(0,0,w,h).data;
  profile=[];
  for(let y=0;y<=height;y+=6){
   let right=0;
   for(let yy=Math.max(0,Math.floor(y-offsetY-7));yy<Math.min(h,Math.ceil(y-offsetY+13));yy++){
    for(let x=w-1;x>=0;x--){if(pixels[(yy*w+x)*4+3]>=86){right=Math.max(right,offsetX+x);break}}
   }
   if(y+12>=t.top-p.top&&y-6<=t.bottom-p.top)right=Math.max(right,t.right-p.left);
   profile.push(Math.round(Math.min(width-145,Math.max(12,right+12))));
  }
  drawnHeight=Math.max(height,drawnHeight);
  oldShape='';update();
 }
 function update(){
  if(disposed||!profile.length)return;
  const height=reading.clientHeight,top=reading.scrollTop;
  const base=Math.round(profile.reduce((a,b)=>a+b,0)/profile.length);
  const start=Math.max(0,top-parseFloat(getComputedStyle(reading).paddingTop));
  const extent=Math.max(height,drawnHeight,start+height);
  const pts=['0px 0px',(start>0?base:profile[0])+'px 0px'];
  if(start>0)pts.push(base+'px '+Math.max(0,start-1)+'px');
  profile.forEach((x,i)=>pts.push(x+'px '+Math.round(start+i*6)+'px'));
  pts.push(base+'px '+Math.min(Math.ceil(extent),Math.round(start+height+1))+'px',base+'px '+Math.ceil(extent)+'px','0px '+Math.ceil(extent)+'px');
  const shape='polygon('+pts.join(',')+')';
  if(shape!==oldShape){oldShape=shape;mask.style.height=Math.ceil(extent)+'px';mask.style.shapeOutside=shape;}
  // Measure the narrative, not the float, so empty space cannot grow indefinitely.
  const last=prose.lastElementChild;
  const bottom=last.getBoundingClientRect().bottom-prose.getBoundingClientRect().top;
  drawnHeight=Math.max(height,Math.ceil(bottom));
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;update()})}
 const observer=new ResizeObserver(()=>{drawnHeight=0;measure()});observer.observe(page);
 reading.addEventListener('scroll',schedule,{passive:true});
 art.addEventListener('load',measure);if(art.complete)measure();
 document.fonts.ready.then(()=>{if(!disposed)measure()});
 return ()=>{disposed=true;observer.disconnect();reading.removeEventListener('scroll',schedule);art.removeEventListener('load',measure);cancelAnimationFrame(frame)};
}
