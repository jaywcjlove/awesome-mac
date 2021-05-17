import FS from 'fs-extra'
import unified from 'unified'
import { toVFile } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import markdown from 'remark-parse'
import slug from 'remark-slug'
import headings from 'remark-autolink-headings'
import { html, template, doctype } from 'rehype-template'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import rehypeAttrs from 'rehype-attr'
import rehypeRaw from 'rehype-raw'
import rehypeRewrite from 'rehype-rewrite'
import rehypeUrls from 'rehype-urls'

FS.ensureDirSync('./dist');

const styles = `
body,html{padding: 0;margin:0;}
body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size: 16px; line-height: 1.5; word-wrap: break-word; } 
p,blockquote,ul,ol,dl,table,pre{margin-top: 0; margin-bottom: 16px; } 
blockquote{margin-right: 0; margin-left: 0; padding: 0 1em; color: #777; border-left: 0.25em solid #ddd; } 
a { color: #4078c0; text-decoration: none; } 
.markdown-body{ padding: 25px; padding-top: 43px;} 
.markdown-body>*:first-child { margin-top: 0 !important; }
.markdown-body .anchor { float: left; padding-right: 4px; margin-left: -20px; line-height: 1; }
.markdown-body .anchor svg.octicon-link { vertical-align: middle; visibility: hidden; }
.markdown-body h1:hover .anchor svg.octicon-link,
.markdown-body h2:hover .anchor svg.octicon-link,
.markdown-body h3:hover .anchor svg.octicon-link,
.markdown-body h4:hover .anchor svg.octicon-link,
.markdown-body h5:hover .anchor svg.octicon-link,
.markdown-body h6:hover .anchor svg.octicon-link { visibility: visible; }
h1, h2, h3, h4, h5, h6{margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; } 
h1{padding-bottom: 0.3em; font-size: 2em; border-bottom: 1px solid #eee; } 
h2{padding-bottom: 0.3em; font-size: 1.5em; border-bottom: 1px solid #eee; } 
ul, ol {padding-left: 1.2em; } 
li>p {margin-top: 16px; } 
code, tt{padding: 0; padding-top: 0.2em; padding-bottom: 0.2em; margin: 0; font-size: 85%; background-color: rgba(0,0,0,0.04); border-radius: 3px; } 
code{white-space: normal; } 
code, pre{font-family: Consolas, "Liberation Mono", Courier, monospace; } 
del code{text-decoration: inherit; } 
code:before, code:after, tt:before, tt:after { letter-spacing: -0.2em; content: "\\00a0"; } 
del{color: #727272; }  
ul {list-style-type: square;} 
ul ul{list-style-type:circle;} 
ul ul ul{list-style-type:disc; }
.totop{ position: fixed; bottom: 20px; right: 20px; display: inline-block; background: rgba(0, 0, 0, 0.74); padding: 10px; border-radius: 3px; z-index: 9999; color: #fff; font-size: 10px; }
a.github-corner {position: fixed; top: 0; right: 0; } 
.github-corner svg{fill:#e1e1e1;color:#000;position:absolute;top:0;border:0;right:0;z-index:99;width:4.375rem;height:4.375rem}
.github-corner:hover .octo-arm{-webkit-animation:octocat-wave 560ms ease-in-out;animation:octocat-wave 560ms ease-in-out}
@-webkit-keyframes octocat-wave{
    0%,100%{-webkit-transform:rotate(0);transform:rotate(0)}
    20%,60%{-webkit-transform:rotate(-25deg);transform:rotate(-25deg)}
    40%,80%{-webkit-transform:rotate(10deg);transform:rotate(10deg)}
}
@keyframes octocat-wave{
    0%,100%{-webkit-transform:rotate(0);transform:rotate(0)}
    20%,60%{-webkit-transform:rotate(-25deg);transform:rotate(-25deg)}
    40%,80%{-webkit-transform:rotate(10deg);transform:rotate(10deg)}
}

#awesome-mac { padding: 37px 0px 40px 0; text-align: center; color: #686868; }

.topmenu { position: fixed; left: 5px; }
.topmenu a { background: #00000073; display: inline-block; padding: 1px 5px; font-size: 12px; border-radius: 2px; margin-right: 5px; color: #fff; }
.topmenu a:hover{ background: #2186ff; color: #fff; }
#gitalk-container { padding: 15px; }
`

