#!/bin/bash
# ショートを1本作る。使い方: ./build.sh s1_kippu.html  → s1_kippu.mp4
# 必要: ffmpeg, node, playwright（npm i playwright && npx playwright install chromium）
# 効果音の秒数は各HTMLの SFX（W=シュッ, P=ポン, I=ドン）。場面を変えたらそこも直す。
set -e
cd "$(dirname "$0")"
HTML=${1:-s1_kippu.html}; OUT=${HTML%.html}.mp4
rm -rf fr && node cap.js "$HTML"
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=d=0.35:c=pink:a=0.5" -af "bandpass=f=1800:w=1500,afade=t=in:d=0.15,afade=t=out:st=0.15:d=0.2,volume=0.6" -ar 48000 -ac 2 wh.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=880:d=0.09" -af "afade=t=out:st=0.01:d=0.08,volume=0.35" -ar 48000 -ac 2 pp.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=110:d=0.3" -af "afade=t=out:st=0.02:d=0.28,volume=0.9" -ar 48000 -ac 2 im.wav
ARGS=$(node -e '
const s=require("./sfx.json");let a=[],f="",n=0;
const add=(w,t)=>{a.push("-i",w);f+=`[${n}]adelay=delays=${Math.max(0,Math.round(t*1000))}:all=1[a${n}];`;n++};
s.W.forEach(t=>add("wh.wav",t-0.15));s.P.forEach(t=>add("pp.wav",t));s.I.forEach(t=>add("im.wav",t));
let m="";for(let i=0;i<n;i++)m+=`[a${i}]`;
console.log(JSON.stringify({a,fc:`${f}${m}amix=inputs=${n}:normalize=0,apad,atrim=0:${s.total}`}))')
mapfile -t IN < <(node -e 'JSON.parse(process.argv[1]).a.forEach(x=>console.log(x))' "$ARGS")
FC=$(node -e 'console.log(JSON.parse(process.argv[1]).fc)' "$ARGS")
ffmpeg -y -loglevel error "${IN[@]}" -filter_complex "$FC" -ar 48000 sfx.wav
ffmpeg -y -loglevel error -framerate 30 -i fr/%04d.jpg -i sfx.wav -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart "$OUT"
rm -rf fr wh.wav pp.wav im.wav sfx.wav sfx.json
echo "できた: $(pwd)/$OUT"
