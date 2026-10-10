const W=1080,H=1920,c=document.getElementById('c'),x=c.getContext('2d');
const IM={};['10','11','12','13','14'].forEach(k=>{IM[k]=new Image();IM[k].src='photos/p'+k+'.jpg'});
window.ready=()=>Object.values(IM).every(i=>i.complete&&i.naturalWidth);
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const eo=t=>1-Math.pow(1-cl(t),3);
const back=t=>{t=cl(t);const s=1.7;return 1+(s+1)*Math.pow(t-1,3)+s*Math.pow(t-1,2)};
function photo(k,fx,fy,z,blur=0,dark=0){const im=IM[k];let s=H/im.naturalHeight*z;
 let dx=W/2-fx*s,dy=H/2-fy*s;dx=Math.min(0,Math.max(W-im.naturalWidth*s,dx));dy=Math.min(0,Math.max(H-im.naturalHeight*s,dy));
 x.save();if(blur)x.filter=`blur(${blur}px)`;x.drawImage(im,dx,dy,im.naturalWidth*s,im.naturalHeight*s);x.restore();
 if(dark){x.fillStyle=`rgba(0,0,0,${dark})`;x.fillRect(0,0,W,H)}}
function T(s,px,py,size,col='#fff',sc=1,al=1,st=1){if(sc<=0.01||al<=0)return;x.save();x.globalAlpha=cl(al);x.translate(px,py);x.scale(sc,sc);
 x.font=`bold ${size}px IPAGothic`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
 if(st){x.lineWidth=size*0.22;x.strokeStyle='#000';x.strokeText(s,0,0);}x.fillStyle=col;x.fillText(s,0,0);x.restore()}
const pop=(u,st)=>u<st?0:back((u-st)/0.28);
function flash(u,d=0.12){if(u<d){x.fillStyle=`rgba(255,255,255,${1-u/d})`;x.fillRect(0,0,W,H)}}
function rr(X,Y,w,h,r){x.beginPath();x.roundRect(X,Y,w,h,r)}
// ---- 共通の図 ----
function bg(col){x.fillStyle=col;x.fillRect(0,0,W,H)}
function bayMap(hl=1){ // 広島湾の地図。宮島(m=1)を赤く
 bg('#0e2a47');const L0=132.17,L1=132.45,A1=34.40,k=W/(L1-L0),ky=k/Math.cos(34.3*Math.PI/180);
 const px=lo=>(lo-L0)*k,py=la=>520+(A1-la)*ky;
 for(const m of BAY){x.beginPath();m.p.forEach((q,i)=>i?x.lineTo(px(q[0]),py(q[1])):x.moveTo(px(q[0]),py(q[1])));x.closePath();
  x.fillStyle=m.m?`rgba(${Math.round(42+187*hl)},${Math.round(74-17*hl)},${Math.round(58-5*hl)},1)`:'#2a4a3a';x.fill();x.strokeStyle='#5d8c74';x.lineWidth=3;x.stroke()}
 return [px,py]}
function grave(cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='#9aa0a6';rr(-45,-150,90,150,10);x.fill();
 x.fillStyle='#7d838a';x.fillRect(-80,0,160,34);x.fillRect(-100,34,200,30);x.restore()}
function cross(cx,cy,r,s){if(!s)return;x.save();x.translate(cx,cy);x.scale(s,s);x.strokeStyle='#ff5252';x.lineWidth=26;x.lineCap='round';
 x.beginPath();x.moveTo(-r,-r);x.lineTo(r,r);x.moveTo(r,-r);x.lineTo(-r,r);x.stroke();x.restore()}
function torii(cx,by,s,boxOpen=0){ // 大鳥居の簡単な図。by=柱の下端
 x.save();x.translate(cx,by);x.scale(s,s);x.fillStyle='#e8541e';
 x.fillRect(-190,-560,58,560);x.fillRect(132,-560,58,560);           // 主柱
 x.fillRect(-300,-300,30,300);x.fillRect(270,-300,30,300);           // 袖柱
 x.fillRect(-300,-300,170,22);x.fillRect(130,-300,170,22);
 x.fillRect(-270,-440,540,34);                                       // 貫
 x.fillRect(-300,-560,600,52);                                       // 島木（箱）
 x.beginPath();x.moveTo(-370,-640);x.quadraticCurveTo(0,-590,370,-640);x.lineTo(350,-600);x.quadraticCurveTo(0,-560,-350,-600);x.closePath();x.fill(); // 笠木
 x.fillStyle='#222';x.fillRect(-370,-650,740,0);
 if(boxOpen>0){x.fillStyle='#fff8e6';x.fillRect(-290,-552,580,36);x.fillStyle='#8d8d8d';
  const nn=Math.floor(24*boxOpen);for(let i=0;i<nn;i++){x.beginPath();x.arc(-270+i*23.5,-534+(i%2)*6,13,0,7);x.fill()}}
 x.restore()}
