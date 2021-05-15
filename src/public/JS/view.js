//FROM MAIN PHTML
//======================================================================
$(document).ready(function(){

    if($.browser.msie == false ){

    $('.lb a').livequery(function(){
        $(this).lightBox({
        	overlayOpacity: 0.6,
        	imageLoading: absoluteUrl + 'images/lightbox/loading.gif',
        	imageBtnClose: absoluteUrl + 'images/lightbox/close.gif',
        	imageBtnPrev: absoluteUrl + 'images/lightbox/prev.gif',
        	imageBtnNext: absoluteUrl + 'images/lightbox/next.gif'    
        });
    });
        
        $('.musicToggle').livequery('click', function(){
        
            
            if (playMusic == 0){
                playMusic = 1;
                soundPlayAllTime("allTime");
        
            } else {
                playMusic = 0;
                soundPlayAllTime("allTime");
                //StopFlashMovie();
            }
        });
        
    }    
    
    $('.lb a').livequery('click', function(){
          soundPlay("tada");                
    });
    //soundPlayAllTime("allTime");
});

//MAINPHTML TILL HERE




//VIEW.JS
        function unhideOverflowMenus(){
            
                  $(".draggable").each(function(){
                      
                     if ($(this).attr("objtype") == "Menu"  ){
                          //$(this).html( "{" +$(this).attr("command") + "}");
                          $(this).css("overflow", "visible");
                      
                      }
                  });            
            
        }



//unhideOverflowMenus();

$('ul.jd_menu').livequery(function(){
    $(this).jdMenu();
});


		$(function() {
			$("#tree").livequery(function(){
          $(this).treeview({
    				collapsed: true,
    				animated: "medium",
    				control:"#sidetreecontrol",
    				persist: "location"
    			});
    	});		
		
		});


$('.star').livequery(function(){//stars for the comments
    $(this).rating();
});
//$('.draggable:not("templateDiv")').css({position:"relative"});



$('a.lightbox').livequery('click', function(){
    //soundPlay("OK");
});

            $('.lb a').livequery('click', function(){
                //soundPlay("tada");
            
            });


$('#banner_current').livequery(function(){
    $(this).fadeIn(1500);//pokazivac na slide 
});
$('#banner').livequery(function(){
    $(this).css({overflow:"hidden"});
});

//CORNER FOR CORNERED OBJECTS
i = 0;
$('.cornered').livequery(function(){
    $(this).each(function(){

        contentOfThis = $(this).html();
        //$(this).html("");
        //$(this).css("padding", "0px");
        cornerParam = $(this).attr("cornerstyle");
        if (!cornerParam) {
            cornerParam = "";
        }

    objClass = $(this).attr("class");
   re = /corParams_\S*/;
   if(objClass.match(re)){
        var sdwMtch = "" + objClass.match(re);
        var sdwStat = "" + sdwMtch.replace("corParams_(", "");

        var sdwExpr = "" + sdwStat.replace(")", "");
        cornerParam = "" + sdwExpr.replace(",", " ");
    } else {
        cornerParam = "";
    }
    var mySplitResult = cornerParam.split(",");
    corParam = mySplitResult[1].replace(/px/g, '');
    //background of the corner container
//    re = /corBg_\S*/;
/*    if(objClass.match(re)){
        var sdwMtch = "" + objClass.match(re);
        var sdwStat = "" + sdwMtch.replace("corBg_(", "");

        var sdwExpr = "" + sdwStat.replace(")", "");
        cornerBg = "" + sdwExpr;
    } else {
        cornerBg = "";
    }
            
        $(this).append('<div id="cornerCont_' + i + '"></div>');
        //BG
        $('#cornerCont_' + i).css({background:$(this).css("background")});
        $('#cornerCont_' + i).attr("style", $(this).attr("style") );
        $('#cornerCont_' + i).css({position:"relative", left:"0px", top:"0px"});
        
        backgAttr = cornerBg ;
        if (!backgAttr) {
            backgAttr = "#ffffff";
        }

        $(this).css({background:backgAttr ,  margin:"0px", padding:"0px"});

        $('#cornerCont_' + i).append('<div id="cornered_' + i + '"></div>')
        $('#cornerCont_' + i).corner(cornerParam);
        $('#cornered_' + i).html(contentOfThis);
        $('#cornered_' + i).css({ padding:"10px"});
        
        //$(this).corner();
        
        i++;
*/

$(this).css("-moz-border-radius", corParam + "px"); 
$(this).css("-webkit-border-radius", corParam + "px"); 
$(this).css("border-radius", corParam + "px");    
    
    });
});

