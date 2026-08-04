import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const feedDir = resolve(repoRoot, 'feed');
const packageJson = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));

// These CLI flags are optional tuning knobs for local runs:
// - --commit-limit controls how many recent commits are scanned per README.
// - --item-limit controls how many RSS items are emitted per feed.
//
// The user explicitly wants the script to stay within the recent 50 commits,
// so both defaults are 50. That keeps runtime predictable and avoids a full
// history walk on every execution.
const incrementalCommitLimit = readNumberArg('--commit-limit', 50);
const feedItemLimit = readNumberArg('--item-limit', 50);

const repositoryUrl = normalizeRepositoryUrl(packageJson.repository?.url);
const siteUrl = (packageJson.homepage || repositoryUrl || '').replace(/\/$/, '');

// Each feed is driven by one README file. Outputs are written into /feed so they
// can be committed to git, unlike /dist which is ignored in this repository.
// Only RSS XML is generated. Incremental state is derived from the existing
// XML file itself, so there are still no extra cache/state files.
const FEED_TARGETS = [
  {
    key: 'en',
    readmePath: 'README.md',
    outputName: 'feed.xml',
    language: 'en-US',
    title: 'Awesome Mac - Recent App Additions',
    description: `Recently added macOS apps tracked from ${packageJson.name}.`,
  },
  {
    key: 'zh',
    readmePath: 'README-zh.md',
    outputName: 'feed-zh.xml',
    language: 'zh-CN',
    title: 'Awesome Mac - 最近新增应用',
    description: '根据中文列表整理的最近新增 macOS 应用。',
  },
  {
    key: 'ko',
    readmePath: 'README-ko.md',
    outputName: 'feed-ko.xml',
    language: 'ko-KR',
    title: 'Awesome Mac - 최근 추가된 앱',
    description: '한국어 목록 기준으로 최근 추가된 macOS 앱입니다.',
  },
  {
    key: 'ja',
    readmePath: 'README-ja.md',
    outputName: 'feed-ja.xml',
    language: 'ja-JP',
    title: 'Awesome Mac - 最近追加されたアプリ',
    description: '日本語リストを元にした最近追加の macOS アプリです。',
  },
];

mkdirSync(feedDir, { recursive: true });

const sectionMapCache = new Map();
const reports = FEED_TARGETS.map(generateFeedForTarget);

// Older runs generated /feed.xml in the repository root and later in /dist.
// Remove those legacy artifacts so /feed is the only canonical output location.
rmSync(resolve(repoRoot, 'feed.xml'), { force: true });
for (const target of FEED_TARGETS) {
  rmSync(resolve(repoRoot, 'dist', target.outputName), { force: true });
  rmSync(resolve(feedDir, target.outputName.replace(/\.xml$/, '.json')), { force: true });
}

console.log(
  reports
    .map(
      (report) =>
        `Scanned ${report.scannedCommitCount} recent commits, processed ${report.processedCommitCount} new commits, found ${report.recentAdditionCount} new app additions in ${report.readmePath}. Generated feed/${report.outputName} with ${report.feedItemCount} items.`,
    )
    .join('\n'),
);

