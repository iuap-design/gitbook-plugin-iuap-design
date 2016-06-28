require( [ 'gitbook', 'jQuery', 'lodash' ], function ( gitbook, $, _ ) {

	gitbook.events.bind('start', function () { });

	gitbook.events.bind('page.change', function () {
			/**
			 * [uDesign description]
			 * @type {Object}
			 */
	    var uDesign = {
				/**
				 * 初始化
				 * @return {[type]} [description]
				 */
	    	init: function() {
				this.DOMHandler();

				this.mobileNav();
				window.onresize = this.mobileNav;

				this.navControl();
				this.buildTag();

				this.highlight();
	    	},

			/**
			 * 获取DOM元素
			 * @type {Object}
			 */
			DOM: {
				"$body": $('body'),
				"$book": $('.book'),	// 文档左侧目录
				"$summary": $('.book-summary'),
				"$bookBody": $('.book-body')	// 文档右侧主体

			},

			DOMHandler: function() {
				var DOM = this.DOM;

				var $container = $('<div class="container"></div>');
				var $containerDiv = $('<div class="container-div"></div>');

				DOM.$book.append( $container );

				$container.append( $containerDiv );
				$containerDiv.append( DOM.$summary );
				$containerDiv.append( DOM.$bookBody );

				this.leftDirChange();

				// 将超链接放到page-wrapper的最后
				var $pageWrapper = $('.page-wrapper');
				var $prevA = $('.navigation-prev', DOM.$bookBody );
				var $nextA = $('.navigation-next', DOM.$bookBody );

				$pageWrapper.append( $prevA );
				$pageWrapper.append( $nextA );

			    var $html = $('html');
			    $html.css('font-size','62.5%');

			    $('body').css('display','block');

			    function bodyScrollFun(){
			    	var st = document.body.scrollTop || document.documentElement.scrollTop;
			    	var t = 215 - st;
			    	var t1 = 240 - st;

						if ( t > 0 ) t = 0;

						$('.book-summary').css('top', -1 * t + 'px');

						if ( t1 < 80 ) t1 = 30

						$('#anchors-navbar').css('top', t1 + 'px');
			    }

			    function bodyScroll(){
			    	document.body.onscroll = bodyScrollFun;
			    }

			    document.body.scrollTop = 0;
			    setInterval(bodyScroll,100)
			    bodyScrollFun();

			    var oH = document.body.offsetHeight;
			    var h = parseInt(oH) - 80;

			    DOM.$book.css('min-height',parseInt(oH) - 60 + 'px');
			    $containerDiv.css('min-height',parseInt(oH) - 120 + 'px');

				},

				/**
				 * 左侧目录修改
				 * @return {[type]} [description]
				 */
				leftDirChange: function() {
					var DOM = this.DOM;

					var $summaryUl = $('ul', DOM.$summary);
					var $dividerLi = $('.divider', DOM.$summaryUl);
					var $dividerLiNext = $('.divider + li', DOM.$summaryUl);

					// 去掉介绍
					$('.summary > li').first().remove();

					// 删除下面横线及之后的li
					$dividerLi.remove();
					$dividerLiNext.remove();

					var $summaryAB = $('a b',DOM.$summary);

					// 去掉目录的编号
					$summaryAB.remove();

				},

				/**
				 * 高亮代码
				 * 需要测试，是否生效
				 * @return {[type]} [description]
				 */
				highlight: function() {
					hljs.initHighlightingOnLoad();
				},

				/**
				 * gitbook 生成内容的移动端面包导航切换
				 * mobile side menu init
				 * @return {[type]} [description]
				 */
				mobileNav: function() {
					var bodyWidth = document.body.offsetWidth;
					var eleBook = document.querySelectorAll('.book')[0];
					if(bodyWidth<=600) {
						eleBook.classList ? eleBook.classList.remove('with-summary') : eleBook.className.replace(new RegExp('(^|\\b)' + 'with-summary'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
					}
				},

				/**
				 * 右侧导航控制
				 * @return {[type]} [description]
				 */
				navControl: function(){
					var openOffcanvas = $('[data-offcanvas="open"]');
					var closeOffcanvas = $('[data-offcanvas="close"]');
					var offcanvasNav = $('.offcanvas-nav');
					openOffcanvas.click(function(){
						openOffcanvas.addClass('nav-open');
						offcanvasNav.addClass('open');
						$('body').append('<div class="offcanvas-backdrop"></div>');
					});
					closeOffcanvas.click(function(){
						openOffcanvas.removeClass('nav-open');
						offcanvasNav.removeClass('open');
						$('.offcanvas-backdrop').remove();
					});
					$(document).on('click', '.offcanvas-backdrop', function(){
						openOffcanvas.removeClass('nav-open');
						offcanvasNav.removeClass('open');
						$('.offcanvas-backdrop').remove();
					});
				},

	    	/**
	    	 * 创建<style>,<script>标签
	    	 * @return {[type]} [description]
	    	 */
	    	buildTag: function() {
	    		var jsCode = document.querySelectorAll('.jstag');
	    		var cssCode = document.querySelectorAll('.csstag');
	    		var jsTag = document.createElement('script');
	    		var cssTag = document.createElement('style');

	    		for(var i=0, jsLen = jsCode.length; i<jsLen; i++) {
	    			jsTag.innerHTML += jsCode[i].textContent;
	    		}
	    		document.body.appendChild(jsTag);

	    		for(var j=0, cssLen = cssCode.length; j<cssLen; j++ ) {
	    			cssTag.innerHTML += cssCode[j].textContent;
	    		}
	    		document.head.appendChild(cssTag);
	    	}
	    }

	    uDesign.init();
	});
});
