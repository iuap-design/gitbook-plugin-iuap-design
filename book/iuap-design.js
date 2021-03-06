require( [ 'gitbook' ], function ( gitbook ) {

	window.onload = function() {
		var uGitpage = {
			init: function(){
				this.summaryInit();
			},
			/**
			 * DOM元素
			 */
			DOM:{
				"$summary": $('.book-summary'),
				"$bookInner": $('.body-inner'),
				"footer":document.getElementsByTagName('footer')[0],
			},
			/**
			 * 左侧menu初始化
			 */
			summaryInit:function(){
				var DOM = this.DOM;

			    // 获取浏览器高度
				var browserH = document.documentElement.clientHeight;

	    		// 左侧目录高度设置
	    		var sumaryHeightFun = function() {
	    			// DOM.$bookInner.css('min-height',browserH + 'px');
	    			var bookInner = document.querySelectorAll('.body-inner')[0];
	    			bookInner.style.minHeight = browserH + 'px';
	    			var bookInnerHeight = parseInt(getComputedStyle(bookInner)['height']);

	    			// 判断footer是否进入
		    		var footerTop = DOM.footer.getBoundingClientRect().top;
		    		var footerHeight = parseInt(getComputedStyle(DOM.footer)['height']);
		    		var footerInner = browserH - footerTop;

	    			if(footerInner >= 0){
		    			DOM.$summary.css('height', browserH - footerInner + 'px');
		    			DOM.$summary.children('nav').eq(0).css('height',browserH - footerInner - 30 + 'px');
		    		} else {
		    			DOM.$summary.css('height', browserH + 'px');
		    			DOM.$summary.children('nav').eq(0).css('height',browserH - 30 + 'px');
		    		}
	    		};
	    		sumaryHeightFun();
		    	
			}

		};

		uGitpage.init();


	};

	gitbook.events.bind('start', function () {
	 });

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
				this.leftDirChange();
				this.mobileNav();
				window.onresize = this.mobileNav;

				this.navControl();
				this.buildTag();

				this.addClass();
				this.changeLink();

	    	},

			/**
			 * 获取DOM元素
			 * @type {Object}
			 */
			DOM: {
				"$body": $('body'),
				"$book": $('.book'),	// 文档左侧目录
				"$summary": $('.book-summary'),
				"$bookBody": $('.book-body'),	// 文档右侧主体
				"$bookInner": $('.body-inner')
			},

			DOMHandler: function() {
				var DOM = this.DOM;

				var $container = $('<div class="container"></div>');
				var $containerDiv = $('<div class="container-div"></div>');

				DOM.$book.append( $container );

				$container.append( $containerDiv );
				$containerDiv.append( DOM.$summary );
				$containerDiv.append( DOM.$bookBody );


				// 将超链接放到page-wrapper的最后
				var $pageWrapper = $('.page-wrapper');
				var $prevA = $('.navigation-prev', DOM.$bookBody );
				var $nextA = $('.navigation-next', DOM.$bookBody );

				$pageWrapper.append( $prevA );
				$pageWrapper.append( $nextA );

			    var $html = $('html');
			    $html.css('font-size','62.5%');

			    $('body').css('display','block');
			    document.body.scrollTop = 0;

			    // 设置左侧目录最大高度 : browser height - footerheight - leftmenuMargintop
				var browserH = document.documentElement.clientHeight;
			    DOM.$bookInner.css('min-height',browserH + 'px');

			    // Menu scroll
			    function menuScroll(){
			    	// HEAD Height
		    		var header = document.getElementsByTagName('header')[0];
			    	var banner = document.querySelectorAll('.banner')[0];
			    	var headerHt = parseFloat(getComputedStyle(header)['height']);
			    	var bannerHt = parseFloat(getComputedStyle(banner)['height']);
			    	var headAddHt = headerHt + bannerHt;

			    	var browserH = document.documentElement.clientHeight;

			    	var viewFunc = function() {
			    		var bodyht = document.body.scrollTop || document.documentElement.scrollTop;
				    	var contain = document.querySelectorAll('.book .container')[0];
				    	var leftPadding = parseInt(getComputedStyle(contain)['padding-left']);
				    	var leftBasic = contain.getBoundingClientRect().left;
				    	var leftDis = leftBasic + leftPadding;

				    	var anchorTop = headAddHt - bodyht + 30;

				    	if(bodyht >= headAddHt) {
				    		$('.book-summary').addClass('fix').css('left',leftDis + 'px');
				    		$('#anchors-navbar').css('top', '30px');
				    	} else {
				    		$('.book-summary').removeClass('fix');
				    		$('#anchors-navbar').css('top',anchorTop +'px');
				    	}

			    		// 判断底部进入
				    	var bookInner = document.querySelectorAll('.body-inner')[0];
		    			bookInner.style.minHeight = browserH + 'px';
		    			var bookInnerHeight = parseInt(getComputedStyle(bookInner)['height']);

		    			// 判断footer是否进入
		    			var footer =document.getElementsByTagName('footer')[0];
			    		var footerTop = footer.getBoundingClientRect().top;
			    		var footerHeight = parseInt(getComputedStyle(footer)['height']);
			    		var footerInner = browserH - footerTop;
			    		console.log()
		    			if(footerInner >= 0){
			    			// console.log('scroll in browser');
			    			DOM.$summary.css('height', browserH - footerInner + 'px');
			    			DOM.$summary.children('nav').eq(0).css('height',browserH - footerInner - 30 + 'px');
			    		} else {
			    			// console.log('scroll out browser');
			    			DOM.$summary.css('height', browserH + 'px');
			    			DOM.$summary.children('nav').eq(0).css('height',browserH - 30 + 'px');
			    		}
			    	};

				    document.body.onscroll = viewFunc();
				    window.onresize = viewFunc();
			    }
			    // menuScroll();
			    setInterval(menuScroll, 1);

			    var oH = document.body.offsetHeight;
			    var h = parseInt(oH) - 80;

			    
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
				 * gitbook 生成内容的移动端面包导航切换
				 * mobile side menu init
				 * @return {[type]} [description]
				 */
				mobileNav: function() {
					var bodyWidth = document.body.offsetWidth;
					var eleBook = document.querySelectorAll('.book')[0];
					if(bodyWidth<=600) {
						eleBook.classList ? eleBook.classList.remove('with-summary') : eleBook.className.replace(new RegExp('(^|\\b)' + 'with-summary'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
						eleBook.classList ? eleBook.classList.remove('with-search') : eleBook.className.replace(new RegExp('(^|\\b)' + 'with-search'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
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
		    	},
		    	addClass: function() {
		    		$('.book-summary > nav').addClass('nano');
		    		$('.summary').addClass('nano-content');
		    	},
		    	/**
		    	 * 用于解决gitbook生成的目录没有跳转刷新功能，导致页面加载的插件无法执行
		    	 * @return {[type]} [description]
		    	 */
		    	changeLink: function() {
	                $('.chapter a').on('click', function(){
	                    var aLink = $(this).attr('href').replace(/^\./,'');
	                    var linkPageIndex = window.location.href.lastIndexOf('/');
	                    var lastHref = window.location.href.substr(0,linkPageIndex);
	                    var newHref = window.location.href.substr(0,linkPageIndex) + aLink;
	                    // var newHref = window.location.href.replace(/\/[\w-]+\.html[#]*[\w-]*[\u4e00-\u9fa5]*$/g, aLink); //firefox没识别
	                    window.location.href = newHref;
	                    return false;
	                });
		    	}
		    	
		    }

	    uDesign.init();
	});
});