const t = (node, frontmatter) => html`
  ${doctype}
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
      <title>Awesome Mac application sharing recommendation - Awesome Mac</title>
      <meta name="description" content="A curated list of awesome applications, softwares, tools and shiny things for Mac osx. - Awesome Mac" />
      <meta name="keywords" content="mac,osx,app,softwares,applications,mac softwares,awesome mac,free softwares,Freeware" />
      <link rel="shortcut icon" href="./favicon.ico" />
      <link rel="stylesheet" href="//unpkg.com/gitalk/dist/gitalk.css" />
      <style>${styles}</style>
    </head>
    <body id="totop">
    <div class="topmenu">
        <a href="https://github.com/jaywcjlove/awesome-mac/issues">
        Recommended
        </a>
        <a href="https://github.com/jaywcjlove/awesome-mac/issues">Link failure Report</a>
    </div>
    <a href="https://github.com/jaywcjlove/awesome-mac" target="_blank" class="github-corner"> 
      <svg viewBox="0 0 250 250">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg> 
    </a>
    <div class="markdown-body">
    ${node}
    </div>
    <div id="gitalk-container"></div>
    <script src="https://utteranc.es/client.js" repo="jaywcjlove/awesome-mac" issue-term="homepage" crossorigin theme="github-light" async></script>
    <a href="#totop" class="totop">Top</a>
    </body>
  </html>
`

const tZh = (node, frontmatter) => html`
  ${doctype}
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
      <title>Awesome Mac application sharing recommendation - Awesome Mac</title>
      <meta name="description" content="收集分享大量非常好用的Mac应用程序、软件以及工具，主要面向开发者和设计师。 - Awesome Mac" />
      <meta name="keywords" content="mac,osx,app,mac软件,awesome mac,苹果软件下载,免费软件,mac免费软件下载,精品mac应用" />
      <link rel="shortcut icon" href="./favicon.ico" />
      <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css" />
      <style>${styles}</style>
    </head>
    <body id="totop">
    <div class="topmenu">
        <a href="https://github.com/jaywcjlove/awesome-mac/issues">
        Recommended
        </a>
        <a href="https://github.com/jaywcjlove/awesome-mac/issues">Link failure Report</a>
    </div>
    <a href="https://github.com/jaywcjlove/awesome-mac" target="_blank" class="github-corner"> 
      <svg viewBox="0 0 250 250">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg> 
    </a>
    <div class="markdown-body">
    ${node}
    </div>
    <div id="gitalk-container"></div>
    <script src="https://utteranc.es/client.js" repo="jaywcjlove/awesome-mac" issue-term="homepage" crossorigin theme="github-light" async></script>
    <a href="#totop" class="totop">Top</a>
    </body>
  </html>
`

const rehypeRewriteHandle = (node, index, parent) => {
  if (node.type === 'element' && parent.type === 'root' && /h(1|2|3|4|5|6)/.test(node.tagName) && index !== 0) {
    const child = node.children && node.children[0] ? node.children[0] : null
    if (child && child.properties && child.properties.ariaHidden === 'true') {
      child.properties = { class: 'anchor', ...child.properties }
      child.children = [
        {
          type: "element",
          tagName: "svg",
          properties: {
            class: "octicon octicon-link",
            viewBox: "0 0 16 16",
            version: "1.1",
            width: "16",
            height: "16",
            ariaHidden: "true",
          },
          children: [
            {
              type: "element",
              tagName: "path",
              properties: {
                fillRule: "evenodd",
                d: "M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z",
              }
            }
          ]
        }
      ]

    }
  }
}

function processorHandle(templ) {
  var processor = unified()
    .use(markdown)
    .use(slug)
    .use(headings)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeAttrs, { properties: 'attr' })
    .use(rehypeRewrite, rehypeRewriteHandle)
    .use(rehypeUrls, (url) => {
      if (/README-zh.md$/.test(url.href)) {
        url.path = 'index.zh.html'
        return url.path
      }
      if (/README.md$/.test(url.href)) {
        url.path = 'index.html'
        return url.path
      }
    })
    .use(template, { template: templ })
    .use(stringify)
    return processor
}

processorHandle(tZh).process(toVFile.readSync('README-zh.md'), (err, file) => {
  if (err) {
    console.error(reporter(err || file))
    return
  }
  file.extname = '.html'
  toVFile.writeSync({
    value: file.contents,
    path: './dist/index.zh.html'
  })
  console.log('  create file: ./dist/index.zh.html')
})

processorHandle(t).process(toVFile.readSync('README.md'), (err, file) => {
  if (err) {
    console.error(reporter(err || file))
    return
  }
  file.extname = '.html'
  toVFile.writeSync({
    value: file.contents,
    path: './dist/index.html'
  })
  console.log('  create file: ./dist/index.html')
})
