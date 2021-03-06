var cheerio = require('cheerio');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

module.exports = {
    book: {
        assets: ".",
    },
    hooks: {
        "page": function (page) {
            return page;
        }
    },
    website: {
        assets: './book',
        js: [
            'iuap-design.js'
        ],
        css: [
            'iuap-design.css'
        ],
        html: {
          /**
           * head 内加载的资源
           * @param  {[type]} current [description]
           * @return {[type]}         [description]
           */
          "head:end": function(current) {

            var pathStr = '';
            var ctx = 'http://design.yyuap.com/static/';

            // Polyfill
            pathStr = '<!--[if lte IE 8]>' +
              '<script src="//cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>\r\n' +
              '<script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>\r\n' +
              '<script src="http://design.yyuap.com/static/uui/latest/js/u-polyfill.js"></script>\r\n' +
              '<![endif]-->';

            // Path Array
            var pathArray=[
              'uui/latest/css/font-awesome.css',
              // 'uui/latest/css/u.css',
              // 'uui/latest/u-extend.css',
              'uui/latest/css/tree.css',
              'uui/latest/css/grid.css',
              'highlight/styles/atelier-plateau-light.css',
              'scrollbar/jquery.mCustomScrollbar.css',
              'nanoscroller/nanoscroller.css',
              'jquery/jquery-1.9.1.min.js',
              'raty/rating.js',
              'knockout/knockout-3.2.0.debug.js',
              'uui/latest/js/u.js'
            ];

            for(var i = 0, len = pathArray.length; i < len; i++){
              if ( /\.css$/.test(pathArray[i]) ) {
                pathStr += '<link rel="stylesheet" href="'
                  + ctx + pathArray[i] + '">\r\n';
              } else if ( /\.js$/.test(pathArray[i]) ) {
                pathStr += '<script src="' + ctx + pathArray[i] + '"></script>\r\n';
              }
            }

            return pathStr;
          },

          /**
           * body 内容体
           * @param  {[type]} current [description]
           * @return {[type]}         [description]
           */
          "body:start": function(current) {
            var title = this.options.pluginsConfig['iuap-design']['title'] || "";
            var desc = this.options.pluginsConfig['iuap-design']['desc'] || "";

            var headPath = path.join('../../src/common/','header.html');
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
           * body 尾部内容，gitbook插件之后加载
           * @param  {[type]} current [description]
           * @return {[type]}         [description]
           */
          "body:end": function(current) {

            var jsStr = '';
            var ctx = 'http://design.yyuap.com/static/';

            var footPath = path.join('../../src/common/','footer.html');
            var footCont = fs.readFileSync(footPath, {encoding: "utf-8"});

            var LibArray = [
              'knockout/knockout-3.2.0.debug.js',
              'scrollbar/jquery.mCustomScrollbar.concat.min.js',
              'nanoscroller/jquery.nanoscroller.js',
              'highlight/highlight.min.js',
              'uui/latest/js/u-polyfill.js',
              'uui/latest/js/u-tree.js',
              'uui/latest/js/u-grid.js'
            ];

            for ( var i = 0, len = LibArray.length; i < len; i++ ) {
              jsStr += '<script src="'+ ctx + LibArray[i] + '"></script>\r\n';
            }

            return footCont + jsStr;
          },
          /**
           * body 尾部后添加
           * @param  {[type]} argument [description]
           * @return {[type]}          [description]
           */
          "body:add": function (argument) {
            
            var scriptStr = ''
            var codeStr = [
              '$(".nano").nanoScroller();',
              'hljs.initHighlightingOnLoad();'
            ]

            scriptStr += '<script>';            
            for( var i=0, codeLen = codeStr.length; i < codeLen; i++ ) {
              scriptStr += '\r\n' + codeStr[i];
            }
            scriptStr += '</script>';

            return scriptStr;
          }
        }
    }
};
