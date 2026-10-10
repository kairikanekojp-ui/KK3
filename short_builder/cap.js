// index.html の frame(t) を 30fps で1枚ずつ画像にする
// 使い方: node cap.js            → fr/ に全フレーム
//         node cap.js 1.2,5.5     → chk_1.2.jpg などの確認用だけ
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const opt = fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
  const b = await chromium.launch(opt);
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForFunction(() => window.ready && window.ready());
  const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  const total = await p.evaluate(() => TOTAL);
  fs.mkdirSync(__dirname + '/fr', { recursive: true });
  const list = only || [...Array(Math.round(total * 30)).keys()].map(i => i / 30);
  let n = 0;
  for (const t of list) {
    await p.evaluate(t => frame(t), t);
    const buf = await p.locator('#c').screenshot({ type: 'jpeg', quality: 92 });
    fs.writeFileSync(__dirname + (only ? `/chk_${t}.jpg` : `/fr/${String(n).padStart(4, '0')}.jpg`), buf);
    n++;
  }
  await b.close();
})();