// Generate or incrementally update one localized XML feed from its README history.
function generateFeedForTarget(target) {
  console.log(`[feed] Start ${target.readmePath} -> feed/${target.outputName}`);

  // We still inspect only the latest N commits, but we read the existing XML
  // feed to find the newest commit already published and only process commits
  // newer than that point.
  const recentCommits = getCommitLog(target.readmePath, ['-n', String(incrementalCommitLimit)]);
  console.log(`[feed] ${target.readmePath}: loaded ${recentCommits.length} commits`);

  const existingFeed = loadExistingFeed(target);
  const commitsToProcess = getCommitsToProcess(recentCommits, existingFeed.latestCommitHash);

  if (existingFeed.latestCommitHash && commitsToProcess.length < recentCommits.length) {
    console.log(
      `[feed] ${target.readmePath}: XML cache hit at ${existingFeed.latestCommitHash.slice(0, 7)}, processing ${commitsToProcess.length} new commits`,
    );
  } else if (existingFeed.latestCommitHash) {
    console.log(`[feed] ${target.readmePath}: XML cache miss, rebuilding from recent commit window`);
  } else {
    console.log(`[feed] ${target.readmePath}: no existing XML, building initial feed`);
  }

  const newItems = collectAdditions(commitsToProcess, target.readmePath, {
    limit: feedItemLimit,
    logPrefix: target.readmePath,
  });
  const feedItems = mergeFeedItems(newItems, existingFeed.items, feedItemLimit);

  console.log(
    `[feed] ${target.readmePath}: identified ${newItems.length} new apps from ${commitsToProcess.length} processed commits`,
  );

  const outputPath = resolve(feedDir, target.outputName);
  const feedUrl = siteUrl ? `${siteUrl}/feed/${target.outputName}` : `feed/${target.outputName}`;
  const feedXml = buildFeedXml({
    items: feedItems,
    title: target.title,
    description: target.description,
    language: target.language,
    feedUrl,
  });

  writeFileSync(outputPath, feedXml);

  console.log(`[feed] Done ${target.readmePath}: wrote ${feedItems.length} items`);

  return {
    readmePath: target.readmePath,
    outputName: target.outputName,
    scannedCommitCount: recentCommits.length,
    processedCommitCount: commitsToProcess.length,
    recentAdditionCount: newItems.length,
    feedItemCount: feedItems.length,
  };
}

// Read a positive integer from a --flag=value CLI argument, or fall back.
function readNumberArg(flag, fallback) {
  const entry = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (!entry) return fallback;

  const value = Number.parseInt(entry.slice(flag.length + 1), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

// Execute a git command inside the repository and return trimmed stdout.
function runGit(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }).trimEnd();
}

// Load recent commit metadata for one README file, newest first.
function getCommitLog(readmePath, extraArgs = []) {
  const output = runGit([
    'log',
    '--date=iso-strict',
    '--pretty=format:%H%x1f%cI%x1f%s',
    ...extraArgs,
    '--',
    readmePath,
  ]);

  if (!output) return [];

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, committedAt, subject] = line.split('\x1f');
      return { hash, committedAt, subject };
    });
}

// Collect newly added app items from a commit list, with deduplication and a hard limit.
function collectAdditions(commits, readmePath, { limit, logPrefix }) {
  const items = [];
  const seen = new Set();
  let scannedCommits = 0;

  for (const commit of commits) {
    scannedCommits += 1;
    const additions = extractNewAppsFromCommit(commit, readmePath);

    if (scannedCommits === 1 || scannedCommits % 10 === 0 || scannedCommits === commits.length) {
      console.log(
        `[feed] ${logPrefix}: scanned ${scannedCommits}/${commits.length} commits, collected ${items.length} items`,
      );
    }

    for (const item of additions) {
      // Dedupe by app name + homepage. This avoids repeated feed items when a later
      // commit tweaks the same entry or the same app gets touched in localized files.
      const key = buildItemKey(item);
      if (seen.has(key)) continue;

      seen.add(key);
      items.push(item);

      if (items.length >= limit) {
        return items;
      }
    }
  }

  return items;
}

