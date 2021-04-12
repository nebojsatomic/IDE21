/*THIS IS FROM frontend.js - BEGIN*/
//FRONTEND.JS
//Js important for all modules and components

//ajax-loader-fix
$('#ajax-loader').livequery(function(){
    $(this).css("background", absoluteUrl + "images/ajax-loader.gif");
});
    
$('a:not(".lightbox")').livequery('click', function(){

        contentUrl = $(this).attr("href");
        if( $(this).attr("class") == "blankLink" ){
            return true;
        }    
        if( $(this).attr("target") == "_blank" ){
            return true;
        } 
    if (contentUrl.match("mailto:") == null){//ako nije mailto link  

    if( $(this).attr("class") == "commentsDeleteLink" ){
        //alert($(this).attr("title") );
        $('#commentDiv_' + $(this).attr("rel") ).fadeOut(1500);
        $.post($(this).attr("href"), function(data){
            alert(data);
        });
        
        return false; 
    }

        $('#ajax-loader').appendTo('#centerWrapper').fadeIn();
        $('.ajax-loader').appendTo('#centerWrapper').fadeIn();
    
        //$('.draggable:not(".templateDiv")').fadeOut();
        $('#Slideshow').fadeOut();
        $('.dropShadow').fadeOut();
        $('#banner ').fadeOut();

        //Languages
        if( $(this).attr("class") == "langLinks" ){
            $.get(contentUrl, function(){
                //alert(data);
                //$("#content").css({display:"none"});
                //$('#content').html(dat);

                $.get( $(this).attr("value"), function(data){
                    //resizeSite();
                    //$('#content').html(data.output);
                    //$('body').css({background:data.bodyBG.replace(/;/, '')});
                        
                    $('#content').html(data);
                    
                    $('#ajax-loader').fadeOut();      
                    $('.ajax-loader').fadeOut();
                    
                    //podesavanje bannera u slideu
                    $('.banners').css({top:"10px"});
                    $('#banner ').css({overflow:"hidden"});
                    
                    //LB u slideu  mora opet
                    $('.lb a').lightBox({
                    	overlayOpacity: 0.6,
                    	imageLoading: absoluteUrl + 'images/lightbox/loading.gif',
                    	imageBtnClose: absoluteUrl + 'images/lightbox/close.gif',
                    	imageBtnPrev: absoluteUrl + 'images/lightbox/prev.gif',
                    	imageBtnNext: absoluteUrl + 'images/lightbox/next.gif'
                    
                    });
                    
                });
            });           
        //return true;
        } else {
            //ako nisu languages
            $('#ajax-loader').appendTo('body');      
                $('.ajax-loader').appendTo('body');
            $.get(contentUrl, function(data){
                //resizeSite();
                      $('#content').html(data);
                    $('#content').hide('explode', function(){
                                                      $('#content').html(data);$('body').css({background: bodyBgA[0]});
                                                      $('body').css("-moz-background-size", bodyBgSizeA[1]);
                                                      $('body').css("-webkit-background-size" , bodyBgSizeA[3]);
                                                      $('body').css("-o-background-size" , bodyBgSizeA[5]);
                                                      $('body').css("background-size" , bodyBgSizeA[7]);
                                                  }, 1000 ).show('blind',function(){$('#ajax-loader').fadeOut();$('.ajax-loader').fadeOut(); }, 1000);

                //$('#content .draggable:not(".templateDiv")').css({display:"none"});
                //$('#content .draggable:not(".templateDiv")').show(1500);
           
                setTimeout("$('#ajax-loader').fadeOut();$('.ajax-loader').fadeOut();", 1500);
                
                //podesavanje bannera u slideu
                $('.banners').css({top:"10px"});
                $('#banner ').css({overflow:"hidden"});
                
                //LB u slideu  mora opet
                $('.lb a').lightBox({
                	overlayOpacity: 0.6,
                	imageLoading: absoluteUrl + 'images/lightbox/loading.gif',
                	imageBtnClose: absoluteUrl + 'images/lightbox/close.gif',
                	imageBtnPrev: absoluteUrl + 'images/lightbox/prev.gif',
                	imageBtnNext: absoluteUrl + 'images/lightbox/next.gif'
                
                });
            });        
        
        }

        
                
        return false;
        //return true;
    } else {
        return true;//ako je mailto
    }
        
});






