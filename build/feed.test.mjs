import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

const targets = [
  ['README.md', 'feed.xml'],
  ['README-zh.md', 'feed-zh.xml'],
  ['README-ko.md', 'feed-ko.xml'],
  ['README-ja.md', 'feed-ja.xml'],
];
const website = 'https://example.com/app';
const source = 'https://github.com/example/app';
const store = 'https://apps.apple.com/app/id123';
const sourceBadge = `[![Open-Source Software][OSS Icon]](${source})`;
const storeBadge = `[![App Store][app-store Icon]](${store})`;
const cases = [
  { name: 'Both badges', url: website, tail: `${sourceBadge} ${storeBadge}`, website, source, store },
  { name: 'Source badge', url: website, tail: sourceBadge, website, source },
  { name: 'Store badge', url: website, tail: storeBadge, website, store },
  { name: 'Repository homepage', url: source, tail: '', source },
  { name: 'Store homepage', url: store, tail: '', store },
  { name: 'Ordinary link', url: website, tail: `[Documentation](${source})`, website },
];
let root;
let feeds;

before(() => {
  root = mkdtempSync(join(tmpdir(), 'awesome-mac-feed-'));
  mkdirSync(join(root, 'build'));
  copyFileSync(new URL('./feed.mjs', import.meta.url), join(root, 'build/feed.mjs'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'feed-test', homepage: website }));
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' });
  git('init');
  git('config', 'user.name', 'Feed Test');
  git('config', 'user.email', 'feed@example.com');
  git('config', 'commit.gpgsign', 'false');
  for (const [readme] of targets) writeFileSync(join(root, readme), '# Apps\n\n## Utilities\n');
  git('add', '.');
  git('commit', '-m', 'Initial readmes');
  const entries = cases.map(({ name, url, tail }) => `* [${name}](${url}) - Useful app. ${tail}`);
  for (const [readme] of targets) {
    writeFileSync(join(root, readme), `# Apps\n\n## Utilities\n${entries.join('\n')}\n`);
  }
  git('add', '.');
  git('commit', '-m', 'Add apps');
  const generate = () => {
    execFileSync(process.execPath, ['build/feed.mjs'], { cwd: root, stdio: 'pipe' });
    return targets.map(([, output]) => readFileSync(join(root, 'feed', output), 'utf8'));
  };
  // Exercise both initial generation and the XML cache used by subsequent runs.
  feeds = [generate(), generate()];
});

after(() => {
  if (root) {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert.ok(basename(root).startsWith('awesome-mac-feed-'));
    rmSync(root, { recursive: true, force: true });
  }
});

for (const entry of cases) {
  test(`RSS preserves metadata for ${entry.name.toLowerCase()}`, () => {
    for (const [run, localizedFeeds] of feeds.entries()) {
      for (const [language, xml] of localizedFeeds.entries()) {
        const item = xml.match(/<item>[\s\S]*?<\/item>/g)?.find((value) =>
          value.includes(`<title>${entry.name}</title>`),
        );
        const context = `${targets[language][0]}, run ${run + 1}`;
        assert.ok(item, context);
        for (const [label, url] of [
          ['Website', entry.website],
          ['Open Source', entry.source],
          ['App Store', entry.store],
        ]) {
          if (url) {
            // Both the plain-text fallback and HTML content must carry the link.
            assert.equal(item.split(`${label}: ${url}`).length - 1, 2, `${label}: ${context}`);
          } else {
            assert.ok(!item.includes(`${label}: `), `${label}: ${context}`);
          }
        }
      }
    }
  });
}