// Extract app additions from a single commit by inspecting the README patch directly.
function extractNewAppsFromCommit(commit, readmePath) {
  // We inspect the patch directly instead of parsing commit messages.
  // That keeps the rule stable even when messages say "docs" or "localize"
  // but the patch still introduces a brand-new list item.
  const patch = runGit(['show', '--format=', '--unified=3', commit.hash, '--', readmePath]);
  if (!patch) return [];

  const addedEntries = [];
  const removedNames = new Set();

  for (const line of patch.split('\n')) {
    const added = parseDiffAppLine(line, '+');
    if (added) {
      addedEntries.push(added);
      continue;
    }

    const removed = parseDiffAppLine(line, '-');
    if (removed) {
      removedNames.add(removed.name);
    }
  }

  if (addedEntries.length === 0) return [];

  const sectionMap = buildSectionMapForCommit(commit.hash, readmePath);
  const commitUrl = repositoryUrl ? `${repositoryUrl}/commit/${commit.hash}` : commit.hash;

  return addedEntries
    // A pure edit usually appears as "- old line" + "+ new line" with the same app name.
    // We therefore treat a "+" entry as "new app" only if the same name was not removed
    // in the same patch.
    .filter((entry) => !removedNames.has(entry.name))
    .map((entry) => ({
      ...entry,
      category: sectionMap.get(entry.name) || 'Uncategorized',
      commitHash: commit.hash,
      commitSubject: commit.subject,
      commitUrl,
      committedAt: commit.committedAt,
    }));
}

// Parse one added or removed README bullet line into a structured app record.
function parseDiffAppLine(line, sign) {
  const escaped = sign ? (sign === '+' ? '\\+' : '-') : '';

  // README app entries consistently use:
  //   * [App Name](url) - Description
  // We only treat those bullet lines as candidate app additions/removals.
  const match = line.match(new RegExp(`^${escaped}\\* \\[([^\\]]+)\\]\\(([^)]+)\\)\\s+-\\s+(.+)$`));
  if (!match) return null;

  const primaryUrl = match[2].trim();
  const metadata = parseEntryMetadata(primaryUrl, match[3]);

  return {
    name: match[1].trim(),
    url: primaryUrl,
    description: metadata.description,
    websiteUrl: metadata.websiteUrl,
    sourceUrl: metadata.sourceUrl,
    appStoreUrl: metadata.appStoreUrl,
  };
}

// Build a map from app name to category using the README snapshot at a given commit.
function buildSectionMapForCommit(hash, readmePath) {
  // We resolve the category from the README snapshot at that exact commit,
  // so the RSS item uses the section structure that existed when the app
  // was originally added, not the category after later reorganizations.
  const cacheKey = `${hash}:${readmePath}`;
  if (sectionMapCache.has(cacheKey)) {
    return sectionMapCache.get(cacheKey);
  }

  const content = runGit(['show', `${hash}:${readmePath}`]);
  const sectionMap = new Map();

  let currentSection = '';
  let currentSubsection = '';

  for (const line of content.split('\n')) {
    const sectionMatch = line.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      currentSubsection = '';
      continue;
    }

    const subsectionMatch = line.match(/^###\s+(.+)$/);
    if (subsectionMatch) {
      currentSubsection = subsectionMatch[1].trim();
      continue;
    }

    const appMatch = line.match(/^\* \[([^\]]+)\]\(([^)]+)\)\s+-\s+(.+)$/);
    if (!appMatch) continue;

    const name = appMatch[1].trim();
    if (sectionMap.has(name)) continue;

    const category = currentSubsection
      ? `${currentSection} / ${currentSubsection}`
      : currentSection || 'Uncategorized';

    sectionMap.set(name, category);
  }

  sectionMapCache.set(cacheKey, sectionMap);
  return sectionMap;
}

// Create a stable deduplication key for one app entry.
function buildItemKey(item) {
  return `${item.name}\x1f${item.url}`;
}

// Read the existing XML feed and recover the latest published commit plus current items.
function loadExistingFeed(target) {
  const outputPath = resolve(feedDir, target.outputName);
  if (!existsSync(outputPath)) {
    return { latestCommitHash: '', items: [] };
  }

  try {
    const xml = readFileSync(outputPath, 'utf8');
    const items = parseFeedItemsFromXml(xml);
    return {
      latestCommitHash: items[0]?.commitHash || '',
      items,
    };
  } catch {
    console.log(`[feed] ${target.readmePath}: existing XML is invalid, rebuilding feed`);
    return { latestCommitHash: '', items: [] };
  }
}

