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