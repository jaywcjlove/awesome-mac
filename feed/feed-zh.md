Awesome Mac 订阅说明
===

[![Feed English](https://jaywcjlove.github.io/sb/lang/english.svg)](./feed.md)
[![Feed 日本語](https://jaywcjlove.github.io/sb/lang/japanese.svg)](./feed-ja.md)
[![Feed 한국어](https://jaywcjlove.github.io/sb/lang/korean.svg)](./feed-ko.md)

一个专注于收集优质 macOS 新应用的 RSS 订阅源，让你不错过任何好工具

```
https://jaywcjlove.github.io/awesome-mac/feed.xml
https://jaywcjlove.github.io/awesome-mac/feed-zh.xml
https://jaywcjlove.github.io/awesome-mac/feed-ko.xml
https://jaywcjlove.github.io/awesome-mac/feed-ja.xml
```

## 生成规则

- 脚本会扫描每个 README 最近 50 个 commit。
- 通过 README diff 判断是否新增了应用条目。
- 现有 XML 文件本身就是增量更新依据。
- 下次运行时，脚本会从当前 XML 的最新条目中读取 commit hash，只处理更晚的新 commit。
- 每个订阅最多保留 50 条最近新增应用。

## 重新生成

```bash
npm run feed
```

生成脚本位于 `build/feed.mjs`。
