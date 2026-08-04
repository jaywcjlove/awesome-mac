Awesome Mac フィード案内
===

[![Feed English](https://jaywcjlove.github.io/sb/lang/english.svg)](./feed.md)
[![Feed 中文](https://jaywcjlove.github.io/sb/lang/chinese.svg)](./feed-zh.md)
[![Feed 한국어](https://jaywcjlove.github.io/sb/lang/korean.svg)](./feed-ko.md)

見逃しやすい優れた macOS の新着アプリを追いやすくするために、最近追加された高品質な macOS アプリだけを集めた RSS フィードです。

```text
https://jaywcjlove.github.io/awesome-mac/feed.xml
https://jaywcjlove.github.io/awesome-mac/feed-zh.xml
https://jaywcjlove.github.io/awesome-mac/feed-ko.xml
https://jaywcjlove.github.io/awesome-mac/feed-ja.xml
```

## 仕組み

- スクリプトは各 README の直近 50 件の commit を走査します。
- README の diff から新しいアプリ項目が追加されたかどうかを判定します。
- 既存の XML フィードそのものを増分更新の基準として使います。
- 次回実行時は、現在の XML フィードの最新項目から commit hash を読み取り、それ以降の新しい commit だけを処理します。
- 各フィードには最近追加されたアプリを最大 50 件まで保持します。

## 再生成

```bash
npm run feed
```

生成スクリプトは `build/feed.mjs` です。
