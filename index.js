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

            // Path Array
            var pathArray=[
              'uui-original/1.0.3/fonts/font-awesome/css/font-awesome.css',
              'uui-original/1.0.3/css/u.css',
              'uui-original/1.0.3/css/u-extend.css',
              'highlight/styles/atelier-plateau-light.css',
              'scrollbar/jquery.mCustomScrollbar.css',
              'jquery/jquery-1.9.1.min.js'
            ];

            for(var i = 0, len = pathArray.length; i < len; i++){
              if ( /\.css$/.test(pathArray[i]) ) {
                pathStr + = '<link rel="stylesheet" href="'
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

            var jsStr = '';
            var ctx = 'http://design.yyuap.com/static/';

            var footPath = path.join('../../dist/pages/common/','footer.html');
            var footCont = fs.readFileSync(footPath, {encoding: "utf-8"});

            var LibArray = [
              'knockout/knockout-3.2.0.debug.js',
              'scrollbar/jquery.mCustomScrollbar.concat.min.js',
              'highlight/highlight.min.js',
              'uui-original/1.0.3/js/u.js',
              'uui-original/1.0.3/js/u-polyfill.js',
            ];

            for ( var i = 0, len = LibArray.length; i < len; i++ ) {
              jsStr += '<script src="'+ ctx + LibArray[i] + '"></script>\r\n';
            }

            return footCont + jsStr;
          }
        }
    }
};