// Parse the current XML feed back into structured items for incremental updates.
function parseFeedItemsFromXml(xml) {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  return itemMatches
    .map((itemXml) => {
      const title = decodeXml(extractXmlTag(itemXml, 'title'));
      const link = decodeXml(extractXmlTag(itemXml, 'link'));
      const guid = decodeXml(extractXmlTag(itemXml, 'guid'));
      const pubDate = decodeXml(extractXmlTag(itemXml, 'pubDate'));
      const category = decodeXml(extractXmlTag(itemXml, 'category'));
      const contentEncoded = decodeXml(unwrapCdata(extractXmlTag(itemXml, 'content:encoded')));
      const description = (
        contentEncoded ||
        decodeXml(extractXmlTag(itemXml, 'description'))
      ).replace(/<br\s*\/?>/gi, '\n');

      const commitHash = guid.split(':')[0] || '';
      const descriptionLines = description.split('\n');
      const nameFromDescription =
        descriptionLines.find((line) => line.startsWith('App: '))?.slice(5) || '';
      const itemDescription =
        descriptionLines.find((line) => line.startsWith('Description: '))?.slice(13) || '';
      const websiteUrl =
        descriptionLines.find((line) => line.startsWith('Website: '))?.slice(9) || '';
      const sourceUrl =
        descriptionLines.find((line) => line.startsWith('Open Source: '))?.slice(13) || '';
      const appStoreUrl =
        descriptionLines.find((line) => line.startsWith('App Store: '))?.slice(11) || '';
      const commitSubject =
        descriptionLines.find((line) => line.startsWith('Commit: '))?.slice(8) || '';
      const commitUrl =
        descriptionLines.find((line) => line.startsWith('Commit URL: '))?.slice(12) || '';

      if (!title || !link || !commitHash || !pubDate) return null;

      return {
        name: nameFromDescription || title,
        url: link,
        description: itemDescription,
        category,
        websiteUrl,
        sourceUrl,
        appStoreUrl,
        commitHash,
        commitSubject,
        commitUrl,
        committedAt: new Date(pubDate).toISOString(),
      };
    })
    .filter(Boolean);
}