//SEARCH
$('input[type=submit]').livequery('click', function(){
    $('#ajax-loader').fadeIn();
    $('.ajax-loader').fadeIn();
});

$('#what').livequery('keypress', function (e) {

    if (e.which == 13) {
    $('#ajax-loader').fadeIn();
    $('.ajax-loader').fadeIn();
    //return false;
    }
});

//if( $.browser.msie == false && $.browser.opera == false) {
    $('form').livequery(function(){
        $(this).ajaxForm(function(data){
            $('#ajax-loader').fadeOut();
            $('.ajax-loader').fadeOut();

            $('#content').html(data);            
            
        });
    });

//}//if browser

$('ul.jd_menu').jdMenu();





//comentari ako je absolutno pozicioniranje
if($('#commentsDivWrapper').css("position") == "absolute"){
    $('#commentsDivWrapper').livequery(function(){
        $(this).css({ display:"none", zIndex:"99999", width:"100%", maxWidth:"900px", position:"absolute", margin:"10px", top:$(document).height()  });
        $(this).fadeIn(1500);
    });
    
}


//white backgrounds for content in net template
$('.contentBg').livequery(function(){
    $(this).css({paddingBottom:"40", border:"0px solid #555555", borderBottom:"0", height:$(document).height() - $(this).position().top -40 });
    //$(this).css({paddingBottom:"40", border:"0px solid #555555", borderBottom:"0" });

});

//FOOTER
//$('.footer').css({ top:$(document).height(), marginTop:"0"});
$('.footer').livequery(function(){
    if($('.contentBg').css("top") ){
        $(this).css({ top:$('.contentBg').height() + $('.contentBg').position().top, margin:"0"});
        //$(this).css({ top:$(document).height(), margin:"0"});
    } else {
        $(this).css({ top:$(document).height()});
    }


    //alert($('.contentBg').position().top);
    $(this).show(); 
});
//shadows for the conteiner on the centered template
if($('.footer').css("top") ){
currentTop =  $('.footer').css("top").replace("px", "");
footerHeight = $('.footer').css("height").replace("px", "");
}
//alert(currentTop + "-" +  );

//treba videti odakle dolazi ovo -20
$('.centerShadow').livequery(function(){
    $(this).css({height:$(document).height()-20  });//for giving shadows to the divs which are wrapped inside centered template
});

$('.menuObj').livequery(function(){//making the menu div visible by default
    $(this).css({overflow:"visible"});
});

