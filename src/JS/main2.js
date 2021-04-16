//FROM MAIN PHTML
//======================================================================
$(document).ready(function(){
    if($.browser.msie == true ){
        $('body').append('<div id="ie_warn" style="z-index:999999;filter:alpha(opacity=70);position:absolute;top:0;left:0;width:100%;height:30px;background:lightyellow;color:red;font-family:Arial;text-transform:uppercase;"><div style="filter:alpha(opacity=100);padding:10px;width:800px;float:right;">Vi koristite Internet Explorer!   Da biste u potpunosti uživali u internet prezentacijama, preporučujemo Firefox ili Google Chrome!</div></div>');
        $('#ie_warn').click(function(){
            $(this).hide();    
        });    
    }

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
        $(this).html("");
        $(this).css("padding", "0px");
        cornerParam = $(this).attr("cornerstyle");
        if (!cornerParam) {
            cornerParam = "";
        }
            
        $(this).append('<div id="cornerCont_' + i + '"></div>');
        //BG
        $('#cornerCont_' + i).css({background:$(this).css("background")});
        $('#cornerCont_' + i).attr("style", $(this).attr("style") );
        $('#cornerCont_' + i).css({position:"relative", left:"0px", top:"0px"});
        
        backgAttr = $(this).attr("backcolor");
        if (!backgAttr) {
            backgAttr = "#ffffff";
        }
        //alert(backgAttr);
        $(this).css({background:backgAttr ,  margin:"0px", padding:"0px"});
        
        
        
        $('#cornerCont_' + i).append('<div id="cornered_' + i + '"></div>')
        $('#cornerCont_' + i).corner(cornerParam);
        $('#cornered_' + i).html(contentOfThis);
        $('#cornered_' + i).css({ padding:"10px"});
        
        //$(this).corner();
        
        i++;
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
if ($.browser.msie == true && $.browser.version != "8.0"){
    $('.shadowed').each(function(){
        $('#' + $(this).attr("id") ).removeShadow();
    });
    $('.shadowed').dropShadow();
}
$('.shadowed').livequery(function(){
    $(this).dropShadow();
});








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
    if (contentUrl.match("mailto:") == null){//ako nije mailto link  

    if( $(this).attr("class") == "commentsDeleteLink" ){
        //alert($(this).attr("title") );
        $('#commentDiv_' + $(this).attr("rel") ).fadeOut(1500);
        $.post($(this).attr("href"), function(data){
            alert(data);
        });
        
        return false; 
    }

        $('#ajax-loader').fadeIn();
        $('.ajax-loader').fadeIn();
    
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
            $.get(contentUrl, function(data){
                //resizeSite();
                /*
                if(data.output != 'undefined'){
                    $('#content').html(data.output);
                    $('body').css({background:data.bodyBG.replace(/;/, '')});
                } else {
                */
                        
                    $('#content').html(data);
                /*
                }
                */
                //$('#content .draggable:not(".templateDiv")').css({display:"none"});
                //$('#content .draggable:not(".templateDiv")').show(1500);
           
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
        
        }

        
                
        //return false;
        return true;
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
    $(this).css({ top:$('.contentBg').height() + $('.contentBg').position().top, margin:"0"});
    //$(this).css({ top:$(document).height(), margin:"0"});


    //alert($('.contentBg').position().top);
    $(this).show(); 
});
//shadows for the conteiner on the centered template
currentTop =  $('.footer').css("top").replace("px", "");
footerHeight = $('.footer').css("height").replace("px", "");
//alert(currentTop + "-" +  );

//treba videti odakle dolazi ovo -20
$('.centerShadow').livequery(function(){
    $(this).css({height:$(document).height()-20  });//for giving shadows to the divs which are wrapped inside centered template
});

$('.menuObj').livequery(function(){//making the menu div visible by default
    $(this).css({overflow:"visible"});
});





//DEFAULT.JS
$('#net_109_9_1_18_16_14').cycle({fx:'scrollLeft',shuffle:{left:-200, top:-400}, speed:900, timeout:6000, easing: 'bounceout', delay: -4000 });
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
       