//SHADOW
if($.browser.opera == false && $.browser.msie == false ) {//not supported opera and IE8

    //$('.shadowed').dropShadow();
    $('.shadowed').livequery(function(){
        $(this).each(function(){
            $('#' + $(this).attr("id") ).removeShadow(function(){
                //$('#' + $(this).attr("id") ).dropShadow();
            });
        });
    });
}
if ($.browser.msie == true ){
    $('.shadowed').each(function(){
        $('#' + $(this).attr("id") ).removeShadow();
    });
    $('.shadowed').dropShadow();
}
$('.shadowed').livequery(function(){
//$('.shadowed').each(function(){
    idObj = $(this).attr("id");
  
    objClass = $('#' + idObj ).attr("class");
    re = /dsParams_\S*/;
    if(objClass.match(re)){
        var sdwMtch = "" + objClass.match(re);
        var sdwStat = "" + sdwMtch.replace("dsParams_(", "");
        //alert(sdwStat.replace(")", ""));
        var sdwExpr = "" + sdwStat.replace(")", "");

        var names = sdwExpr.split(",");

        for ( var i in names )
        {
            //alert( names[i] );
            if(names[i].match("left:")){
            Lleft = names[i].split("left:");
            Rleft = parseInt(Lleft[1]);
            }
            if(names[i].match("top:")){    
            Ltop = names[i].split("top:");
            Rtop = parseInt(Ltop[1]);
            }
            if(names[i].match("blur:")){
            Lblur = names[i].split("blur:");
            Rblur = parseInt(Lblur[1]);
            }
            if(names[i].match("opacity:")){    
            Lopacity = names[i].split("opacity:");
            Ropacity = Lopacity[1];
            }
            if(names[i].match("color:")){
            Lcolor = names[i].split("color:");
            Rcolor = Lcolor[1];
            }

        } 
        //actual dropping the shadow
        //$('#' + idObj ).dropShadow({left:Rleft, top:Rtop, blur:Rblur, opacity:Ropacity, color:Rcolor });
        $('#' + idObj ).css("-moz-box-shadow", Rleft + "px " + Rtop + "px " + Rblur + "px " + Rcolor);
        $('#' + idObj ).css("-webkit-box-shadow", Rleft + "px " + Rtop + "px " + Rblur + "px " + Rcolor);
        $('#' + idObj ).css("box-shadow", Rleft + "px " + Rtop + "px " + Rblur + "px " + Rcolor);
        //$(this).dropShadow();
    } else {
        //alert(objClass);
        $('#' + idObj ).dropShadow();
    }
});
//});


//slide links
$('.slideLinks').livequery('click', function(){
    if($.browser.msie == false) {
        //soundPlay("OK");
    }
    
   //alert($(this).attr("id") + $(this).position().left );
   $('#banner_current').animate({marginLeft:$(this).position().left + ($(this).width()/2)}, 500);


$('.currentBanner').fadeOut(1500);
   $('.currentBanner').animate({marginLeft:"-2000px"}, 1500).removeClass('currentBanner');
    $('.banners').hide({direction:"left"});
    //$('.banners').animate({marginLeft:"-2000px"}, 1500);
    
    //$('#banner_00'+ $(this).attr("id")).show({direction:"right"});
    
    //$('#banner_00'+ $(this).attr("id")).css({marginLeft:"-2000px"});
        $('#banner_00'+ $(this).attr("title")).animate({marginLeft:"0px"}).fadeIn();
        $('#banner_00'+ $(this).attr("title")).addClass('currentBanner');


   //return false;
});

$('.slideLinks[title^="0"]').livequery(function(){
  $(this).click();
});


//SERIAL SCROLL

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

/**
 * jQuery[a] - Animated scrolling of series
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/20/2008
 * @author Ariel Flesler
 * @version 1.2.1
 *
 * http://flesler.blogspot.com/2008/02/jqueryserialscroll.html
 */
;(function($){var a='serialScroll',b='.'+a,c='bind',C=$[a]=function(b){$.scrollTo.window()[a](b)};C.defaults={duration:1e3,axis:'x',event:'click',start:0,step:1,lock:1,cycle:1,constant:1};$.fn[a]=function(y){y=$.extend({},C.defaults,y);var z=y.event,A=y.step,B=y.lazy;return this.each(function(){var j=y.target?this:document,k=$(y.target||this,j),l=k[0],m=y.items,o=y.start,p=y.interval,q=y.navigation,r;if(!B)m=w();if(y.force)t({},o);$(y.prev||[],j)[c](z,-A,s);$(y.next||[],j)[c](z,A,s);if(!l.ssbound)k[c]('prev'+b,-A,s)[c]('next'+b,A,s)[c]('goto'+b,t);if(p)k[c]('start'+b,function(e){if(!p){v();p=1;u()}})[c]('stop'+b,function(){v();p=0});k[c]('notify'+b,function(e,a){var i=x(a);if(i>-1)o=i});l.ssbound=1;if(y.jump)(B?k:w())[c](z,function(e){t(e,x(e.target))});if(q)q=$(q,j)[c](z,function(e){e.data=Math.round(w().length/q.length)*q.index(this);t(e,this)});function s(e){e.data+=o;t(e,this)};function t(e,a){if(!isNaN(a)){e.data=a;a=l}var c=e.data,n,d=e.type,f=y.exclude?w().slice(0,-y.exclude):w(),g=f.length,h=f[c],i=y.duration;if(d)e.preventDefault();if(p){v();r=setTimeout(u,y.interval)}if(!h){n=c<0?0:n=g-1;if(o!=n)c=n;else if(!y.cycle)return;else c=g-n-1;h=f[c]}if(!h||d&&o==c||y.lock&&k.is(':animated')||d&&y.onBefore&&y.onBefore.call(a,e,h,k,w(),c)===!1)return;if(y.stop)k.queue('fx',[]).stop();if(y.constant)i=Math.abs(i/A*(o-c));k.scrollTo(h,i,y).trigger('notify'+b,[c])};function u(){k.trigger('next'+b)};function v(){clearTimeout(r)};function w(){return $(m,l)};function x(a){if(!isNaN(a))return a;var b=w(),i;while((i=b.index(a))==-1&&a!=l)a=a.parentNode;return i}})}})(jQuery);