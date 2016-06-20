var cheerio = require('cheerio');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

module.exports = {
    book: {
        assets: ".",
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
            var ctx = 'http://design.yyuap.com/static/uui-original/1.0.1';
            var lightPath = "http://design.yyuap.com/static/highlight/styles/atelier-plateau-light.css";
            var highlightPath = "http://design.yyuap.com/static/highlight/highlight.min.js";

            // CSS Path Array
            var linkArray=[
              '/fonts/font-awesome/css/font-awesome.css',
              '/css/u.css',
              '/css/u-extend.css',
              '/css/tree.css',
              '/css/grid.css'
            ];

            for(var i = 0, len = linkArray.length; i < len; i++){
              cssStr += '<link rel="stylesheet" href="'
                + ctx + linkArray[i] + '">\r\n';
            }

            cssStr += '<link rel="stylesheet" href="' + lightPath + '">\r\n';
            cssStr += '<script src="' + hightlightPath + '"></script>';

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

            var navToggleSnippets = '<div class="nav-toggle" data-offcanvas="open"><i class="flaticon-list26"></i></div>';

            headCont = headCont
              .replace(/dist/g,'../..')
              .replace(navToggleSnippets,'');

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

            footCont = footCont.replace(/dist/g,'../..');

            var jsStr = '';
            var jsLib = 'http://design.yyuap.com/static/';
            var LibArray = ['knockout/knockout-3.2.0.debug.js'];

            for ( var i = 0, len = LibArray.length; i < len; i++ ) {
              jsStr += '<script src="'+ jsLib + LibArray[i] + '"></script>\r\n';
            }

            var ctx = 'http://design.yyuap.com/static/uui-original/1.0.1';
            var scriptArray = [
              '/js/u-polyfill.js',
              '/js/u.js',
              '/js/u-tree.js',
              '/js/u-grid.js'
            ];

            for ( var j = 0, len = scriptArray.length; j < len; j++ ) {
              jsStr += '<script src="'+ ctx + scriptArray[j] + '"></script>\r\n';
            }

            return footCont + jsStr;
          }
        }
    }
};
