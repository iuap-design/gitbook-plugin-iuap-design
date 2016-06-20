var cheerio = require('cheerio');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// insert anchor link into section
var insertAnchors = function(section) {
  // 文档主体部分html对应的section内容再次修改，可直接改变生成的html，其他部分的修改由iuap-design.js处理
  var $ = cheerio.load(section.content);
	// 添加引用的js和css
	var jsCssStr = ''
	var ctx = 'http://design.yyuap.com/static/uui-original/1.0.1';
	var linkArray=['/fonts/font-awesome/css/font-awesome.css','/css/u.css','/css/u-extend.css','/css/tree.css','/css/grid.css'];
    var scriptArray=['/js/u-polyfill.js','/js/u.js','/js/u-tree.js','/js/u-grid.js'];  
    for(var i=0;i<linkArray.length;i++){
    	jsCssStr += '<link rel="stylesheet" href="'+ ctx + linkArray[i] + '">\r\n';
  	}
    jsCssStr += '<link rel="stylesheet" href="http://design.yyuap.com/static/highlight/styles/atelier-plateau-light.css">\r\n';
  	jsCssStr += '<script src="http://design.yyuap.com/static/jquery/jquery-1.11.2.js"></script>\r\n';
  	jsCssStr += '<script src="http://design.yyuap.com/static/knockout/knockout-3.2.0.debug.js"></script>\r\n';
    jsCssStr += '<script src="http://design.yyuap.com/static/highlight/highlight.min.js"></script>\r\n';
    // new add
  	for(var j=0;j<scriptArray.length;j++){
  		jsCssStr += '<script src="'+ ctx + scriptArray[j] + '"></script>\r\n';
  	}


    section.content = jsCssStr + $.html().replace(/<p><script>/g,'<script>');
};

module.exports = {
    book: {
        assets: ".",
    },
    /*hooks: {
        "page": function (page) { // before html generation
            _.forEach(page.sections, insertAnchors);

            return page;
        }
    },*/
    website: {
        assets: './book',
        js: [
            'iuap-desigin.js'
        ],
        css: [
            'iuap-desigin.css'
        ],
        html: {
          "head:end": function(current) {
            /* css */

            var cssStr = '';
            var ctx = 'http://design.yyuap.com/static/uui-original/1.0.1';
            var linkArray=['/fonts/font-awesome/css/font-awesome.css','/css/u.css','/css/u-extend.css','/css/tree.css','/css/grid.css'];      
            for(var i=0;i<linkArray.length;i++){
              cssStr += '<link rel="stylesheet" href="'+ ctx + linkArray[i] + '">\r\n';
            }
            cssStr += '<link rel="stylesheet" href="http://design.yyuap.com/static/highlight/styles/atelier-plateau-light.css">\r\n';
            cssStr += '<script src="http://design.yyuap.com/static/highlight/highlight.min.js"></script>'

            return cssStr;
          }, 
          "body:start": function(current) {
            /* header */
            var headPath = path.join('../../dist/pages/common/','header.html');
            var headCont = fs.readFileSync(headPath, {encoding: "utf-8"});
            console.log(headCont);
            headCont = headCont.replace(/dist/g,'../..').replace('<div class="nav-toggle" data-offcanvas="open"><i class="flaticon-list26"></i></div>','');
            var banner = [  '<div class="banner">',
                            ' <div class="container">',
                            '   <div class="banner-content">',
                            '       <h1>UI 组件</h1>',
                              '         <p class="info">简单易用，轻量快捷，为移动端服务的前端框架</p>',
                            '   </div>',
                            ' </div>',
                            '</div>',
            ]
            var bannerHTML = banner.join('\r\n');
            headCont = headCont + bannerHTML;

            return headCont;
          },
          "body:end": function(current) {
            /* js + footer */

            /* footer */
            var footPath = path.join('../../dist/pages/common/','footer.html');
            var footCont = fs.readFileSync(footPath, {encoding: "utf-8"});
            footCont = footCont.replace(/dist/g,'../..');

            /* js */
            var jsStr = '';
            // js Lib
            var jsLib = 'http://design.yyuap.com/static/';
            var LibArray = ['knockout/knockout-3.2.0.debug.js'];
            for(var i=0; i<LibArray.length; i++){
              jsStr += '<script src="'+ jsLib + LibArray[i] + '"></script>\r\n';
            }
            // js u-*.js
            var ctx = 'http://design.yyuap.com/static/uui-original/1.0.1';
            var scriptArray=['/js/u-polyfill.js','/js/u.js','/js/u-tree.js','/js/u-grid.js'];
            for(var j=0;j<scriptArray.length;j++){
              jsStr += '<script src="'+ ctx + scriptArray[j] + '"></script>\r\n';
            }
            

            var footContJs = footCont + jsStr;

            return footContJs;
            
          }           
        }

    }
};