/*THIS IS FROM frontend.js - END*/
/*THIS IS FROM view.js - BEGIN*/
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
;(function($){var a='serialScroll',b='.'+a,c='bind',C=$[a]=function(b){$.scrollTo.window()[a](b)};C.defaults={duration:1e3,axis:'x',event:'click',start:0,step:1,lock:1,cycle:1,constant:1};$.fn[a]=function(y){y=$.extend({},C.defaults,y);var z=y.event,A=y.step,B=y.lazy;return this.each(function(){var j=y.target?this:document,k=$(y.target||this,j),l=k[0],m=y.items,o=y.start,p=y.interval,q=y.navigation,r;if(!B)m=w();if(y.force)t({},o);$(y.prev||[],j)[c](z,-A,s);$(y.next||[],j)[c](z,A,s);if(!l.ssbound)k[c]('prev'+b,-A,s)[c]('next'+b,A,s)[c]('goto'+b,t);if(p)k[c]('start'+b,function(e){if(!p){v();p=1;u()}})[c]('stop'+b,function(){v();p=0});k[c]('notify'+b,function(e,a){var i=x(a);if(i>-1)o=i});l.ssbound=1;if(y.jump)(B?k:w())[c](z,function(e){t(e,x(e.target))});if(q)q=$(q,j)[c](z,function(e){e.data=Math.round(w().length/q.length)*q.index(this);t(e,this)});function s(e){e.data+=o;t(e,this)};function t(e,a){if(!isNaN(a)){e.data=a;a=l}var c=e.data,n,d=e.type,f=y.exclude?w().slice(0,-y.exclude):w(),g=f.length,h=f[c],i=y.duration;if(d)e.preventDefault();if(p){v();r=setTimeout(u,y.interval)}if(!h){n=c<0?0:n=g-1;if(o!=n)c=n;else if(!y.cycle)return;else c=g-n-1;h=f[c]}if(!h||d&&o==c||y.lock&&k.is(':animated')||d&&y.onBefore&&y.onBefore.call(a,e,h,k,w(),c)===!1)return;if(y.stop)k.queue('fx',[]).stop();if(y.constant)i=Math.abs(i/A*(o-c));k.scrollTo(h,i,y).trigger('notify'+b,[c])};function u(){k.trigger('next'+b)};function v(){clearTimeout(r)};function w(){return $(m,l)};function x(a){if(!isNaN(a))return a;var b=w(),i;while((i=b.index(a))==-1&&a!=l)a=a.parentNode;return i}})}})(jQuery);/*THIS IS FROM view.js - END*/
/*THIS IS FROM default_proba.js- BEGIN*/
$('#net_113_5_13_15_42_5').livequery('dblclick', function(){


});
                // alert('hej');

 $('#net_111_3_29_20_10_12').livequery('click', function(){

alert('ema');
});
               

 $('#screen').serialScroll({
		target:'#sections',
		items:'li', // Selector to the items ( relative to the matched elements, '#sections' in this case )
		prev:'img.prev',// Selector to the 'prev' button (absolute!, meaning it's relative to the document)
		next:'img.next',// Selector to the 'next' button (absolute too)
		axis:'xy',// The default is 'y' scroll on both ways
		navigation:'#navigation li a',
		duration:700,// Length of the animation (if you scroll 2 axes and use queue, then each axis take half this time)
		force:true, // Force a scroll to the element specified by 'start' (some browsers don't reset on refreshes)
		
		//queue:false,// We scroll on both axes, scroll both at the same time.
		//event:'click',// On which event to react (click is the default, you probably won't need to specify it)
		//stop:false,// Each click will stop any previous animations of the target. (false by default)
		//lock:true, // Ignore events if already animating (true by default)		
		//start: 0, // On which element (index) to begin ( 0 is the default, redundant in this case )		
		//cycle:true,// Cycle endlessly ( constant velocity, true is the default )
		//step:1, // How many items to scroll each time ( 1 is the default, no need to specify )
		//jump:false, // If true, items become clickable (or w/e 'event' is, and when activated, the pane scrolls to them)
		//lazy:false,// (default) if true, the plugin looks for the items on each event(allows AJAX or JS content, or reordering)
		//interval:1000, // It's the number of milliseconds to automatically go to the next
		//constant:true, // constant speed
		
		onBefore:function( e, elem, $pane, $items, pos ){
			/**
			 * 'this' is the triggered element 
			 * e is the event object
			 * elem is the element we'll be scrolling to
			 * $pane is the element being scrolled
			 * $items is the items collection at this moment
			 * pos is the position of elem in the collection
			 * if it returns false, the event will be ignored
			 */
			 //those arguments with a $ are jqueryfied, elem isn't.
			e.preventDefault();
			if( this.blur )
				this.blur();
		},
		onAfter:function( elem ){
			//'this' is the element being scrolled ($pane) not jqueryfied
		}
	});


 $('#slideshow').serialScroll({
		items:'li',
		prev:'#screen2 a.prev',
		next:'#screen2 a.next',
		offset:-230, //when scrolling to photo, stop 230 before reaching it (from the left)
		start:1, //as we are centering it, start at the 2nd
		duration:1200,
		force:true,
		stop:true,
		lock:false,
		cycle:false, //don't pull back once you reach the end
		easing:'easeOutQuart', //use this easing equation for a funny effect
		jump: true //click on the images to scroll to them
	});

