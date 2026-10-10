#!/usr/bin/env python3
"""prospects.csv から個別DM案を作り、tracker.csv に追記する。
使い方: python3 make_dm.py prospects.csv [--track]
HP状況: なし / 古い / あり。「良かった点」を必ず1つ書くこと(空なら出力しない)。"""
import csv, sys, datetime, pathlib

A = ("はじめまして、{me}と申します。{name}さんのInstagramを拝見しました。{good}点が印象的でした。\n"
     "お店のホームページがまだないようでしたので、ご連絡しました。\n"
     "実は、{name}さん向けのサンプルサイトを先に作ってみました。→ {url}\n"
     "ご興味があれば、無料で修正案もお出しします。見るだけでも大丈夫です。")
B = ("はじめまして。サロン専門でホームページを作っている{me}です。\n"
     "{name}さんのサイトをスマホで拝見したところ、{memo}と感じました。\n"
     "サロン向けの改善案を1枚にまとめました。よろしければお送りしてもよいでしょうか?")

def main():
    src = sys.argv[1]
    track = "--track" in sys.argv
    me, url = "〇〇", "https://(サンプルURL)"
    rows = list(csv.DictReader(open(src, encoding="utf-8")))
    out, n = [], 0
    for r in rows:
        if not r["良かった点"].strip():
            print(f"skip(良かった点が空): {r['店名']}", file=sys.stderr); continue
        tpl = A if r["HP状況"] == "なし" else B
        if tpl is B and not r["メモ"].strip():
            print(f"skip(メモが空): {r['店名']}", file=sys.stderr); continue
        out.append(f"■ {r['店名']} ({r['Instagram']})\n" + tpl.format(
            me=me, name=r["店名"], good=r["良かった点"].rstrip("。"), url=url, memo=r["メモ"]) + "\n")
        n += 1
    print("\n".join(out))
    if track:
        t = pathlib.Path(__file__).parent.parent / "tracker.csv"
        with open(t, "a", encoding="utf-8", newline="") as f:
            w = csv.writer(f)
            for r in rows:
                if r["良かった点"].strip():
                    w.writerow([datetime.date.today(), r["店名"], r["業種"], "Instagram DM", "DM案作成", "送信→3日後フォロー", "", r["地域"]])
    print(f"{n}件作成", file=sys.stderr)
main()
