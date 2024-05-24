//FRONTEND.JS
//Js important for all modules and components

//ajax-loader-fix
$('#ajax-loader').livequery(function(){
    $(this).css("background", absoluteUrl + "images/ajax-loader.gif");
});


$('a:not(".lightbox")').livequery('click', function(){
    return true; // lets disable all this for now

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

