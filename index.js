var cheerio = require('cheerio');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var insertAnchors = function(section) {
  // 文档主体部分html对应的section内容再次修改，可直接改变生成的html，其他部分的修改由iuap-design.js处理
  // 添加引用的js和css
    // section.content = $.html();
    section.content = section.content.replace(/div class="jstag"/g,'script')
};


module.exports = {
    book: {
        assets: ".",
    },
    hooks: {
        "page": function (page) { // before html generation
            // _.forEach(page.sections, insertAnchors);
            // console.log(page.sections[0].content);
            // page.sections[0].content = page.sections[0].content.replace(/div class="jstag"/g,'script');

            return page;
        }
    },
    website: {
        assets: './book',
        js: [
            'iuap-desigin.js'
        ],
        css: [
            'iuap-desigin.css'
        ],
        html: {
          /**
           * head 内加载的资源
           * @param  {[type]} current [description]
           * @return {[type]}         [description]
           */
          "head:end": function(current) {

            var cssStr = '';
            var ctx = 'http://design.yyuap.com/static/uui-original/1.0.3';
            var lightPath = "http://design.yyuap.com/static/highlight/styles/atelier-plateau-light.css";
            var hightlightPath = "http://design.yyuap.com/static/highlight/highlight.min.js";
            var ujsPath = "http://design.yyuap.com/static/uui-original/1.0.3/js/u.js"

            // CSS Path Array
            var linkArray=[
              '/fonts/font-awesome/css/font-awesome.css',
              '/css/u.css',
              '/css/u-extend.css'
              // '/css/tree.css',
              // '/css/grid.css'
            ];

            for(var i = 0, len = linkArray.length; i < len; i++){
              cssStr += '<link rel="stylesheet" href="'
                + ctx + linkArray[i] + '">\r\n';
            }

            cssStr += '<link rel="stylesheet" href="' + lightPath + '">\r\n';
            cssStr += '<script src="' + hightlightPath + '"></script>';
            cssStr += '<script src="' + ujsPath + '"></script>'

            return cssStr;
          },

          /**
           * body 内容体
           * @param  {[type]} current [description]
           * @return {[type]}         [description]
           */
          "body:start": function(current) {
            var title = this.options.pluginsConfig['iuap-design']['title']
              || "UI 组件";
            var desc = this.options.pluginsConfig['iuap-design']['desc']
              || "简单易用，轻量快捷，为移动端服务的前端框架";

            var headPath = path.join('../../dist/pages/common/','header.html');
            var headCont = fs.readFileSync(headPath, {encoding: "utf-8"});

            var banner = [
              '<div class="banner">',
                ' <div class="container">',
                '   <div class="banner-content">',
                '       <h1>' + title + '</h1>',
                  '         <p class="info">' + desc + '</p>',
                '   </div>',
                ' </div>',
              '</div>'
            ]

            var bannerHTML = banner.join('\r\n');

            return headCont + bannerHTML;
          },

          /**
           * body 尾部内容
           * @param  {[type]} current [description]
           * @return {[type]}         [description]
           */
          "body:end": function(current) {

            var footPath = path.join('../../dist/pages/common/','footer.html');
            var footCont = fs.readFileSync(footPath, {encoding: "utf-8"});

            var jsStr = '';
            var jsLib = 'http://design.yyuap.com/static/';
            var LibArray = ['knockout/knockout-3.2.0.debug.js'];

            for ( var i = 0, len = LibArray.length; i < len; i++ ) {
              jsStr += '<script src="'+ jsLib + LibArray[i] + '"></script>\r\n';
            }

            var ctx = 'http://design.yyuap.com/static/uui-original/1.0.3';
            var scriptArray = [
              '/js/u-polyfill.js',
              // '/js/u.js'
              // '/js/u-tree.js',
              // '/js/u-grid.js'
            ];

            for ( var j = 0, len = scriptArray.length; j < len; j++ ) {
              jsStr += '<script src="'+ ctx + scriptArray[j] + '"></script>\r\n';
            }
            
            return footCont + jsStr;
          }
        }
    }
};