$('#net_110_4_15_14_10_49').livequery('click', function(){
$('#net_110_4_13_0_6_54').toggle(1500);

});
                $('#kjhlkjh').click(function(){
//alert('ja');
});
/*THIS IS FROM default_proba.js- END*/


/*THIS IS FROM default_nebojsa.js- BEGIN*/
//LABORATORIJA ZVUKA

if ($.browser.msie == true && $.browser.version != "8.0"){
    $('#net_110_5_16_15_45_8').css({left:"0px"});
    $('#net_110_5_16_16_27_13').css({left:"0px"});
}
$('#net_110_5_16_16_27_13').addClass("footer");
$('#net_110_5_16_16_27_13').appendTo('body');
$('#net_110_5_16_14_58_19 ul li').livequery('click', function(){
//alert($(this).children('a').attr("href") );
document.location.href = $(this).children('a').attr("href");
});

$('#net_110_5_16_14_58_19 ul li').livequery('mouseover', function(){
$(this).removeClass("normalMenu");
$(this).addClass("hoveredMenu");
});
$('#net_110_5_16_14_58_19 ul li').livequery('mouseout', function(){
$(this).removeClass("hoveredMenu");
$(this).addClass("normalMenu");
});

//LABORATORIJA ZVUKA - END


$('#net_109_9_25_14_5_11').livequery('click', function(){
alert('ja');
});
               
//DEFAULT.JS
//$('#net_109_9_1_18_16_14').cycle({fx:'scrollLeft',shuffle:{left:-200, top:-400}, speed:900, timeout:6000, easing: 'bounceout', delay: -4000 });
//$('#net_109_9_1_20_22_43').cycle({fx:'scrollLeft',shuffle:{left:-200, top:-400}, speed:900, timeout:6000, easing: 'bounceout', delay: -4000 });
//$('#net_109_9_1_20_27_6').cycle({fx:'scrollLeft',shuffle:{left:-200, top:-400}, speed:900, timeout:6000, easing: 'bounceout', delay: -4000 });

//$('#net_109_8_11_13_42_47').cycle({fx:'scrollLeft', easing: 'bounceout', delay: -2000 });

$('#net_109_8_11_16_43_49').height($(document).height());

/*SNOOPY*/



/*NET arrow in slide*/  
$('#net_109_6_29_18_4_55 #Slideshow img').livequery(function(){
    $(this).attr("src", absoluteUrl + "images/NeT/netSlidePointer.png").css("margin-top","-30px");
});

$('#net_109_8_3_19_58_9 #Slideshow img').livequery(function(){
    $(this).attr("src", absoluteUrl + "images/Snoopy/snoopySlidePointer.png");
});
/*DONET*/
$('#net_109_7_18_15_10_0 a').attr("target", "_self");

$('#net_109_7_23_19_14_32').livequery(function(){$(this).append('<img src="' + absoluteUrl + 'images/Donet/ajax-loader.gif" />' ); });
$('#net_109_7_23_19_14_32').livequery(function(){$(this).css({top:"-25px", left:"770px"}); });
//$('#net_109_7_18_17_10_59').animate({left:"200px"}, 1500);

$('#net_109_7_19_17_34_20').css({height:$(document).height() - $('.footer').height() });


$('#net_109_7_22_13_32_38 table tbody tr.overRow td').css("background", "#f4f4f4");


//tables in the content
$('#net_109_7_22_13_32_38 tr:odd td').css("background", "#cccccc");

