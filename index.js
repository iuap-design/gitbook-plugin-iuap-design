var cheerio = require('cheerio');
var _ = require('underscore');

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
    hooks: {
        "page": function (page) { // before html generation
            _.forEach(page.sections, insertAnchors);

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
        ]
    }
};