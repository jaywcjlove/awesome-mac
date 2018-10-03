const path = require('path');
const ejs = require('ejs');
const FS = require('fs-extra');
const marked = require('marked');
const loading = require('loading-cli');
const ghpages = require('gh-pages');
const minify = require("html-minifier").minify;
const markdownParse = require("@textlint/markdown-to-ast").parse;
const colors = require('colors-cli/toxic');
const pkg = require('../package.json');

const deployDir = path.resolve(process.cwd(), '.deploy');
const templatePath = path.resolve(process.cwd(), 'build', 'template.ejs');
const faviconPath = path.resolve(process.cwd(), 'build', 'favicon.ico');

mkdirs(deployDir)
  .then(dir => emptyDir(dir))
  .then(dir => markdownToAst(path.resolve(process.cwd(), 'README.md')))
  // Output `awesome-mac-data.json` file, https://github.com/jaywcjlove/amac
  .then(ast => outputFile(path.resolve(deployDir, 'awesome-mac-data.json'), JSON.stringify(ast)))
  .then(dir => MarkedToHTMLOutputFile(
    path.resolve(process.cwd(), 'README.md'),
    path.resolve(deployDir, 'index.html')
  ))
  .then(dir => MarkedToHTMLOutputFile(
    path.resolve(process.cwd(), 'README-zh.md'),
    path.resolve(deployDir, 'index.zh.html')
  ))
  .then(dir => MarkedToHTMLOutputFile(
    path.resolve(process.cwd(), 'editor-plugin.md'),
    path.resolve(deployDir, 'editor-plugin.html')
  ))
  .then(dir => MarkedToHTMLOutputFile(
    path.resolve(process.cwd(), 'editor-plugin-zh.md'),
    path.resolve(deployDir, 'editor-plugin-zh.html')
  ))
  .then(() => FS.copySync(faviconPath, path.resolve(deployDir, 'favicon.ico') ))
  .then(() => PushGhpage(deployDir, {
    repo: 'git@github.com:jaywcjlove/awesome-mac.git',
    message: `MacOSX software list update, Compiler generation page. ${new Date()}`
  }))
  .then(() => console.log(`\n Push Success!!\n`.green))
  .catch((err) => {
    if (err && err.message) {
      console.log(`\n ERROR :> ${err.message.red_bt}\n`)
    }
  });

/**
 * Create a directory
 * @param {String} dir
 */
function mkdirs(dir) {
  return new Promise((resolve, reject) => {
    FS.ensureDir(dir, err => {
      err ? reject(err) : resolve(dir);
    })
  });
}

/**
 * Empty a directory
 * @param {String} dir
 */
function emptyDir(dir) {
  return new Promise((resolve, reject) => {
    FS.emptyDir(dir, err => {
      err ? reject(err) : resolve(dir);
    })
  });
}

/**
 * Output file.
 * @param {String} filePath
 * @param {String} html
 */
function outputFile(filePath, html) {
  return new Promise((resolve, reject) => {
    try {
      FS.outputFileSync(filePath, minify(html, {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      }));
      resolve();
    } catch (err) {
      reject(err)
    }
  });
}

/**
 * Markdown to HTML
 * @param {String} file Markdown path
 */
function MarkedToHTML(file) {
  return new Promise((resolve, reject) => {
    try {
      const markdownStr = FS.readFileSync(file);
      const renderer = new marked.Renderer();
      renderer.heading = function (text, level) {
        if (/[\u4E00-\u9FA5]/i.test(text)) {
          return '<h' + level + ' id="' + text.toLowerCase() + '">' + text + '</h' + level + '>';
        }
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return '<h' + level + ' id="' + escapedText + '">' + text + '</h' + level + '>';
      }
      marked.setOptions({ renderer });
      resolve(marked(markdownStr.toString()));
    } catch (err) {
      reject(err)
    }
  });
}

/**
 * Replace 'README.md' => 'index.html'
 * @param {String} html HTML code
 * @param {Object} options 
 */
function MDhrefToPath(html, options = {}) {
  const reg = new RegExp('<*href="(.*?)"*>', 'ig');
  return new Promise((resolve, reject) => {
    try {
      const htmlResult = html.replace(reg, (a, st) => {
        Object.keys(options).forEach((key) => {
          if (st.indexOf(key) > -1) {
            a = a.replace(st, options[key]);
          }
        })
        return a
      });
      resolve(htmlResult);
    } catch (err) {
      reject(err)
    }
  });
}