$('.tableHeaders td').css({background:"#f5f5f5"});


/*DONET DO OVDE*/


                                                                                                                                                                                                                                                                                                                                                                                                                //footer





$('#banner').livequery(function(){
    $(this).css({background:"#ffffff"});
});
                                                                
$('#net_109_6_29_18_30_33 p span').css({background:"transparent"});


//NETOBJECTS $('#ajax-loader').css({top:"340px", left:"940px"});
//$('#ajax-loader').css({top:"10px", left:"10px", zIndex:"999999"});//donet
//$('#ajax-loader').show();
$('#net_109_6_29_18_4_55').css({zIndex:"1000"});

                                                                                                                                                                                                                //netobjects img shadow


//IF SAFARI
if( $.browser.safari == true) {
//$('body').css({background:"none"});

}


//IF OPERA
if( $.browser.opera == false) {
    $('#Slideshow').livequery(function(){
        $(this).dropShadow();
    });
    
} else {

//$('#net_109_6_30_0_40_13').css({width:"432px"});
}
$('#net_109_6_29_18_4_55 #Slideshow').livequery(function(){$(this).corner("bottom wicked") ; });  
//$('#net_109_6_30_0_40_13').css({width:"432px"}); 




                
                                                                                                                                                                               


$('#categoriesTable h1').dropShadow();
                                                                                                                                                                                                                                                                                
$('#net_109_6_29_18_4_55 #Slideshow h1').removeShadow();


/*jdMEnu shadow with png image*/

//$('#net_109_6_30_0_40_13 ul li').css({background:"none"}); 


$('#net_109_6_30_0_40_13 ul li ul li').livequery(function(){$(this).css({marginLeft:"4px", marginRight:"6px"});}); 
$('#net_109_6_30_0_40_13 ul li ul').livequery(function(){$(this).css({background:"url(" + absoluteUrl + "images/backgrounds/menuBg.png) repeat-y", width:"210px", marginLeft:"-1px"}); });  
liZaUl = '<div class="shadowLiInUl" style="background: url(' + absoluteUrl + 'images/backgrounds/menuBgBottom.png)no-repeat;height:5px;margin-top:-4px;margin-left:0px;margin-right:6px;" ></div>';
$('#net_109_6_30_0_40_13 ul li ul').livequery(function(){$(this).append(liZaUl); });  


$('#net_109_11_31_17_51_46 ul li').each(function(){

if($(this).children() ){
    $(this ).addClass('parent');
}
});

$('#net_109_11_31_17_51_46 ul li ul li').each(function(){
    $(this ).removeClass('parent');
//alert($(this).children());
if($(this).find('ul')) {

    $(this ).parent('li').addClass('parentSub');
} else {

}
});
        
//$('#net_109_11_27_23_53_13').parent('body');

if($('#net_109_11_27_23_53_13').attr("id") ){

    $('#net_109_11_27_23_53_13').livequery(function(){

        $('#realFooter').remove();
        //$('body').append('<div id="realFooter" style="' + $('#net_109_11_27_23_53_13').attr('style') + ';border-top:1px solid #f4f4f4;top:' + $('#net_109_11_27_23_53_13').position().top + ';width:100%;" class="footer coreTemplate1 ' + $('#net_109_11_27_23_53_13').attr('class') + '">' + $('#net_109_11_27_23_53_13').html() + '</div>');         
        $('body').append('<div id="realFooter" style="' + $('#net_109_11_27_23_53_13').attr('style') + ';border-top:1px solid #f4f4f4;width:100%;" class="footer coreTemplate1 ' + $('#net_109_11_27_23_53_13').attr('class') + '">' + $('#net_109_11_27_23_53_13').html() + '</div>');         

        $(this).remove();    
    }); 

} 

//gavrilovic real footer
//currentTopPos = 0;

