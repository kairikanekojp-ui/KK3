#!/bin/bash
# 宮島ショート1本目を作る。必要: ffmpeg, node, playwright（npm i playwright && npx playwright install chromium）
# 効果音のタイミングは index.html の SC（場面の開始秒）に合わせてある。場面を変えたら W/P/I も直す。
set -e
cd "$(dirname "$0")"
TOTAL=$(grep -o 'const TOTAL=[0-9.]*' index.html | cut -d= -f2)
rm -rf fr && node cap.js
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=d=0.35:c=pink:a=0.5" -af "bandpass=f=1800:w=1500,afade=t=in:d=0.15,afade=t=out:st=0.15:d=0.2,volume=0.6" -ar 48000 -ac 2 wh.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=880:d=0.09" -af "afade=t=out:st=0.01:d=0.08,volume=0.35" -ar 48000 -ac 2 pp.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=110:d=0.3" -af "afade=t=out:st=0.02:d=0.28,volume=0.9" -ar 48000 -ac 2 im.wav
W="1.7 3.6 7.0 9.4 10.7 13.4 16.6 18.8"                          # 場面転換（シュッ）
P="0.5 2.1 4.0 5.8 7.15 7.57 7.99 8.41 13.7 14.4 15.0 17.0 19.5" # 文字（ポン）
I="0.05 11.25"                                                   # 冒頭・ハンコ（ドン）
in=""; f=""; n=0
add(){ in="$in -i $1"; f="$f[$n]adelay=delays=$(echo "$2*1000/1"|bc):all=1[a$n];"; n=$((n+1)); }
for t in $W; do add wh.wav $(echo "$t-0.15"|bc); done
for t in $P; do add pp.wav $t; done
for t in $I; do add im.wav $t; done
m=""; for i in $(seq 0 $((n-1))); do m="$m[a$i]"; done
ffmpeg -y -loglevel error $in -filter_complex "$f${m}amix=inputs=$n:normalize=0,apad,atrim=0:$TOTAL" -ar 48000 sfx.wav
ffmpeg -y -loglevel error -framerate 30 -i fr/%04d.jpg -i sfx.wav -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart out.mp4
rm -rf fr wh.wav pp.wav im.wav sfx.wav
echo "できた: $(pwd)/out.mp4"
