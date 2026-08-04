Awesome Mac Feed
===

[![Feed 中文](https://jaywcjlove.github.io/sb/lang/chinese.svg)](./feed-zh.md)
[![Feed 日本語](https://jaywcjlove.github.io/sb/lang/japanese.svg)](./feed-ja.md)
[![Feed 한국어](https://jaywcjlove.github.io/sb/lang/korean.svg)](./feed-ko.md)

An RSS feed focused on recently added high-quality macOS apps, so you do not miss useful new tools.

```text
https://jaywcjlove.github.io/awesome-mac/feed.xml
https://jaywcjlove.github.io/awesome-mac/feed-zh.xml
https://jaywcjlove.github.io/awesome-mac/feed-ko.xml
https://jaywcjlove.github.io/awesome-mac/feed-ja.xml
```

## How It Works

- The generator scans the latest 50 commits for each README file.
- It detects newly added app entries from README diffs.
- Existing XML feeds are used as the incremental source of truth.
- On the next run, the script reads the newest commit hash from the current XML feed and only processes newer commits.
- Each feed keeps up to 50 recent app additions.

## Regenerate

```bash
npm run feed
```

The generator script is `build/feed.mjs`.
