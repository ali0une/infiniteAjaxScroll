(function($){'use strict';Date.now=Date.now||function(){return+new Date();};$.ias=function(options)
{var opts=$.extend({},$.ias.defaults,options);var util=new $.ias.util();var paging=new $.ias.paging(opts.scrollContainer);var hist=(opts.history?new $.ias.history():false);var _self=this;function init()
{var pageNum;paging.onChangePage(function(pageNum,scrollOffset,pageUrl){if(hist){hist.setPage(pageNum,pageUrl);}
opts.onPageChange.call(this,pageNum,pageUrl,scrollOffset);});reset();if(hist&&hist.havePage()){stop_scroll();pageNum=hist.getPage();util.forceScrollTop(function(){var curThreshold;if(pageNum>1){paginateToPage(pageNum);curThreshold=get_scroll_threshold(true);$('html, body').scrollTop(curThreshold);}
else{reset();}});}
return _self;}
init();function reset()
{hide_pagination();opts.scrollContainer.scroll(scroll_handler);}
function scroll_handler()
{var curScrOffset,scrThreshold;curScrOffset=util.getCurrentScrollOffset(opts.scrollContainer);scrThreshold=get_scroll_threshold();if(curScrOffset>=scrThreshold){if(get_current_page()>=opts.triggerPageThreshold){stop_scroll();show_trigger(function(){paginate(curScrOffset);});}
else{paginate(curScrOffset);}}}
function stop_scroll()
{opts.scrollContainer.unbind('scroll',scroll_handler);}
function hide_pagination()
{$(opts.pagination).hide();}
function get_scroll_threshold(pure)
{var el,threshold;el=$(opts.container).find(opts.item).last();if(el.size()===0){return 0;}
threshold=el.offset().top+el.height();if(!pure){threshold+=opts.thresholdMargin;}
return threshold;}
function paginate(curScrOffset,onCompleteHandler)
{var urlNextPage;urlNextPage=$(opts.next).attr('href');if(!urlNextPage){if(opts.noneleft){$(opts.container).find(opts.item).last().after(opts.noneleft);}
return stop_scroll();}
if(opts.beforePageChange&&$.isFunction(opts.beforePageChange)){if(opts.beforePageChange(curScrOffset,urlNextPage)===false){return;}}
paging.pushPages(curScrOffset,urlNextPage);stop_scroll();show_loader();loadItems(urlNextPage,function(data,items){var result=opts.onLoadItems.call(this,items),curLastItem;if(result!==false){$(items).hide();curLastItem=$(opts.container).find(opts.item).last();curLastItem.after(items);$(items).fadeIn();}
urlNextPage=$(opts.next,data).attr('href');$(opts.pagination).replaceWith($(opts.pagination,data));remove_loader();hide_pagination();if(urlNextPage){reset();}
else{stop_scroll();}
opts.onRenderComplete.call(this,items);if(onCompleteHandler){onCompleteHandler.call(this);}});}
function loadItems(url,onCompleteHandler,delay)
{var items=[],container,startTime=Date.now(),diffTime,self;delay=delay||opts.loaderDelay;$.get(url,null,function(data){container=$(opts.container,data).eq(0);if(0===container.length){container=$(data).filter(opts.container).eq(0);}
if(container){container.find(opts.item).each(function(){items.push(this);});}
if(onCompleteHandler){self=this;diffTime=Date.now()-startTime;if(diffTime<delay){setTimeout(function(){onCompleteHandler.call(self,data,items);},delay-diffTime);}else{onCompleteHandler.call(self,data,items);}}},'html');}
function paginateToPage(pageNum)
{var curThreshold=get_scroll_threshold(true);if(curThreshold>0){paginate(curThreshold,function(){stop_scroll();if((paging.getCurPageNum(curThreshold)+1)<pageNum){paginateToPage(pageNum);$('html,body').animate({'scrollTop':curThreshold},400,'swing');}
else{$('html,body').animate({'scrollTop':curThreshold},1000,'swing');reset();}});}}
function get_current_page()
{var curScrOffset=util.getCurrentScrollOffset(opts.scrollContainer);return paging.getCurPageNum(curScrOffset);}
function get_loader()
{var loader=$('.ias_loader');if(loader.size()===0){loader=$('<div class="ias_loader">'+opts.loader+'</div>');loader.hide();}
return loader;}
function show_loader()
{var loader=get_loader(),el;if(opts.customLoaderProc!==false){opts.customLoaderProc(loader);}else{el=$(opts.container).find(opts.item).last();el.after(loader);loader.fadeIn();}}
function remove_loader()
{var loader=get_loader();loader.remove();}
function get_trigger(callback)
{var trigger=$('.ias_trigger');if(trigger.size()===0){trigger=$('<div class="ias_trigger"><a href="#">'+opts.trigger+'</a></div>');trigger.hide();}
$('a',trigger).off('click').on('click',function(){remove_trigger();callback.call();return false;});return trigger;}
function show_trigger(callback)
{var trigger=get_trigger(callback),el;el=$(opts.container).find(opts.item).last();el.after(trigger);trigger.fadeIn();}
function remove_trigger()
{var trigger=get_trigger();trigger.remove();}};$.ias.defaults={container:'#container',scrollContainer:$(window),item:'.item',pagination:'#pagination',next:'.next',noneleft:false,loader:'<img src="images/loader.gif"/>',loaderDelay:600,triggerPageThreshold:3,trigger:'Load more items',thresholdMargin:0,history:true,onPageChange:function(){},beforePageChange:function(){},onLoadItems:function(){},onRenderComplete:function(){},customLoaderProc:false};$.ias.util=function()
{var wndIsLoaded=false;var forceScrollTopIsCompleted=false;var self=this;function init()
{$(window).load(function(){wndIsLoaded=true;});}
init();this.forceScrollTop=function(onCompleteHandler)
{$('html,body').scrollTop(0);if(!forceScrollTopIsCompleted){if(!wndIsLoaded){setTimeout(function(){self.forceScrollTop(onCompleteHandler);},1);}else{onCompleteHandler.call();forceScrollTopIsCompleted=true;}}};this.getCurrentScrollOffset=function(container)
{var scrTop,wndHeight;if(container.get(0)===window){scrTop=container.scrollTop();}else{scrTop=container.offset().top;}
wndHeight=container.height();return scrTop+wndHeight;};};$.ias.paging=function()
{var pagebreaks=[[0,document.location.toString()]];var changePageHandler=function(){};var lastPageNum=1;var util=new $.ias.util();function init()
{$(window).scroll(scroll_handler);}
init();function scroll_handler()
{var curScrOffset,curPageNum,curPagebreak,scrOffset,urlPage;curScrOffset=util.getCurrentScrollOffset($(window));curPageNum=getCurPageNum(curScrOffset);curPagebreak=getCurPagebreak(curScrOffset);if(lastPageNum!==curPageNum){scrOffset=curPagebreak[0];urlPage=curPagebreak[1];changePageHandler.call({},curPageNum,scrOffset,urlPage);}
lastPageNum=curPageNum;}
function getCurPageNum(scrollOffset)
{for(var i=(pagebreaks.length-1);i>0;i--){if(scrollOffset>pagebreaks[i][0]){return i+1;}}
return 1;}
this.getCurPageNum=function(scrollOffset)
{scrollOffset=scrollOffset||util.getCurrentScrollOffset($(window));return getCurPageNum(scrollOffset);};function getCurPagebreak(scrollOffset)
{for(var i=(pagebreaks.length-1);i>=0;i--){if(scrollOffset>pagebreaks[i][0]){return pagebreaks[i];}}
return null;}
this.onChangePage=function(fn)
{changePageHandler=fn;};this.pushPages=function(scrollOffset,urlNextPage)
{pagebreaks.push([scrollOffset,urlNextPage]);};};$.ias.history=function()
{var isPushed=false;var isHtml5=false;function init()
{isHtml5=!!(window.history&&history.pushState&&history.replaceState);isHtml5=false;}
init();this.setPage=function(pageNum,pageUrl)
{this.updateState({page:pageNum},'',pageUrl);};this.havePage=function()
{return(this.getState()!==false);};this.getPage=function()
{var stateObj;if(this.havePage()){stateObj=this.getState();return stateObj.page;}
return 1;};this.getState=function()
{var haveState,stateObj,pageNum;if(isHtml5){stateObj=history.state;if(stateObj&&stateObj.ias){return stateObj.ias;}}
else{haveState=(window.location.hash.substring(0,7)==='#/page/');if(haveState){pageNum=parseInt(window.location.hash.replace('#/page/',''),10);return{page:pageNum};}}
return false;};this.updateState=function(stateObj,title,url)
{if(isPushed){this.replaceState(stateObj,title,url);}
else{this.pushState(stateObj,title,url);}};this.pushState=function(stateObj,title,url)
{var hash;if(isHtml5){history.pushState({ias:stateObj},title,url);}
else{hash=(stateObj.page>0?'#/page/'+stateObj.page:'');window.location.hash=hash;}
isPushed=true;};this.replaceState=function(stateObj,title,url)
{if(isHtml5){history.replaceState({ias:stateObj},title,url);}
else{this.pushState(stateObj,title,url);}};};})(jQuery);