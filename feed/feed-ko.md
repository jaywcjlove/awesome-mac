Awesome Mac 피드 안내
===

[![Feed English](https://jaywcjlove.github.io/sb/lang/english.svg)](./feed.md)
[![Feed 中文](https://jaywcjlove.github.io/sb/lang/chinese.svg)](./feed-zh.md)
[![Feed 日本語](https://jaywcjlove.github.io/sb/lang/japanese.svg)](./feed-ja.md)

놓치기 쉬운 좋은 macOS 신규 앱을 빠르게 확인할 수 있도록, 최근 추가된 고품질 macOS 앱만 모아둔 RSS 피드입니다.

```text
https://jaywcjlove.github.io/awesome-mac/feed.xml
https://jaywcjlove.github.io/awesome-mac/feed-zh.xml
https://jaywcjlove.github.io/awesome-mac/feed-ko.xml
https://jaywcjlove.github.io/awesome-mac/feed-ja.xml
```

## 동작 방식

- 스크립트는 각 README의 최근 50개 커밋을 검사합니다.
- README diff를 기준으로 새 앱 항목이 추가되었는지 판별합니다.
- 기존 XML 피드 자체를 증분 업데이트 기준으로 사용합니다.
- 다음 실행에서는 현재 XML 피드의 최신 항목에서 commit hash를 읽고, 그 이후의 새 커밋만 처리합니다.
- 각 피드는 최근 추가된 앱을 최대 50개까지 유지합니다.

## 다시 생성

```bash
npm run feed
```

생성 스크립트는 `build/feed.mjs` 입니다.