if($('#net_110_0_8_17_34_33').attr("id") ){

    $('#realFooter').remove();
    $('body').append('<div id="realFooter" style="' + $('#net_110_0_8_17_34_33').attr('style') + ';min-width:1500px;" class="' + $('#net_110_0_8_17_34_33').attr('class') + '">' + $('#net_110_0_8_17_34_33').html() + '</div>');         
    $('#net_110_0_8_17_34_33').livequery(function(){
        //$(this).css({ top:$('#net_110_0_8_17_34_33').position().top + 200});
        $(this).remove();  
    });    
    

}

	$(document).ready(function(){	
		$(".slider-inner").easySlider();
	});
/*THIS IS FROM default_nebojsa.js- END*/


/*THIS IS FROM default_firstadmin.js- BEGIN*/

/*THIS IS FROM default_firstadmin.js- END*/


/*THIS IS FROM default_admin3.js- BEGIN*/

/*THIS IS FROM default_admin3.js- END*/


/*THIS IS FROM default_admin.js- BEGIN*/

/*THIS IS FROM default_admin.js- END*/


/*THIS IS FROM default_admin2.js- BEGIN*/

/*THIS IS FROM default_admin2.js- END*/


/*THIS IS FROM default_gavrilo.js- BEGIN*/
//CYCLE plugin is loaded by deafult, to change what gets loaded edit main.phtml file in dev-application/layouts/scripts
$('#net_113_5_14_9_55_33 p').livequery( function(){
    $(this).cycle();

});
//ROTATE is not loaded by default, so we can add here plugins than we need               
   // VERSION: 2.2 LAST UPDATE: 13.03.2012
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */
(function(j){for(var d,k=document.getElementsByTagName("head")[0].style,h=["transformProperty","WebkitTransform","OTransform","msTransform","MozTransform"],g=0;g<h.length;g++)void 0!==k[h[g]]&&(d=h[g]);var i="v"=="\v";jQuery.fn.extend({rotate:function(a){if(!(0===this.length||"undefined"==typeof a)){"number"==typeof a&&(a={angle:a});for(var b=[],c=0,f=this.length;c<f;c++){var e=this.get(c);if(!e.Wilq32||!e.Wilq32.PhotoEffect){var d=j.extend(!0,{},a),e=(new Wilq32.PhotoEffect(e,d))._rootObj;
b.push(j(e))}else e.Wilq32.PhotoEffect._handleRotation(a)}return b}},getRotateAngle:function(){for(var a=[],b=0,c=this.length;b<c;b++){var f=this.get(b);f.Wilq32&&f.Wilq32.PhotoEffect&&(a[b]=f.Wilq32.PhotoEffect._angle)}return a},stopRotate:function(){for(var a=0,b=this.length;a<b;a++){var c=this.get(a);c.Wilq32&&c.Wilq32.PhotoEffect&&clearTimeout(c.Wilq32.PhotoEffect._timer)}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=function(){return d?function(a,b){a.Wilq32={PhotoEffect:this};this._img=this._rootObj=
this._eventObj=a;this._handleRotation(b)}:function(a,b){this._img=a;this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};a.parentNode.insertBefore(this._rootObj,a);if(a.complete)this._Loader(b);else{var c=this;jQuery(this._img).bind("load",function(){c._Loader(b)})}}}();Wilq32.PhotoEffect.prototype={_setupParameters:function(a){this._parameters=this._parameters||{};"number"!==typeof this._angle&&(this._angle=0);"number"===
typeof a.angle&&(this._angle=a.angle);this._parameters.animateTo="number"===typeof a.animateTo?a.animateTo:this._angle;this._parameters.step=a.step||this._parameters.step||null;this._parameters.easing=a.easing||this._parameters.easing||function(a,c,f,e,d){return-e*((c=c/d-1)*c*c*c-1)+f};this._parameters.duration=a.duration||this._parameters.duration||1E3;this._parameters.callback=a.callback||this._parameters.callback||function(){};a.bind&&a.bind!=this._parameters.bind&&this._BindEvents(a.bind)},_handleRotation:function(a){this._setupParameters(a);
this._angle==this._parameters.animateTo?this._rotate(this._angle):this._animateStart()},_BindEvents:function(a){if(a&&this._eventObj){if(this._parameters.bind){var b=this._parameters.bind,c;for(c in b)b.hasOwnProperty(c)&&jQuery(this._eventObj).unbind(c,b[c])}this._parameters.bind=a;for(c in a)a.hasOwnProperty(c)&&jQuery(this._eventObj).bind(c,a[c])}},_Loader:function(){return i?function(a){var b=this._img.width,c=this._img.height;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image");
this._vimage.src=this._img.src;this._vimage.style.height=c+"px";this._vimage.style.width=b+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._container=this.createVMLNode("group");this._container.style.width=b;this._container.style.height=c;this._container.style.position="absolute";this._container.setAttribute("coordsize",b-1+","+(c-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position=
"relative";this._rootObj.style.width=b+"px";this._rootObj.style.height=c+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._eventObj=this._rootObj;this._handleRotation(a)}:function(a){this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._width=this._img.width;this._height=this._img.height;this._widthHalf=this._width/2;this._heightHalf=this._height/2;var b=Math.sqrt(this._height*
this._height+this._width*this._width);this._widthAdd=b-this._width;this._heightAdd=b-this._height;this._widthAddHalf=this._widthAdd/2;this._heightAddHalf=this._heightAdd/2;this._img.parentNode.removeChild(this._img);this._aspectW=(parseInt(this._img.style.width,10)||this._width)/this._img.width;this._aspectH=(parseInt(this._img.style.height,10)||this._height)/this._img.height;this._canvas=document.createElement("canvas");this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative";
this._canvas.style.left=-this._widthAddHalf+"px";this._canvas.style.top=-this._heightAddHalf+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._width+"px";this._rootObj.style.height=this._height+"px";this._eventObj=this._canvas;this._cnv=this._canvas.getContext("2d");this._handleRotation(a)}}(),_animateStart:function(){this._timer&&clearTimeout(this._timer);this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()},
_animate:function(){var a=+new Date,b=a-this._animateStartTime>this._parameters.duration;if(b&&!this._parameters.animatedGif)clearTimeout(this._timer);else{(this._canvas||this._vimage||this._img)&&this._rotate(~~(10*this._parameters.easing(0,a-this._animateStartTime,this._animateStartAngle,this._parameters.animateTo-this._animateStartAngle,this._parameters.duration))/10);this._parameters.step&&this._parameters.step(this._angle);var c=this;this._timer=setTimeout(function(){c._animate.call(c)},10)}this._parameters.callback&&
b&&(this._angle=this._parameters.animateTo,this._rotate(this._angle),this._parameters.callback.call(this._rootObj))},_rotate:function(){var a=Math.PI/180;return i?function(a){this._angle=a;this._container.style.rotation=a%360+"deg"}:d?function(a){this._angle=a;this._img.style[d]="rotate("+a%360+"deg)"}:function(b){this._angle=b;b=b%360*a;this._canvas.width=this._width+this._widthAdd;this._canvas.height=this._height+this._heightAdd;this._cnv.translate(this._widthAddHalf,this._heightAddHalf);this._cnv.translate(this._widthHalf,
this._heightHalf);this._cnv.rotate(b);this._cnv.translate(-this._widthHalf,-this._heightHalf);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}()};i&&(Wilq32.PhotoEffect.prototype.createVMLNode=function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{return!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),function(a){return document.createElement("<rvml:"+a+' class="rvml">')}}catch(a){return function(a){return document.createElement("<"+
a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}}())})(jQuery);
//and then call rotate function
$("#net_113_5_14_15_9_11").livequery(function(){
    $(this).rotate(8);	
});
/*THIS IS FROM default_gavrilo.js- END*/


