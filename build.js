var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var mkdirp = require('mkdirp');
var renderer = new marked.Renderer();
var color = require('colors-cli/safe')
var error = color.red.bold;
var warn = color.yellow;
var notice = color.blue;

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
    str += '    <style type="text/css"> * {box-sizing: border-box; } body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size: 16px; line-height: 1.5; word-wrap: break-word; } p,blockquote,ul,ol,dl,table,pre{margin-top: 0; margin-bottom: 16px; } blockquote{margin-right: 0; margin-left: 0; padding: 0 1em; color: #777; border-left: 0.25em solid #ddd; } a {color: #4078c0; text-decoration: none; } .markdown-body{padding: 15px; } .markdown-body>*:first-child {margin-top: 0 !important; } h1, h2, h3, h4, h5, h6{margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; } h1{padding-bottom: 0.3em; font-size: 2em; border-bottom: 1px solid #eee; } h2{padding-bottom: 0.3em; font-size: 1.5em; border-bottom: 1px solid #eee; } ul, ol {padding-left: 1em; } li>p {margin-top: 16px; } code, tt{padding: 0; padding-top: 0.2em; padding-bottom: 0.2em; margin: 0; font-size: 85%; background-color: rgba(0,0,0,0.04); border-radius: 3px; } code{white-space: normal; } code, pre{font-family: Consolas, "Liberation Mono", Courier, monospace; } del code{text-decoration: inherit; } code::before, code::after, tt::before, tt::after{letter-spacing: -0.2em; content: "\\00a0"; } del{color: #727272; } </style>'
    str += '</head>\n'
    str += '<body>\n<article class="markdown-body">'
    str += html
    str += '</article>\n</body>\n'
    str += '</html>\n'
    return str;
}