function ejsRenderFile(ejsPath, data, options = {}) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(ejsPath, data, options, (err, str) => {
      err ? reject(err) : resolve(str);
    });
  });
}

function MarkedToHTMLOutputFile(mdpath, toPath) {
  return MarkedToHTML(mdpath)
    .then(html => MDhrefToPath(html, {
      'README.md': 'index.html',
      'README-zh.md': 'index.zh.html',
      'editor-plugin.md': 'editor-plugin.html',
      'editor-plugin-zh.md': 'editor-plugin-zh.html',
    }))
    .then(html => ejsRenderFile(
      templatePath,
      {
        lang: toPath.indexOf('zh.html') > 0 ? 'zh' : 'en',
        html
      }
    ))
    .then(html => outputFile(toPath, html))
    .then(() => {
      console.log(`${'Success:'.green} ${mdpath.replace(process.cwd(), '').blue} -> ${toPath.replace(process.cwd(), '').blue}`)
      return toPath;
    });
}

function PushGhpage(dirPath, options = {}) {
  if (!options.branch) options.branch = 'gh-pages';
  return new Promise((resolve, reject) => {
    const load = loading('  Pushing code!!');
    load.start();
    return ghpages.publish(dirPath, options, (err) => {
      load.stop();
      err ? reject(err) : resolve(str);
    });
  });
}

function arrayToJsonAst(arr, depth = 2, result = []) {
  const getArrayItems = (items) => {
    const itemsLink = [];
    for (let a = 0; a < items.length; a += 1) {
      if (a !== 0 && items[a].type == 'Header' && items[a].depth <= depth) {
        break;
      } else if (a !== 0 && items[a].type == 'List') {
        items[a].children.forEach((child) => {
          if (child.children[0] && child.children[0].children.length > 0) {
            const itemChild = {};
            child.children[0].children.forEach((_item, idx) => {
              if (idx === 0 && _item.type === 'Link') {
                itemChild.link = _item.url;
                itemChild.name = '';
                if (_item.children && _item.children.length > 0) {
                  itemChild.name = _item.children[0].value;
                }
              }
              if (idx === 1 && _item.type === 'Str') {
                itemChild.des = _item.value.replace(/^(-|\s-\s|\s-|-\s)/g, '');
              }
              if (idx > 1 && /(Link|imageReference)/.test(_item.type)) {
                if (!itemChild.tag) itemChild.tag = [];
                if (/(awesome-list\ icon|app-store\ icon|freeware\ icon|oss\ icon)/.test(_item.identifier)) {
                  itemChild.tag.push({
                    alt: _item.alt,
                    identifier: _item.identifier,
                  })
                }
                if (/(Link)/.test(_item.type) && _item.children && _item.children[0] && /(awesome-list\ icon|app-store\ icon|freeware\ icon|oss\ icon)/.test(_item.children[0].identifier)) {
                  itemChild.tag.push({
                    url: _item.url,
                    alt: _item.children[0].alt,
                    identifier: _item.children[0].identifier,
                  })
                }
              }
            })
            if (itemChild.des) itemsLink.push(itemChild);
          }
        })
      }
    }
    return itemsLink;
  }

  arr.forEach((item, idx) => {
    if (item.type == 'Header' && item.depth === depth) {
      const title = item.children.filter(_item => _item.type === 'Str')[0];
      let des = '';
      if (arr[idx + 1] && arr[idx + 1].type === 'Paragraph') {
        des = arr[idx + 1].raw;
      }
      const props = {
        title: title.value,
        des,
        key: title.value.toLowerCase().replace(/\s/g, '-'),
        items: getArrayItems(arr.slice(idx, arr.length)),
      };
      if (props.items && props.items.length > 0) {
        result.push(props);
      }
    }
  });
  if (depth <= 6 && result.length === 0) {
    result = arrayToJsonAst(arr, depth + 1);
  }
  return result;
}

/**
 * Markdown to JSON
 * @param {String} markdownPath 
 */
function markdownToAst(markdownPath) {
  return new Promise((resolve, reject) => {
    try {
      const markdownStr = FS.readFileSync(markdownPath);
      const AST = markdownParse(markdownStr.toString());
      const ASTData = {
        version: pkg.version,
        name: pkg.name,
        description: pkg.description,
        data: [],
      };
      if (AST && AST.children && AST.children.length > 0) {
        ASTData.data = arrayToJsonAst(AST.children);
      }
      resolve(ASTData);
    } catch (err) {
      reject(err);
    }
  });
}