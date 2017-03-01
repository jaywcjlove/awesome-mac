var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var ejs = require('ejs');
var minify = require('html-minifier').minify;
var ghpages = require('gh-pages');
var loading =  require('loading-cli');
var mkdirp = require('mkdirp');
var renderer = new marked.Renderer();
var color = require('colors-cli/safe')
var error = color.red.bold;
var warn = color.yellow;
var notice = color.blue;
var success = color.green;

// console.log(error('Error!'));
// console.log(warn('Warning'));
// console.log(notice('Notice'));

renderer.heading = function (text, level) {
    if(/[\u4E00-\u9FA5]/i.test(text)){
        return '<h' + level + ' id="'+text.toLowerCase()+'">'+text+'</h' + level + '>';
    }else{
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return '<h' + level + ' id="'+escapedText+'">'+text+'</h' + level + '>';
    }
}

marked.setOptions({
  renderer: renderer,
  // gfm: true,
  // tables: true,
  // breaks: false,
  // pedantic: false,
  // sanitize: true,
  // smartLists: true,
  // smartypants: false
  // highlight: function (code, lang, callback) {
  //   console.log("tes")
  //   require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
  //     callback(err, result.toString());
  //   });
  // }
});

// 删除文件夹
exec('rm -rf .deploy');
exec('mkdir .deploy');

MarkedToHTMLSave('.deploy/index.html','README.md'.toString(),function(err){
    if (err) return console.log(error(err));
    console.log(notice('  → '+"ok!"));
})

MarkedToHTMLSave('.deploy/index.zh.html','README-zh.md'.toString(),function(err){
    if (err) return console.log(error(err));
    console.log(notice('  → README-zh.md - '+"ok!"));
})

MarkedToHTMLSave('.deploy/editor-plugin.html','editor-plugin.md'.toString(),function(err){
    if (err) return console.log(error(err));
    console.log(notice('  → editor-plugin.md - '+"ok!"));

})

MarkedToHTMLSave('.deploy/editor-plugin-zh.html','editor-plugin-zh.md'.toString(),function(err){
    if (err) return console.log(error(err));
    console.log(notice('  → editor-plugin-zh.md - '+"ok!"));
})


PushGhpage()

function PushGhpage(){
    //copy favicon.ico
    fs.createReadStream(path.join(__dirname, './favicon.ico'))
      .pipe(fs.createWriteStream(path.join(__dirname, '../.deploy/favicon.ico')));
    // upload gh-page！～～
    var load = loading('  Pushing code!!')
    load.start()
    ghpages.publish(path.join(__dirname, '../.deploy'),{ 
        repo: 'https://github.com/jaywcjlove/awesome-mac.git',
        branch: 'gh-pages',
        message: 'MacOSX software list update, Compiler generation page.' + new Date()
    }, function(err) { 
        if(err) return console.log(error('  → '+"ok!"+err));
        load.stop()
        console.log(success('\n\n   '+"Push success!!"));
        // 删除文件夹
        exec('rm -rf .deploy');
    });
}

function MarkedToHTMLSave(_path,form_file,callback){
    var dirname = path.dirname(_path)

    var README_str = fs.readFileSync(form_file);
    var basename = path.basename(_path)
    var md_basename = path.basename(form_file)
    // console.log("md_basename::",md_basename)
    console.log('\n  ☆ '+_path+'\n');

    marked(README_str.toString(),function(err,html){
        if (err) return callback(err);
        console.log(notice('  → ['+form_file+"]成功转换成HTML!"+ _path));
        html = MDhrefToPath(html);

        var title="",description="",keywords="";
        if (_path.indexOf('zh.html')>0){
          title = "精品Mac应用分享推荐 - Awesome Mac";
          description = "收集分享大量非常好用的Mac应用程序、软件以及工具，主要面向开发者和设计师。 - Awesome Mac";
          keywords = "mac,osx,app,mac软件,awesome mac,苹果软件下载,免费软件,mac免费软件下载,精品mac应用";
        }else{
          title = "Awesome Mac application sharing recommendation - Awesome Mac";
          description = "A curated list of awesome applications, softwares, tools and shiny things for Mac osx. - Awesome Mac";
          keywords = "mac,osx,app,softwares,applications,mac softwares,awesome mac,free softwares,Freeware";
        }
        var data =  {
          html: html,
          title: title,
          description:description,
          keywords:keywords
        };
        var options = {
            // delimiter: '$'
        };
        ejs.renderFile('./build/template.ejs',data,options,function(err, str){
            // str => Rendered HTML string
            // HTML 代码压缩
            var result = minify(str, {
              // removeAttributeQuotes: true
              // collapseInlineTagWhitespace:true
              minifyCSS:true,
              minifyJS:true,
              collapseWhitespace:true,
              conservativeCollapse:true
            });
            fs.writeFileSync(_path,result,{
                encoding:'utf8'
            },function(err){
                if (err) return callback(err);
                callback(err)
            })
        });
    })
}


function MDhrefToPath(html){
    var reg = new RegExp('<*href="(.*?)"*>','ig')
    return html.replace(reg,function(a,st){
        if(st.indexOf('README.md')>-1){
            return a.replace(st,'index.html')
        }
        if(st.indexOf('README-zh.md')>-1){
            return a.replace(st,'index.zh.html')
        }
        if(st.indexOf('editor-plugin.md')>-1 || st.indexOf('editor-plugin-zh.md')>-1){
            return a.replace(/.md#/,'.html#').replace(/.md\"\>$/,'.html">')
        }
        return a
    })
}