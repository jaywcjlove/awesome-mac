var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var marked = require('marked');
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
        return '<h' + level + ' id="'+text+'">'+text+'</h' + level + '>';
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


MarkedToHTMLSave('.deploy/index.html','README.md'.toString(),function(err){
    if (err) return console.log(error(err));
    console.log(notice('  → '+"ok!"));


    MarkedToHTMLSave('.deploy/index.en.html','README-en.md'.toString(),function(err){
        if (err) return console.log(error(err));
        console.log(notice('  → '+"ok!"));
        var load = loading('  Pushing code!!')
        load.start()
        ghpages.publish(path.join(__dirname, '.deploy'),{ 
            repo: 'https://github.com/jaywcjlove/awesome-mac.git',
            branch: 'gh-pages'
        }, function(err) { 
            if(err) return console.log(error('  → '+"ok!"+err));
            load.stop()
            console.log(success('\n\n   '+"Push success!!"));
            // 删除文件夹
            exec('rm -rf .deploy');
        });

    })

})


function MarkedToHTMLSave(_path,form_file,callback){
    var README_str = fs.readFileSync(form_file);
    var dirname = path.dirname(_path)
    var basename = path.basename(_path)
    var md_basename = path.basename(form_file)
    // console.log("md_basename::",md_basename)
    console.log('\n  ☆ '+_path+'\n');
    mkdirp(dirname, function (err) {
        if (err) return callback(err);
        console.log(notice('  → '+dirname+"文件夹创建成功!"));
        marked(README_str.toString(),function(err,html){
            if (err) return callback(err);
            console.log(notice('  → ['+form_file+"]成功转换成HTML!"));
            html = MDhrefToPath(html);
            fs.writeFile(_path,htmlAndStyle(html),function(err){
                if (err) return callback(err);
                callback(err)
            })
        })
    });
}


function MDhrefToPath(html){
    var reg = new RegExp('<a[^>]*href="([^"]*\.md)"[^>]*>','ig')
    return html.replace(reg,function(a,st){
        // console.log(a,st)
        var a 

        if(st.indexOf('README.md')>-1){
            a = a.replace(st,'index.html')
        }
        if(st.indexOf('README-en.md')>-1){
            a = a.replace(st,'index.en.html')
        }
        return a
    })

}

function htmlAndStyle(html){
    var str = ''
    str += '<!DOCTYPE html>\n'
    str += '<html lang="en">\n'
    str += '<head>\n'
    str += '    <meta charset="UTF-8">\n'
    str += '    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">\n'
    str += '    <title>Awesome Mac</title>\n'
    str += '    <style type="text/css"> * {box-sizing: border-box; } body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size: 16px; line-height: 1.5; word-wrap: break-word; } p,blockquote,ul,ol,dl,table,pre{margin-top: 0; margin-bottom: 16px; } blockquote{margin-right: 0; margin-left: 0; padding: 0 1em; color: #777; border-left: 0.25em solid #ddd; } a {color: #4078c0; text-decoration: none; } .markdown-body{padding: 15px; } .markdown-body>*:first-child {margin-top: 0 !important; } h1, h2, h3, h4, h5, h6{margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; } h1{padding-bottom: 0.3em; font-size: 2em; border-bottom: 1px solid #eee; } h2{padding-bottom: 0.3em; font-size: 1.5em; border-bottom: 1px solid #eee; } ul, ol {padding-left: 1em; } li>p {margin-top: 16px; } code, tt{padding: 0; padding-top: 0.2em; padding-bottom: 0.2em; margin: 0; font-size: 85%; background-color: rgba(0,0,0,0.04); border-radius: 3px; } code{white-space: normal; } code, pre{font-family: Consolas, "Liberation Mono", Courier, monospace; } del code{text-decoration: inherit; } code::before, code::after, tt::before, tt::after{letter-spacing: -0.2em; content: "\\00a0"; } del{color: #727272; }  a.github-corner {position: fixed; top: 0; right: 0; } .github-corner svg{fill:#e1e1e1;color:#000;position:absolute;top:0;border:0;right:0;z-index:99;width:4.375rem;height:4.375rem}.github-corner:hover .octo-arm{-webkit-animation:octocat-wave 560ms ease-in-out;animation:octocat-wave 560ms ease-in-out} @-webkit-keyframes octocat-wave{0%,100%{-webkit-transform:rotate(0);transform:rotate(0)}20%,60%{-webkit-transform:rotate(-25deg);transform:rotate(-25deg)}40%,80%{-webkit-transform:rotate(10deg);transform:rotate(10deg)}}@keyframes octocat-wave{0%,100%{-webkit-transform:rotate(0);transform:rotate(0)}20%,60%{-webkit-transform:rotate(-25deg);transform:rotate(-25deg)}40%,80%{-webkit-transform:rotate(10deg);transform:rotate(10deg)}}</style>'
    str += '</head>\n'
    str += '<body>\n'
    str += '<a href="https://github.com/jaywcjlove/awesome-mac" target="_blank" class="github-corner"> <svg viewBox="0 0 250 250"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg> </a>'
    str += '<article class="markdown-body">'
    str += html
    str += '</article>\n</body>\n'
    str += '</html>\n'
    return str;
}