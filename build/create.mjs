import FS from 'fs-extra';
import { create } from 'markdown-to-html-cli';

const gitalk = [
  {
    type: 'element',
    tagName: 'div',
    properties: { id: 'gitalk-container' },
    children: [],
  }, {
    type: 'element',
    tagName: 'script',
    properties: {
      src: 'https://utteranc.es/client.js',
      repo: 'jaywcjlove/awesome-mac',
      'issue-term': 'homepage',
      crossorigin: true,
      async: true,
      theme: 'github-light',
    },
    children: [],
  }, {
    type: 'element',
    tagName: 'a',
    properties: { className: 'totop', href: '#totop' },
    children: [{ type: 'text', value: 'Top' }],
  }
];

const topmenuElm = {
  type: 'element',
  tagName: 'div',
  properties: { className: 'topmenu' },
  children: [
    {
      type: 'element',
      tagName: 'a',
      properties: { href: 'index.html' },
      children: [{ type: 'text', value: 'Home' }],
    }, {
      type: 'element',
      tagName: 'a',
      properties: { href: 'https://github.com/jaywcjlove/awesome-mac/issues' },
      children: [{ type: 'text', value: 'Recommended' }],
    }, {
      type: 'element',
      tagName: 'a',
      properties: { href: 'https://github.com/jaywcjlove/awesome-mac/issues' },
      children: [{ type: 'text', value: 'Link failure Report' }],
    }
  ]
}

const style = `
a { text-decoration: none; }
.totop { position: fixed; bottom: 20px; right: 20px; display: inline-block; background: rgba(0, 0, 0, 0.74); padding: 10px; border-radius: 3px; z-index: 9999; color: #fff; font-size: 10px; }
.topmenu { position: fixed; left: 5px; top: 5px; display: flex; }
.topmenu a { background: #00000073; padding: 1px 5px; font-size: 12px; border-radius: 2px; margin-right: 5px; color: #fff; }
.topmenu a:hover, .totop:hover { background: #2186ff; color: #fff; }
`;

const options = {
  'github-corners': 'https://github.com/jaywcjlove/awesome-mac.git',
  document: {
    style,
    link: [
      { rel: 'shortcut icon', href: './favicon.ico' },
      { rel: 'stylesheet', href: '//unpkg.com/gitalk/dist/gitalk.css' }
    ]
  },
  reurls: {
    'editor-plugin.md': 'editor-plugin.html',
    'editor-plugin.md#atom-plugin': 'editor-plugin.html#atom-plugin',
    'editor-plugin.md#vim-plugin': 'editor-plugin.html#vim-plugin',
    'editor-plugin-zh.md': 'editor-plugin-zh.html',
    'editor-plugin-zh.md#atom-plugin': 'editor-plugin-zh.html#atom-plugin',
    'editor-plugin-zh.md#vim-plugin': 'editor-plugin-zh.html#vim-plugin',
    'editor-plugin-zh.md#sublime-text-plugin': 'editor-plugin-zh.html#sublime-text-plugin',
    'editor-plugin-zh.md#vscode-plugin': 'editor-plugin-zh.html#vscode-plugin',
    'README-zh.md': 'index.zh.html',
    'README.md': 'index.html'
  },
  rewrite: (node) => {
    if (node.type === 'element' && node.tagName === 'body') {
      node.properties = { ...node.properties, id: 'totop' };
      node.children = [topmenuElm, ...node.children, ...gitalk];
    }
  }
}

;(async () => {
  await FS.ensureDir('./dist');
  let markdown = await FS.readFile('./README.md');
  let html = create({
    markdown, ...options,
    document: {
      title: "Awesome Mac application sharing recommendation - Awesome Mac",
      ...options.document,
      meta: [
        { description: 'A curated list of awesome applications, softwares, tools and shiny things for Mac osx. - Awesome Mac' },
        { keywords: 'mac,osx,app,softwares,applications,mac softwares,awesome mac,free softwares,Freeware' }
      ]
    }
  });
  await FS.writeFile('./dist/index.html', html);
  console.log(' create file: \x1b[32;1m ./dist/index.html \x1b[0m');

  markdown = await FS.readFile('./README-zh.md');
  html = create({
    markdown, ...options,
    document: {
      title: "Awesome Mac 应用分享推荐 - Awesome Mac",
      ...options.document,
      meta: [
        { description: '收集分享大量非常好用的Mac应用程序、软件以及工具，主要面向开发者和设计师。 - Awesome Mac' },
        { keywords: 'mac,osx,app,mac软件,awesome mac,苹果软件下载,免费软件,mac免费软件下载,精品mac应用' }
      ]
    }
  });
  await FS.writeFile('./dist/index.zh.html', html);
  console.log(' create file: \x1b[32;1m ./dist/index.zh.html \x1b[0m');
  
  markdown = await FS.readFile('./editor-plugin.md');
  html = create({
    markdown, ...options,
    document: {
      title: "Editors Plugin Sharing Recommendation - Awesome Mac",
      ...options.document,
      meta: [
        { description: 'Editors Plugin Sharing Recommendation' },
        { keywords: 'mac,osx,app,softwares,applications,editor,plugin,editor-plugin,mac softwares,awesome mac,free softwares,Freeware' }
      ]
    }
  });
  await FS.writeFile('./dist/editor-plugin.html', html);
  console.log(' create file: \x1b[32;1m ./dist/editor-plugin.html \x1b[0m');

  markdown = await FS.readFile('./editor-plugin-zh.md');
  html = create({
    markdown, ...options,
    document: {
      title: "Editors Plugin 分享推荐 - Awesome Mac",
      ...options.document,
      meta: [
        { description: 'Editors Plugin 分享推荐。 - Awesome Mac' },
        { keywords: 'mac,osx,app,softwares,applications,editor,plugin,editor-plugin,mac softwares,awesome mac,free softwares,Freeware' }
      ]
    }
  });
  await FS.writeFile('./dist/editor-plugin-zh.html', html);
  console.log(' create file: \x1b[32;1m ./dist/editor-plugin-zh.html \x1b[0m');
  
})();