// Extract the text content of a simple XML tag from a feed fragment.
function extractXmlTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`));
  return match ? match[1].trim() : '';
}

// Return only commits that are newer than the latest commit already present in the feed.
function getCommitsToProcess(recentCommits, latestCommitHash) {
  if (!latestCommitHash) return recentCommits;

  const index = recentCommits.findIndex((commit) => commit.hash === latestCommitHash);
  if (index === -1) return recentCommits;

  return recentCommits.slice(0, index);
}

// Prepend newly discovered items to existing items while keeping order and limit.
function mergeFeedItems(newItems, existingItems, limit) {
  const merged = [];
  const seen = new Set();

  for (const item of [...newItems, ...existingItems]) {
    const key = buildItemKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
}

// Render a full RSS 2.0 XML document from the collected feed items.
function buildFeedXml({ items, title, description, language, feedUrl }) {
  const lastBuildDate = items[0]?.committedAt || new Date().toISOString();
  const channelLink = siteUrl || repositoryUrl || '';

  const xmlItems = items
    .map((item) => {
      const guid = `${item.commitHash}:${item.name}`;
      const summaryHtml = buildItemDescription(item);
      const summaryText = buildItemPlainDescription(item);

      return [
        '    <item>',
        `      <title>${escapeXml(item.name)}</title>`,
        `      <link>${escapeXml(item.url)}</link>`,
        `      <guid isPermaLink="false">${escapeXml(guid)}</guid>`,
        `      <pubDate>${new Date(item.committedAt).toUTCString()}</pubDate>`,
        `      <category>${escapeXml(item.category)}</category>`,
        `      <description>${escapeXml(summaryText)}</description>`,
        `      <content:encoded><![CDATA[${summaryHtml}]]></content:encoded>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${escapeXml(language)}</language>`,
    `    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <generator>build/feed.mjs</generator>`,
    xmlItems,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

// Extract website/source/App Store links from one README entry based on badge markers.
function parseEntryMetadata(primaryUrl, rawTail) {
  const markdownLinks = [...rawTail.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => ({
    text: match[1].trim(),
    url: match[2].trim(),
  }));

  let websiteUrl = '';
  let sourceUrl = '';
  let appStoreUrl = '';

  for (const link of markdownLinks) {
    if (link.text.includes('![Open-Source Software][OSS Icon]')) {
      sourceUrl = link.url;
      continue;
    }

    if (link.text.includes('![App Store][app-store Icon]')) {
      appStoreUrl = link.url;
    }
  }

  if (!sourceUrl && isRepositoryUrl(primaryUrl)) {
    sourceUrl = primaryUrl;
  } else if (!isRepositoryUrl(primaryUrl) && !isAppStoreUrl(primaryUrl)) {
    websiteUrl = primaryUrl;
  }

  if (!appStoreUrl && isAppStoreUrl(primaryUrl)) {
    appStoreUrl = primaryUrl;
  }

  return {
    description: cleanDescription(rawTail),
    websiteUrl,
    sourceUrl,
    appStoreUrl,
  };
}

// Render the human-readable field list stored inside each RSS item description.
function buildItemDescription(item) {
  return [
    `Category: ${escapeXml(item.category)}`,
    `App: ${escapeXml(item.name)}`,
    `Description: ${escapeXml(item.description)}`,
    item.websiteUrl ? `Website: ${escapeXml(item.websiteUrl)}` : '',
    item.sourceUrl ? `Open Source: ${escapeXml(item.sourceUrl)}` : '',
    item.appStoreUrl ? `App Store: ${escapeXml(item.appStoreUrl)}` : '',
    `Commit: ${escapeXml(item.commitSubject)}`,
    item.commitUrl ? `Commit URL: ${escapeXml(item.commitUrl)}` : '',
  ]
    .filter(Boolean)
    .join('<br/>');
}

// Render a plain-text fallback for RSS readers that ignore HTML in description.
function buildItemPlainDescription(item) {
  return [
    `Category: ${item.category}`,
    `App: ${item.name}`,
    `Description: ${item.description}`,
    item.websiteUrl ? `Website: ${item.websiteUrl}` : '',
    item.sourceUrl ? `Open Source: ${item.sourceUrl}` : '',
    item.appStoreUrl ? `App Store: ${item.appStoreUrl}` : '',
    `Commit: ${item.commitSubject}`,
    item.commitUrl ? `Commit URL: ${item.commitUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

// Normalize the repository URL so commit links can be built consistently.
function normalizeRepositoryUrl(url) {
  if (!url) return '';
  return url.replace(/^git\+/, '').replace(/\.git$/, '');
}

// Check whether a URL points at a repository host rather than the app's website.
function isRepositoryUrl(url) {
  return /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\//i.test(url);
}

// Check whether a URL is an App Store landing page.
function isAppStoreUrl(url) {
  return /apps\.apple\.com\//i.test(url);
}

// Remove README-only badges and markdown noise from an app description.
function cleanDescription(value) {
  // README descriptions often end with badges such as Freeware/App Store/OSS icons.
  // RSS readers do not benefit from those badges, so we strip them and keep only
  // readable text.
  return value
    .split(' [![')[0]
    .split(' ![[')[0]
    .split(' ![')[0]
    .replace(/\s+\[!\[[^\]]+\]\([^)]+\)\]\([^)]+\)/g, '')
    .replace(/\s+!\[[^\]]+\]\[[^\]]+\]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// Escape reserved XML characters before writing text into the RSS document.
function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Decode escaped XML entities when reading existing feed items back from XML.
function decodeXml(value) {
  let decoded = String(value);

  while (true) {
    const next = decoded
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&');

    if (next === decoded) {
      return next;
    }

    decoded = next;
  }
}

// Remove a CDATA wrapper when reading XML fields that intentionally contain HTML.
function unwrapCdata(value) {
  return String(value)
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '');
}
