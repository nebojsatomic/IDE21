// JavaScript for creator
/**
 * CMS-IDE Visual CMS
 *
 * @category   Creator JavaScript
 * @package    CMS-IDE
 *  Copyright (C) 2010-2021  Nebojsa Tomic
 *  
 *  This file is part of CMS-IDE.
 *     
 *  CMS-IDE is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 3 of the License, or (at your option) any later version.
 *
 *  CMS-IDE is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * 
 * 
 */
 jQuery.extend({
    handleError: function( s, xhr, status, e ) {
        // If a local callback was specified, fire it
        if ( s.error )
            s.error( xhr, status, e );
            //alert(xhr.responseText);
        // If we have some XML response text (e.g. from an AJAX call) then log it in the console
        else if(xhr.responseText)
            console.log(xhr.responseText);
            //alert(xhr.responseText);
    }
});
$('.navLinks').click( function(){
    $('.currentTitle').removeClass('currentTitle');
    $(this).addClass('currentTitle');
});
function dialog(){
    //$('#dialogDiv').remove();
    //$('body').append('<div id="dialogDiv"></div>');
    if (screen.width == window.innerWidth && screen.height == window.innerHeight) {
        //full web browser
        isFS = 2;
    } else {
        isFS = 0;
    }
     //if($('.ui-dialog #dialogDiv').length > 0 ){$( "#dialogDiv" ).remove();$('body').append('<div id="dialogDiv"></div>'); }
     $( "#dialogDiv" ).dialog({modal:false, resizable: false, title:$('.currentTitle').text() }); 
}
//tinyMCE INIT
tinyMCE.init({
        // add these two lines for absolute urls
        remove_script_host : false,
        convert_urls : false,
        entity_encoding : "raw",

            mode : "exact",
            elements : "objPropertiesHtmlTiny",
            theme : "advanced",
            //plugins : "safari,spellchecker,style,table,advhr,advimage,advlink,inlinepopups,contextmenu,paste,fullscreen,noneditable,visualchars",
            plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

            theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect",            
            theme_advanced_buttons2 : "pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,fontsizeselect",
            theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup",            
            theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,link,unlink,anchor,image,cleanup",            
            theme_advanced_buttons5 : "visualchars,nonbreaking,template,blockquote,pagebreak,|,insertdate,inserttime,|,forecolor,backcolor,|,charmap,emotions,iespell,media,advhr,|,fullscreen,code",            
            theme_advanced_toolbar_location : "top",            
            theme_advanced_toolbar_align : "left",            
            theme_advanced_statusbar_location : "none",
            
            theme_advanced_resizing : false

        });

        function doLightBox()
        {
                    
        //$('#dialog222').dialog();
                //LB u slideu  mora opet
                $('#manageAllPages').livequery('click', function(){
                    $('.TB_overlayBG').css({zIndex:"999997"});
                    $('#TB_window').css({zIndex:"999999"});
                });
                

                       
       
        }
        //$('body').css( {background:"url(" + absoluteUrl + "images/bgBody.png) no-repeat center" } );

        function saveCSSandJS()
        {
              if(codepressOff == true) {
                  $('#pageCSSC').attr("value", $('#pageCSS').attr("value") );
                  $('#pageJSC').attr("value", $('#pageJS').attr("value") );              
              } else {
                  $('#pageCSSC').attr("value", pageCSS.getCode() );
                  $('#pageJSC').attr("value", pageJS.getCode() );              
              }        
        }

        function ajaxEvent(){
            //$('body').append('<div id="ajaxEventMask"  style="position:fixed;top:0;left:0;background:black;opacity:0.6;z-index:999997;"></div>');
            //$('#ajaxEventMask').css({width:$(document).width(), height:$(document).height()});
            $('#dialogDiv').css({left:$(window).width()/2, top:$(window).height()/4}); 
            //$('#dialogDiv').draggable();       
        }
        message = "";
        function ajaxEventDone(message){
            $('body').append('<div id="ajaxEventMessage"  style="position:fixed;display:none;top:0; left:0;opacity:0.9;background:white;margin:20% 40%;padding:30px;width:300px;height:50px;border-radius:10px;z-index:999999;">' +  message + '<img src="'+ absoluteUrl2 +'images/ajax-loader2.gif" style="float:right;" /></div>');
            $('#ajaxEventMessage').fadeIn(1000);
            setTimeout("$('#ajaxEventMessage').fadeOut()", 2000);
            //$('#ajaxEventMask').fadeOut(2000);
        }
        
        function ajaxEmitMessage(emitMessage){
            $('#ajaxEventMessage').html(  emitMessage + '<img src="'+ absoluteUrl2 +'images/interface/ajaxDone.png" style="float:right;" />');
            setTimeout("$('#ajaxEventMessage').fadeOut()", 1000);
            //$('#ajaxEventMessage').html(  emitMessage );
        }        

        function clickMask(){
            $('#ajaxEventMask').click();
        }
        
            $('#ajaxEventMask').livequery('click', function(){
                $('#ajaxEventMask').fadeOut(1000, function(){
                $(this).remove();
                });
                $('#ajaxEventMessage').fadeOut(1000, function(){
                $(this).remove();
                });                
            });         
        function refreshControls(){
        
                //alert($('#objList').html());
                $('#objListForCss').html($('#objList').html() );//css
                $('#objListForCss').prepend('<option selected="selected"></option>');
                
                $('#objListForJs').html($('#objList').html() );//js
                $('#objListForJs').prepend('<option selected="selected"></option>');

        
        
        }
        function unhideOverflowMenus(){
            
                  $(".draggable").each(function(){
                      
                     if ($(this).attr("objtype") == "Menu"  ){
                          //$(this).html( "{" +$(this).attr("command") + "}");
                          $(this).css("overflow", "visible");
                      
                      }
                  });            
            
        }        
        
        function redrawMenus(){
            
                  $(".draggable").each(function(){
                      //if it is a menu write command
                      
                      
                      if ($(this).attr("objtype") == "Menu"  ){
                          //$(this).html( "{" +$(this).attr("command") + "}");
                          tvId = $(this).attr("id");
                          //alert(tvId);
                          var tvCommand = "{" + $(this).attr("command") + "}";

                          $.post(absoluteUrl + "view/render-tv/var/" + tvCommand  , function(data){
                              $('#' + tvId ).html(data);
                                  
                              //$('#objPropertiesHtml').attr("value", tvCommand );
                              //$('#' + idObjekta).attr("command", tvCommand);

                          });                                            
                      }
                  });            
            
        }
        
        function showConfirm(linkId)
        {
        var r = confirm(lang.AYS);
        if (r == true){
            alert($('#' + linkId).attr("href") );

        } else {
       
        }
        }

        function floatProperties()
        {
            var name = "#contProperties";
	          var menuYloc = null;
	//alert('e');
        	//	$(document).ready(function(){
        			menuYloc = parseInt($(name).css("top").substring(0,$(name).css("top").indexOf("px")));
        			$(window).scroll(function () { 
        				offset = menuYloc+$(document).scrollTop()-100 + "px";
        				//$(name).animate({top:offset},{duration:1500,queue:false});
        				$(name).animate({bottom:offset},{duration:500,queue:false});
        			});
        		//}); 

        }

        /**
         *Function that refreshes table in the 'Manage all pages'
         *
         */                          
        function refreshManageAllPagesTable()
        {
            //idCurrent = $('#paginationControl span.current').html();
            //alert(idCurrent);
            //if(!idCurrent){idCurrent = 1;}
            //idCurrent = 1;
            clicked = 0;
            $('#paginationControl a.pag_a').each(function(){
                if($(this).attr('value') == idCurrent){
                    $(this).click();
                    clicked = 1;
                }
            });

            if(clicked == 0) { $('#manageAllPages').click(); }       
        
        }
        
        function templateReopenAfterLanguage()
        {

                  if($('#templateMask').length < 1){
                      $('body').append('<div id="templateMask"></div>');
                  }
                  
                  
                  $.getJSON(absoluteUrl + "page/apply-template/id/" + $("#templateIDediting").html(), function(data){
                      //alert(data.output);
                      $('#templateMask').empty();

                      $('#templateTitle').attr("value", data.title);//templateName
                      if(data.bodyBg){
                          $('#template_bodyBg').prop("value", data.bodyBg);//template body BG
                          //alert(data.bodyBg);
                          $('body').css({background:data.bodyBg});
                          //$('.body2be').attr("src" , $('#imagePathShow').text() );
                      }
                      if(data.defaultTemplate == "1"){chck = "checked";} else {chck = "";}
                      $('#templateDefaultCB').prop("checked", chck);//templateDefault
                      //$('#templateDefaultCB').closest('span').addClass(chck);
                      
                      $('#templateMask').html(data.output).fadeIn(1500);
                      $('#templateMask').appendTo($('#droppable')).css({left: "0px"}); 
                      $(".templateDiv").each(function(){

                          //$(this).draggable('cancel');//ovo omoguciti - MOZDA  
                      });  
                      
                      $(".draggable").draggable({
                          drag:function() {
                          id = $(this).attr("id");
                          }
                      //containment: 'parent' 
                      });

                  
                      $('#objList').html("");
                      $('.draggable').each(function(){
                          $(this).removeClass("inactiveObject");
                          $('#objList').append('<option>' + $(this).attr("id") + '</option>');
                      });
                  
                      refreshControls();
                      ajaxEmitMessage(lang.Done);
                      setTimeout("$('#ajaxEventMask').click()", 1000);
                  });          
        
        
        }
        //body streching depending on the temlate, -moz-background-size
        function bodyStrech()
        {
          $("body").css("-moz-background-size" , "100%");
          $("body").css("-webkit-background-size" , "100%");
          $("body").css("-o-background-size" , "100%");
          $("body").css("background-size" , "100%"); 
          //alert('j');    
        }
       // and the oposite, enabling the body bg repeat
        function removeBodyStrech()
        {
          $("body").css("-moz-background-size" , "");
          $("body").css("-webkit-background-size" , "");
          $("body").css("-o-background-size" , "");
          $("body").css("background-size" , "");     
        }
        /*get cookie values*/
        function getCookie(c_name)
        {
          var i,x,y,ARRcookies=document.cookie.split(";");
          for (i=0;i<ARRcookies.length;i++)
          {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name)
              {
              return unescape(y);
              }
            }
        } 

        function loadTemplate(idT){
$('#templateMask').remove();
                  if($('#templateMask').length < 1){
                      $('body').append('<div id="templateMask"></div>');
                  }
                  $('#templateMask').empty();
//alert($('#templateMask').length );
                  templSel = idT;
                  
                  $.getJSON(absoluteUrl + "page/apply-template/id/" + templSel, function(data){
                      //alert(data.bodyBg);
                      $('#templateMask').empty();

                      $('#templateTitle').attr("value", data.title);//templateName
                      if(data.bodyBg){
                          $('#template_bodyBg').prop("value", data.bodyBg);//template body BG
                         
                          bg = data.bodyBg.replace(/;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;/g, "");
                         // bg = data.bodyBg.replace(/; fixed;
                         splBG = bg.split(';');
                         $(splBG).each(function(k,v){
                            splRule = v.split(':');
                            if(splRule[1]){
                              //alert(splRule[0] + ':' + splRule[1]);
                              $('body').css(splRule[0], splRule[1]);
                            }
                            if(k == 0) {$('body').css("background" , v);}
                            
                         })
                          //$('body').css({background:bg}); 
                          //alert(bg);
                          if(data.bodyBg.match(/-moz-background-size:100%/g) ){
                            bodyStrech();
                          } else {
                            removeBodyStrech();
                          }
                          
                          //$('#template_bodyBg').change();
                          //alert(data.bodyBg);
                      }
                      if(data.defaultTemplate == "1"){chck = "checked";} else {chck = "";}
                      $('#templateDefaultCB').prop("checked", chck);//templateDefault
                      //$('#templateDefaultCB').closest('span').addClass(chck);
                      
                      $('#templateMask').html(data.output).fadeIn(1500);
                      $('#templateMask').appendTo($('#droppable')).css({left: "0px"}); 
                      $(".templateDiv").each(function(){

                          //$(this).draggable('cancel');//ovo omoguciti - MOZDA  
                      });  
                      
                      $(".draggable").draggable({
                          drag:function() {
                          id = $(this).attr("id");
                          }
                      //containment: 'parent' 
                      });

                  
                      $('#objList').html("");
                      $('.draggable').each(function(){
                          $(this).removeClass("inactiveObject");
                          $('#objList').append('<option>' + $(this).attr("id") + '</option>');
                      });
                  
                      refreshControls();
                      ajaxEmitMessage(lang.Done);
                      setTimeout("$('#ajaxEventMask').click()", 1000);
                      //document.cookie = 'templateSelectedId=' + templSel + ';  path=/';  
                  });
                
             // ajaxEventDone(lang.TOpen);//sklanjanje maska                           
              $('#templateIDediting').html(idT);
              document.cookie = 'templateSelectedId=' + idT + ';  path=/'; //ovo treba namestiti 
             // $('#dialogDiv').hide('slow').remove();//ovo je za removovanje dijaloga MUST
            //alert($('#template_bodyBg').attr("value"));
            //$('body').css({background:$('#template_bodyBg').attr("value") }); 
      }      

        function loadPage(idP){
                  $('#templateMask').empty();
                  $('#droppable').empty();
                  //update data on the interface                 
                  //getting output for the loaded page
                  //pageTitle = $('#' + $(this).attr("id") + " option:selected").attr("label") ;
                  //pgId = $('#' + $(this).attr("id") + " option:selected").attr("value");
                  //alert(pgId)
                  $('#pgID').html(idP);         
                  //$('#pageTitle').prop("value", pageTitle);
                  
                  $.getJSON(absoluteUrl + "page/open/id/" + idP, function(data){
                      //alert(data.category);
                      //jsin = eval("(" + data + ")" );
                      //alert(jsin.output);
                      $('#categoryNameAssign').prop("value" , data.category);
                      //alert()
                      $('#categoryNameAssign').prev('span').text($('#categoryNameAssign').find(":selected").text() );
                      
                      $('#pageImage').prop("value" , data.image);
                      $('#pageDescription').prop("value" , data.description);
                      $('#pageKeywords').prop("value" , data.keywords);
                      $('#templateID').html(data.template_id);
                      $('#templateChanger').prop("value" , data.template_id);
                      $('#templateChanger').prev('span').text($('#templateChanger').find(":selected").text() );
                      $('#pageTitle').prop("value", data.pageTitle);
                      //alert('ej' + data.pageTitle);

                      $('#allowedRolesDiv').html( data.rolesAllowed );
                      //CHECK ACCESS setting
                      if(data.check_access == 1){
                          $('#restrictiveCB').prop('checked','checked' );
                         // $('#restrictiveCB').closest('span').addClass('checked');
                          $('#openPagePermisions').show();
                      } else {
                          $('#restrictiveCB').prop('checked','' );
                          $('#openPagePermisions').hide();
                      }
//alert(data.unbounded );
                      //BOUNDED TO CONTENT AREA setting
                      if(data.unbounded == 0){//if should be inside content area only
                      
                          $('#boundCB').prop('checked','checked' );
                          $('#boundCB').closest('span').addClass('checked');
                      } else {//if absolutely positioned on the page
                          $('#boundCB').prop('checked','' );
                          $('#boundCB').closest('span').removeClass('checked');
                      }
                                            
                      $('#droppable').css("display", "none");
                      $('#droppable').html(data.output).fadeIn();
                      $(".draggable").draggable({
                          drag:function() {
                          id = $(this).attr("id");
                          },
                      containment: 'parent' 
                      });
                      
                      $('#objList').html("");
                      $('.draggable').each(function(){
                          $(this).removeClass("inactiveObject");
                          $('#objList').append('<option>' + $(this).attr("id") + '</option>');
                      });
                  
                  //redrawMenus();
                  refreshControls();
                  //ajaxEmitMessage(lang.PageOpened);
                  //setTimeout("$('#ajaxEventMask').click()", 1000);
                  });
              //ajaxEventDone(lang.POpen);//sklanjanje maska
              //$('#dialogDiv').hide('slow').remove();//ovo je za removovanje dijaloga MUST
              document.cookie = 'pageSelectedId=' + idP + ';  path=/'; //ovo treba namestiti 
      }      




$(document).ready(function(){
    //idCurrent = 1;
    drOff = $('#droppable').position().left;//variabla potrebna za strelicu i pero
     
        
    if(getCookie("enableHelp") == "0"){
        $('#helpDiv').show();
    } else {
        $('#helpDiv').hide();
    }
    
    $('#droppable').resizable({autohide:true});
    $('#templateMask').css({left:$('#droppable').offset().left + "px"});
         
        //when clickin on a link that starts an ajax action
        $('.navLinks:not(".noAjaxEvent")').livequery('click', function(){
            if($(this).hasClass("a_delete") == true){
                return;
            }
            //deleteLink = 
            if($(this).attr("id") != "pageDisplayer" && $(this).attr("id") != "templateDisplayer"){
                ajaxEvent();
            }
        });                
        
        $('#dialogDiv').css({left:$(window).width()/2, top:$(window).height()/2});   

        //after clickin submit button in a dialog, emit the working message
        $('input[type=submit]').livequery('click', function(){
            ajaxEvent();
            ajaxEventDone(lang.Working);//showing the message        

        });        

        
        //CLICK NA UPDATE FROM TINYMCE
        $('#tinySave').click(function(){                      
            var ed = tinyMCE.get('objPropertiesHtmlTiny');
            newContent = tinyMCE.get('objPropertiesHtmlTiny').getContent();
            $('#' + $('#objIDshow').html() + ' p.objContent').each(function(){
                //alert($(this).attr("id") );
                $(this).remove();
            });
            
            $('#' + $('#objIDshow').html() ).resizable('destroy');//stop resizable        
            //OVO$('#' + $('#objIDshow').html()).prepend('<p class="objContent">' + newContent + '</p>' + "\n\n\n");
            $('#' + $('#objIDshow').html()).html(newContent + "\n\n\n");//update html of the object
    
            $('#' + $('#objIDshow').html() ).dblclick();
            //$('#' + $('#objIDshow').html() + ' p.objContent:first').remove();//brisanje ovog prvog koji se pojavljuje niotkuda
            //$('#' + $('#objIDshow').html() ).dblclick();
            //alert(tinyMCE.get('objPropertiesHtmlTiny').getContent());
    
            $('#' + $('#objIDshow').html() ).resizable({autohide:true});//resizable again
        });        
        
        //floatProperties();//veoma iritirajuce

        $('#saveCssCodeA').click(function(){
            //alert('1');
            $('#saveThisPage').click();
            // alert('2');
        });

        $('#saveJsCodeA').click(function(){
            $('#saveThisPage').click();
        });

        $('#previewButton').click(function(){
            $(this).attr("href", absoluteUrl + "pages/" + $('#pgID').html());
        
        });
        
        //FONT BIGGER
        $('#fontBigger').click(function(){
           fSize =  $( '#' + $('#objProperties').attr("objId") ).css("font-size").replace(/px/, '');
           fSize++;
           //alert(fSize);
           $('#' + $('#objProperties').attr("objId")).css( {fontSize:fSize} );
           $('#' + $('#objIDshow').html() ).css( {fontSize:fSize} );
            
        });
        //FONT SMALLER
        $('#fontSmaller').click(function(){
           fSize =  $( '#' + $('#objProperties').attr("objId") ).css("font-size").replace(/px/, '');
           fSize--;
           //alert(fSize);
           $('#' + $('#objProperties').attr("objId")).css( {fontSize:fSize} ); 
        });
        
        
        //ID ASSISTANT displayed
        tooltipShow = 0;
        $('.draggable').livequery('mouseover', function(e){
            if (tooltipShow == 1) {
                $('#tooltip').html($(this).attr("id") );
                $('#tooltip').css({top:e.pageY, left:e.pageX});
                $('#tooltip').show();
            } else {
                $('#tooltip').hide();
            }

        
        });
          
          //TURN ID ASSISTANT on/off
          $('#tttoggle').livequery('click', function(){
              //alert($(this).attr("checked") );
              if ($(this).prop("checked") == true) {
                  tooltipShow = 1;
                  //$(this).closest('span').addClass('checked');
              } else {
                  tooltipShow = 0;
                  $('#tooltip').hide();
              }
              
              //$('#tooltip').toggle();
              
          });

          //CONTAINER
          objContainer = 0;
          $('#objContainer').livequery('click', function(){
              //alert($(this).attr("checked") );
              if ($(this).prop("checked") == true) {
                  objContainer = 1;
                 //$(this).closest('span').addClass('checked');
              } else {
                  objContainer = 0;
                  
              }
              
              
          });

          //TURN APPLY TO ALL LANGUAGES ON/OFF
          $('#allLangCheck').livequery('click', function(){
              //alert($(this).attr("checked") );
              if ($(this).prop("checked") == true) {
                  applytoAllLangs = "yes";
                  //$(this).closest('span').addClass('checked');
              } else {
                  applytoAllLangs = "no";
              }
              //alert(applytoAllLangs );
              //$('#tooltip').toggle();
              
          });

          //TURN APPLY TO ALL LANGUAGES ON/OFF FOR TEMPLATES
          $('#allLangCheckTemplate').livequery('click', function(){
              //alert($(this).attr("checked") );
              if ($(this).prop("checked") == true) {
                  applytoAllLangsTemplate = "yes";
              } else {
                  applytoAllLangsTemplate = "no";
              }
              
              //$('#tooltip').toggle();
              
          });
          
          $('#redraw').livequery('click', function(){
              redrawMenus();
              
          });
          newIt = 1;
          pageID ="<?php echo $this->pageId;?>";
          //alert(pageID);
          selMenuTemplate = "";
          idForRem = "";
          zIndexCounter = 500;//ovo je da bi se odvojilo od templatea
          //$("#accordion").accordion({ fillSpace: true });

          $('#rotate').tabs();
          

            
          //$('#toggleProperties').dropShadow({left: 2, top: 2, blur: 1});
          //$('#rotate').dropShadow();
          $('#poA').click();
            

          propPos = "visible" ; 
          $('#propertiesLeft').fadeOut(4000);
          $('#contProperties').css({width:"auto", right:"0px", bottom:"0px"});
          $('#toggleProperties').livequery('click', function(){
              //$('#properties').toggle("slow");
              
              if(propPos == "hidden") {
                  $('#properties').animate({marginRight:0 });
                  $('#properties').fadeIn(1500);
                  propPos = "visible" ;                 
              } else {
                  $('#properties').fadeOut(1500);
                  $('#properties').animate({marginRight:-($('#properties').width()-5 )}); 
                  propPos = "hidden" ;            
              }

              
              
          });
                           
          //DRAGGABLES
          $(".draggable").draggable({
              drag:function() {
                 //$(this).clone(); 
                  id = $(this).prop("id");
                  //alert(id);
              },
                  containment: 'parent' 
          });
          $(".draggable").each(function(){
              $('#' +$(this).attr("id") ).resizable();
          });
          $("#droppable").droppable({
            drop: function() {
                    $('#objList').attr("value", $('#' + id).attr("id"));
                    //$('#objList option:contains("'+ idObjekta +'")').remove();
                    //alert( id );
                    if(id == 'pageJS') {return;}
                    topPositionObj = $('#' + id).position().top;
                    leftPositionObj = $('#' + id).position().left;
                    absPosTop = topPositionObj - ($(this).position().top);
                    absPosLeft = leftPositionObj - ($(this).position().left);
                    
                    drOff = $('#droppable').position().left;
                    topPositionObj = $('#' + id).offset().top;
                    leftPositionObj = $('#' + id).offset().left ;
                    absPosTop = topPositionObj - ($(this).offset().top);
                    absPosLeft = leftPositionObj - ($(this).offset().left );
                
                    //handle pen movement after drop
                    //lefT = $(this).position().left;
                    //toP = $(this).position().top;
                    
                    if(id == $('#objProperties').attr("objId") ){
                      $('#penPointer').css({left:absPosLeft + drOff,top: absPosTop-40}).fadeIn();                
                    }
                    if(absPosTop < 0 || absPosLeft < 0){
                        idForRem = $('#' + id).attr("id");
                    }
                    //alert(absPosTop + ";" + absPosLeft);
                    //alert( id + ":" + (topPositionObj - ($(this).position().top)) + " "  + (leftPositionObj - ($(this).position().left)) );
                    $('#' + id).dblclick();
                    //$('#droppable').css("height", "auto");
                    
                    $('#droppable').css("min-width", $("#bodyWidth").attr("value") );
                    $('#droppable').css("min-height", $("#bodyHeight").attr("value") );
                 
             }
           
          });
          
          $('#poA').click(function(){
              aaa = 0;
          });
          //toggle visibility for the textareas with tinymce, html and style for the object
          $('#toggleVisibilityRowAnchor').click(function(){
              $('#toggleVisibilityRow').toggle();
              /*
              if ($('#toggleVisibilityRow').css("display", "block")){
                  $('#contProperties').css({position:"absolute",bottom:"150px"});
              } else {
                  $('#contProperties').css({position:"fixed",bottom:"0px"});              
              }
              */
              
          });
         
          $('#objList').livequery('click', function(){
              //alert($(this).attr("value"));
              $('#' + $(this).attr("value") ).dblclick();
          });
          //MOVING AROUND PROPERTIES BOX
          $("#rightB").click(function(){
            $("#contProperties").animate({"right": "-=100px"}, "slow");
          });
          
          $("#leftB").click(function(){
            $("#contProperties").animate({"right": "+=100px"}, "slow");
          });
          $("#upB").click(function(){
            $("#contProperties").animate({"top": "-=100px"}, "slow");
          });
          
          $("#downB").click(function(){
            $("#contProperties").animate({"top": "+=100px"}, "slow");
          });
          
          //CREATING NEW OBJECT!
          $('#newItem').livequery('click', function(){
              var now = new Date();
              var hour        = now.getHours();
              var minute      = now.getMinutes();
              var second      = now.getSeconds();
              var monthnumber = now.getMonth();
              var monthday    = now.getDate();
              var year        = now.getYear();

              newObjId = year + "_" + monthnumber+"_" + monthday+"_"+hour+"_"+ minute+"_" + second;
              //alert(newObjId);
              //IF CONTAINER ON, THEN APPEND IN THE CURRENT OBJECT, ELSE in droppable
              if (objContainer == 1) {
                  droppableContainer = '#' + $('#objIDshow').html();
              } else {
                  droppableContainer = "#droppable";
              }
              
              $(droppableContainer).append("\n" + '<div class="draggable" id="net_'+newObjId+'" style="position:absolute;border:1px dotted red;z-index:' + zIndexCounter + '">' + "\n\t" + '<p class="objContent">NeT.Object ' + newObjId + "\n\t" + '</p>' + "\n" + '</div>'+ "\n");

              //IF CONTAINER ON, THEN ADD class IN THE CURRENT OBJECT, ELSE the same
              if (objContainer == 1) {
                  $(droppableContainer ).addClass("container");
              } else {}

              $('#objList').append('<option>net_' + newObjId + '</option>');
              $('#net_' + newObjId  ).resizable({
                   autoHide: true, 
                   handles: 'all', 
                   stop: function() {
                      $( '#' + $(this).attr("id") ).dblclick();
                   }
              });
              
              //$('#new_' + newIt).draggable();
          
          
              $(".draggable").draggable({
                  drag:function() {
                     //$(this).clone(); 
                      id = $(this).attr("id");
                  },
                  containment: 'parent' 
              });
              
              
              refreshControls();
              $('#net_' + newObjId  ).dblclick();
              newIt++;
              zIndexCounter++;
              //alert($('#droppable').html());
              
              return false;
          });        

          //CREATING CLONE OBJECTS!
          $('#cloneItem').livequery('click', function(){
              var now = new Date();
              var hour        = now.getHours();
              var minute      = now.getMinutes();
              var second      = now.getSeconds();
              var monthnumber = now.getMonth();
              var monthday    = now.getDate();
              var year        = now.getYear();

              newObjId = year + "_" + monthnumber+"_" + monthday+"_"+hour+"_"+ minute+"_" + second;
              //alert(newObjId);
              //IF CONTAINER ON, THEN APPEND IN THE CURRENT OBJECT, ELSE in droppable
              if (objContainer == 1) {
                  droppableContainer = '#' + $('#objIDshow').html();
              } else {
                  droppableContainer = "#droppable";
              }
              
              $(droppableContainer).append("\n" + '<div class="draggable ' + $('#' + $('#objIDshow').html() ).attr('class') + '" id="net_'+newObjId+'" style="z-index:' + zIndexCounter + $('#' + $('#objIDshow').html() ).attr('style') + ';">' + $('#' + $('#objIDshow').html() ).html() + "\n" + '</div>'+ "\n");

              //IF CONTAINER ON, THEN ADD class IN THE CURRENT OBJECT, ELSE the same
              if (objContainer == 1) {
                  $(droppableContainer ).addClass("container");
              } else {}

              $('#objList').append('<option>net_' + newObjId + '</option>');
              
              $('#net_' + newObjId  ).resizable({
                   autoHide: true, 
                   handles: 'all', 
                   stop: function() {
                      $( '#' + $(this).attr("id") ).dblclick();
                   }
              });
              
              //$('#new_' + newIt).draggable();
          
          
              $(".draggable").draggable({
                  drag:function() {
                     //$(this).clone(); 
                      id = $(this).attr("id");
                  },
                  containment: 'parent' 
              });
              
              
              refreshControls();
              $('#net_' + newObjId  ).css({left:$('#net_' + newObjId  ).position().left + 5, top:$('#net_' + newObjId  ).position().top +5 });
              $('#net_' + newObjId  ).resizable('destroy');
              $('#net_' + newObjId  ).dblclick();
              newIt++;
              zIndexCounter++;
              //alert($('#droppable').html());
              
              return false;
          });
          
          $('.navLinks').livequery('click', function(){

              return false;
          }); 
          
          
          //Saving a new page
          $('#savePageNew').click(function(){
              boundCBval = $('#boundCB').val();
              //alert($('#boundCB').val());
              if(boundCBval == 'on') {
                  firstObjVal = $('#objList option:first').val();
                  //alert($('#objList option:first').val() );
                  $('#' + firstObjVal).css("position", "relative");
                  $('#' + firstObjVal).css("min-height", $('#' + firstObjVal).height() + "px" );
                  $('#' + firstObjVal).css("height", "auto");
              }
              $(".draggable").each(function(){
                  $(this).removeClass("inactiveObject");
                  $(this).css("border", "0");
                  $(this).resizable('destroy');
                  
                  //if it is a menu write command
                  if ($(this).attr("objtype") == "Menu"){
                      $(this).addClass("menuObj");
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }
                  if ($(this).attr("objtype") == "Category"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }

              });
              $('#droppable').resizable('destroy');
              strCodeP =  $('#droppable').html();
              $('#droppable').resizable({autohide: true});                         
              //mozilla crap
              strCodeP = strCodeP.replace(/(-moz-background-clip:)\s(border;)/g, '');
              strCodeP = strCodeP.replace(/(-moz-background-origin:)\s(padding;)/g, '');
              strCodeP = strCodeP.replace(/(-moz-background-inline-policy:)\s(continuous;)/g, '');//mozilla crap till here
              //alert(strCodeP);  
              $('#pageCodeHtml').attr( "value", strCodeP );              
              //$('#pageCodeHtml').attr( "value", $('#droppable').html() );
              
              //description and keywords
              $('#pageDESC').attr("value", $('#pageDescription').attr("value") );
              $('#pageKEYWORDS').attr("value", $('#pageKeywords').attr("value") );
              
              $('#pageTitleC').attr("value", $('#pageTitle').attr("value") );
              $('#pageCategoryC').attr("value", $('#categoryNameAssign').attr("value") );
              
              saveCSSandJS();
              
              //alert($('#pageCodeHtml').attr("value"));
              $('#pageCode').attr("action", absoluteUrl + "page/save/"  );
              $('#pageCode').ajaxSubmit(function(){
                  //alert("Page is saved");
                  ajaxEmitMessage(lang.Done);
                  setTimeout("$('#ajaxEventMask').click()", 1000);  
                  //redrawMenus();
              });
              ajaxEventDone(lang.PUpdate);//sklanjanje maska               
              
          });
          
          applytoAllLangs = "no";
          applytoAllLangsTemplate = "no";
          //UPDATING A PAGE
          $('#saveThisPage').click(function(){
         
              boundCBval = $('#boundCB').val();
              //alert($('#boundCB').val());
              if(boundCBval == 'on') {
                  firstObjVal = $('#objList option:first').val();
                  //alert($('#objList option:first').val() );
                  $('#' + firstObjVal).css("position", "relative");
                  $('#' + firstObjVal).css("min-height", $('#' + firstObjVal).height() + "px" );
                  $('#' + firstObjVal).css("height", "auto");
              }
               
              $(".draggable").each(function(){
                  $(this).css("border", "0");
                  $(this).removeClass("inactiveObject");
                  //$(this).resizable('destroy');
                  //$(".draggable").resizable('destroy');
                  
                  //if it is a menu write command
                  if ($(this).attr("objtype") == "Menu"){
                      $(this).addClass("menuObj");
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }
                  if ($(this).attr("objtype") == "Category"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }

                  if ($(this).attr("objtype") == "Image"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }
                  
              });

              //removing embed code for making the document xhtml valid
              $('embed').each(function(){                  
                  $(this).closest("object").attr("type", $(this).attr("type") ) ;
                  $(this).closest("object").attr("data", $(this).attr("src") ) ;
                  $(this).closest("object").attr("classid", "") ;
                  $(this).closest("object").attr("codebase", "") ;
                  
                  $(this).closest("object").append('<param name="wmode" value="transparent" />');
                  $(this).closest("object").append('<param name="movie" value="' + $(this).attr("src") + '"  />') ;
                  //alert( $(this).closest("object").attr("width" ) );
              });
              $('embed').each(function(){
                  $(this).remove(); 
              });             
              
              //$('#pageCodeHtml').attr( "value", '<div id="templateMask">' + $('#templateMask').html() + '</div>' + $('#droppable').html() );
              //$('#droppable').resizable();
              $('#droppable').resizable('destroy');//OVO JE RANIJE RADILO, pre jquery 1.9, prveriti da ne pravi problem na drugom mestu
              strCodeP =  $('#droppable').html();
              $('#droppable').resizable({autohide: true});                           
              //mozilla crap
              strCodeP = strCodeP.replace(/(-moz-background-clip:)\s(border;)/g, '');
              strCodeP = strCodeP.replace(/(-moz-background-origin:)\s(padding;)/g, '');
              strCodeP = strCodeP.replace(/(-moz-background-inline-policy:)\s(continuous;)/g, '');//moailla crap till here
              //alert(strCodeP);  
              $('#pageCodeHtml').attr( "value", strCodeP );
              //description and keywords
              $('#pageDESC').attr("value", $('#pageDescription').attr("value") );
              $('#pageKEYWORDS').attr("value", $('#pageKeywords').attr("value") );
              
              $('#pageImageC').attr("value", $('#pageImage').attr("value") );
              console.log($('#pageTitle').attr("value") );
              $('#pageTitleC').attr("value", $('#pageTitle').attr("value") );
              $('#pageCategoryC').attr("value", $('#categoryNameAssign').attr("value") );
              
              //saveCSSandJS();
              
              /*THIS WAS BEFORE CODEPRESS
              $('#pageCSSC').attr("value", $('#pageCSS').attr("value") );
              $('#pageJSC').attr("value", $('#pageJS').attr("value") );
              */
              
              $('#pageCode').attr("action", absoluteUrl + "page/update/pageId/" + $('#pgID').html() + "/applytoall/" + applytoAllLangs );
              $('#pageCode').ajaxSubmit(function(data){
                  //alert("Page is updated!");
                  alert(data);
                  ajaxEmitMessage(lang.Done);
                  setTimeout("$('#ajaxEventMask').click()", 1000);
                  //redrawMenus();
                  if(selMenuTemplate) {  
                                 // var tvCommand = "menu:display:" + selMenuTemplate + displayTypeMenu ;
                                  
                                  //$.post(absoluteUrl + "view/render-tv/var/" + "{" + tvCommand + "}", function(data){
                                 //     $('#' + idObjekta).html(data);
                                      
                                  //    $('#objPropertiesHtml').attr("value","{"+ tvCommand + "}");
                                  //    $('#' + idObjekta).attr("command", tvCommand);
    
                                 // });
                }              
              });
              ajaxEventDone(lang.PUpdate);//sklanjanje maska     
              return;         
          });         
       
          //Opening page
          $('#openPage').livequery('click', function(){
//$(this).fancybox();
//return;
              $('#openPageForm').remove();
              $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv"></div>');
              //$('#dialogDiv').draggable(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              dialog(); 
              
              $.get(absoluteUrl + "page/choose-page/", function(data){
                  //alert(data);
                  
                  $('#dialogDiv').html( data);
                   /*
                    $.fancybox({
                        content:data,  parent : "body", 
                        wrapCSS:'fbox', padding:0,  
                        autoCenter :true, autoSize:false ,
                        height:'355px', width: '530px', topRatio :0.5,  index:99999,
                        helpers: {overlay : { closeClick : false }  }
                        }) ;
                        */
                  
              });
              $('#ajaxEventMask').remove();
              //$('#dialogDiv').show('slow');

              //onchange combo for page handling
              $('#pageName').livequery('change', function(){
                  $('#templateMask').empty();
                  $('#droppable').empty();
                  //update data on the interface                 
                  //getting output for the loaded page
                  pageTitle = $('#' + $(this).attr("id") + " option:selected").attr("label") ;
                  pgId = $('#' + $(this).attr("id") + " option:selected").attr("value");
                  //alert(pgId)
                  $('#pgID').html(pgId);         
                  $('#pageTitle').prop("value", pageTitle);
                  
                  $.getJSON(absoluteUrl + "page/open/id/" + $(this).attr("value"), function(data){
                      //alert(data.category);
                      //jsin = eval("(" + data + ")" );
                      //alert(jsin.output);
                      $('#categoryNameAssign').prop("value" , data.category);
                      $('#categoryNameAssign').prev('span').text($('#categoryNameAssign').find(":selected").text() );

                      $('#pageImage').prop("value" , data.image);
                      $('#pageDescription').prop("value" , data.description);
                      $('#pageKeywords').prop("value" , data.keywords);
                      $('#templateID').html(data.template_id);
                      $('#templateChanger').prop("value" , data.template_id);
                      $('#templateChanger').prev('span').text($('#templateChanger').find(":selected").text() );
                      
                      // alert('ej2' + data.pageTitle);

                      $('#allowedRolesDiv').html( data.rolesAllowed );
                      //CHECK ACCESS setting
                      if(data.check_access == 1){
                          $('#restrictiveCB').prop('checked','checked' );
                          $('#openPagePermisions').show();
                      } else {
                          $('#restrictiveCB').prop('checked','' );
                          $('#openPagePermisions').hide();
                      }

                      //BOUNDED TO CONTENT AREA setting
                      if(data.unbounded == 0){//if should be inside content area only
                          $('#boundCB').prop('checked','checked' );
                           $('#boundCB').closest('span').addClass('checked');
                      } else {//if absolutely positioned on the page
                          $('#boundCB').prop('checked','' );
                           $('#boundCB').closest('span').removeClass('checked');
                      }
                                            
                      $('#droppable').css("display", "none");
                      $('#droppable').html(data.output).fadeIn();
                      $(".draggable").draggable({
                          drag:function() {
                          id = $(this).attr("id");
                          },
                      containment: 'parent' 
                      });
                      
                      $('#objList').html("");
                      $('.draggable').each(function(){
                          $(this).removeClass("inactiveObject");
                          $('#objList').append('<option>' + $(this).attr("id") + '</option>');
                      });
                  
                  //redrawMenus();
                  refreshControls();
                  ajaxEmitMessage(lang.PageOpened);
                  setTimeout("$('#ajaxEventMask').click();$('#ajaxEventMessage').remove();", 1000);
                  });
              ajaxEventDone(lang.POpen);//sklanjanje maska
              $('#dialogDiv').hide('slow').remove();//ovo je za removovanje dijaloga MUST
              document.cookie = 'pageSelectedId=' +  pgId + ';  path=/'; //ovo treba namestiti 
              });
              
              //refreshControls();    
          });          
          
          $('#closeDialogDiv').livequery('click',function(){
             $('#dialogDiv').hide('slow').remove();
             $('#ajaxEventMask').click();
          });
          
         
          //Saving a NEW template TREBA DORADJIVATI JOS
          $('#saveAsTemplate').click(function(){
              $(".draggable").each(function(){
                  $(this).css("border", "0");
                  $(this).resizable('destroy');
                  $(this).removeClass("inactiveObject");
                  $(this).addClass("templateDiv");
                  //if it is a menu write command
                  if ($(this).attr("objtype") == "Menu"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }
                  if ($(this).attr("objtype") == "Category"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }

              });
              $('#droppable').resizable('destroy'); 
              $('#templateMask').appendTo($('body'));  
              strCodeT =  $('#templateMask').html() + $('#droppable').html();
              $('#droppable').resizable({autohide: true});
              $('#templateMask').appendTo($('#droppable')).css({left: "0px"}); 
                                        
              //mozilla crap
              strCodeT = strCodeT.replace(/(-moz-background-clip:)\s(border;)/g, '');
              strCodeT = strCodeT.replace(/(-moz-background-origin:)\s(padding;)/g, '');
              strCodeT = strCodeT.replace(/(-moz-background-inline-policy:)\s(continuous;)/g, '');//moailla crap till here
             
              //bodyBg is an artificial body background , should be inserted in the template
              //bodyBg = '<div id="bodyBack" style="position:' + $('#bodyBack').css("position") + '; display: block; width: 100%; height: 100%;top:0;left:0;">' + $('#bodyBack').html() + '</div>';
              $('#templateCodeHtml').attr( "value",  strCodeT );//kod templatea

              $('#templateTitleC').attr("value", $('#templateTitle').attr("value") );//name templatea
              $('#templateBodyBgC').attr("value", $('#template_bodyBg').attr("value") );//body BG templatea

              //alert($('#droppable').html());
              $('#templateCode').attr("action", absoluteUrl + "page/save-as-template");
              $('#templateCode').ajaxSubmit(function(){
                  //alert("Template is saved");
                  ajaxEmitMessage(lang.Done);
                  setTimeout("$('#ajaxEventMask').click()", 1000);                  
              });
              ajaxEventDone('Saving template...');//sklanjanje maska                             
          }); 

          //Saving a template TREBA DORADJIVATI JOS
          $('#saveThisTemplate').click(function(){
              
              $(".draggable:not('.templateDiv')").each(function(){
                  $(this).css("border", "0");
                  
                  $(this).removeClass("inactiveObject");
                  $(this).addClass("templateDiv");
              });
              
              $(".draggable").each(function(){
                  $(this).removeClass("inactiveObject");
                  $(this).resizable('destroy');
                  //if it is a menu write command
                  if ($(this).attr("objtype") == "Menu"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }
                  if ($(this).attr("objtype") == "Category"){
                      $(this).html( "{" +$(this).attr("command") + "}");
                      //$(this).attr("command", "");
                  }
              });
              
              //$('.ui-resizable-handle').remove();
              $('#droppable').resizable('destroy');
              $('#templateMask').appendTo($('body'));   
              strCodeT =  $('#templateMask').html() + $('#droppable').html();
              $('#droppable').resizable({autohide: true});
              $('#templateMask').appendTo($('#droppable')).css({left: "0px"});  
                                        
              //mozilla crap
              strCodeT = strCodeT.replace(/(-moz-background-clip:)\s(border;)/g, '');
              strCodeT = strCodeT.replace(/(-moz-background-origin:)\s(padding;)/g, '');
              strCodeT = strCodeT.replace(/(-moz-background-inline-policy:)\s(continuous;)/g, '');//moailla crap till here

              //bodyBg is an artificial body background , should be inserted in the template
              //bodyBg = '<div id="bodyBack" style="position:' + $('#bodyBack').css("position") + '; display: block; width: 100%; height: 100%;top:0;left:0;">' + $('#bodyBack').html() + '</div>';
              $('#templateCodeHtml').attr( "value",  strCodeT );//kod templatea

              $('#templateTitleC').attr("value", $('#templateTitle').attr("value") );//name templatea
              $('#templateBodyBgC').attr("value", $('#template_bodyBg').attr("value") );//body BG templatea
              $('#templateDefaultC').attr("value", $('#templateDefaultCB').prop("checked") );//template default
              
              //$('#pageTitleC').attr("value", $('#pageTitle').attr("value") );
              //$('#pageCategoryC').attr("value", $('#categoryNameAssign').attr("value") );              
              
              //alert($('#templateMask').html() + $('#droppable').html() );
              $('#templateCode').attr("action", absoluteUrl + "page/update-template/templateId/" + $('#templateIDediting').html() + "/applytoall/" + applytoAllLangsTemplate );
              $('#templateCode').ajaxSubmit(function(){
                  //alert("Template is saved");
                   $('#ajaxEventMask').click();  
              });                                   
              ajaxEventDone(lang.TUpdate);//sklanjanje maska  
          }); 


          //Applying a template
          $('#applyTemplate').click(function(){
               $('#dialogDiv').remove();
                       
              $('body').append('<div id="dialogDiv"></div>');
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
                   dialog();              
              $.get(absoluteUrl + "page/choose-template/", function(data){                  
                  $('#dialogDiv').html(data);
                  $('#ajaxEventMask').remove();   

              });
              $('#dialogDiv').show('slow');            
              //onchange combo for page handling

          });           
          
              $('#templateName').livequery('change', function(){
              //alert('e');
              loadTemplate( $(this).attr("value"));
//$('body').css({background:$('#template_bodyBg').val() });
//alert($('#template_bodyBg').val());
                
             // ajaxEventDone(lang.TOpen);//sklanjanje maska                           
              $('#templateIDediting').html($(this).attr("value"));
              document.cookie = 'templateSelectedId=' + $(this).attr("value") + ';  path=/'; //ovo treba namestiti 
              $('#dialogDiv').hide('slow').remove();//ovo je za removovanje dijaloga MUST
              });
              
                        
          if(idForRem){
              if (idForRem  != "") {          
                    alert("out");
                    $('#' + idForRem).remove();
                    idForRem = "";
              }
          }        
        $('#properties').fadeIn(2000); 
        
        //getting cookies for the template and the page
        if(getCookie("templateSelected") == 1){
            $('#templateDisplayer').click();
            if(getCookie("templateSelectedId")){
                loadTemplate(getCookie("templateSelectedId"));
            }
        }else {
            $('#pageDisplayer').click();
            if(getCookie("pageSelectedId")){
                loadPage(getCookie("pageSelectedId"));
            }
        }      
});//end document ready


        $(".container").livequery('click', function(e){

            
            var id = $('#' + $(this).attr("id") + ' .draggable').html();

            //alert( id);

        });

         
         //DBLCLICK ON OBJECT
         $(".draggable").livequery('dblclick', function(){
         //toggleEditor('objPropertiesHtmlTiny');
            //alert($(this).attr("id"))
            lefT = $(this).position().left;
            toP = $(this).position().top;
            drOff = $('#droppable').position().left;

            $('#penPointer').css({left:lefT + drOff, top:toP-40}).fadeIn();
            $(".draggable").each(function(){
                //$(this).css("opacity", "0.1");
                $(this).removeClass("activeObject");
                $(this).addClass("inactiveObject");
                //$(this).css("border", "0px dotted red");
                $('#' +$(this).attr("id") ).resizable({ autoHide: true  });
            });
            //$(this).css("opacity", "1");
            //$(this).css("border", "1px dotted red");
            $(this).removeClass("inactiveObject");
            $(this).addClass("activeObject");
            
            width = $(this).css("width");
            height= $(this).css("height");
            border = $(this).css("border");
            bgColor = $(this).css("background-color");
            bgImage = $(this).css("background-image");
            objectClasses = $(this).attr("class");
            htmlValue = $(this).html();
            zIn = $(this).css("z-index");
            css = "width: auto; min-height: 25px;height:auto; background: transparent; padding: 10px; float:left;color: black;" + $(this).attr("style");
            //theme classes
            themeClass = "";
            if( $(this).hasClass("noTheme") ){themeClass = "no";} 
            if( $(this).hasClass("silverTheme") ){themeClass = "silver";} 
                if( $(this).hasClass("greenTheme") ){themeClass = "green";}
                    if( $(this).hasClass("blueTheme") ){themeClass = "blue";}
                        if( $(this).hasClass("whiteTheme") ){themeClass = "white";}           
                            if( $(this).hasClass("blackTheme") ){themeClass = "black";}
                                if( $(this).hasClass("redTheme") ){themeClass = "red";}
                                 if(themeClass == "") {themeClass = "no";}
            posiy =    $(this).position().top - ($('#droppable').position().top);
            posix =    $(this).position().left - ($('#droppable').position().left);
            objectHasType = $(this).attr("objType");
            
            if(objectHasType){
                //$('#objType').attr("value", objectHasType);
                $('#objType').prop("value", objectHasType);
                $('#objType').val($('#objType option[class="' + objectHasType + '"]').text() );
                $('#objType').prev("span").text($('#objType option[class="' + objectHasType + '"]').text() );
                //alert($('#objType option[class="' + objectHasType + '"]').text());
                //$(this).css("background", "url(images/" + objectType + ".png) no-repeat center");
                //$('#objType').attr("value", objectType);
            } else {
                //$('#objType').attr("value", "Text");
                $('#objType').val("Text");
                 $('#objType').prev("span").text("Text");
                //$(this).css("background", "url(images/" + $('#objType').attr("value") + ".png) no-repeat center");
            
            }
            
            //$(this).html("");
            $('#objProperties').attr("objId", $(this).attr("id") );
            $('#objIDshow').html($(this).attr("id"));
            
            $("#objPropertiesWidth").attr("value", width );
            $("#objPropertiesHeight").attr("value", height );
            $("#objPropertiesBorder").attr("value", border );
            $("#objPropertiesClass").attr("value", objectClasses );
            $("#objPropertiesBackground").attr("value", bgColor );
            $("#objPropertiesBackgroundImage").attr("value", bgImage );
            //objTheme
            $('#objTheme').attr("value", themeClass);
            $('#objTheme').val(themeClass);
            $('#objTheme').prev("span").text($('#objTheme option[value="' + themeClass + '"]').text() );

            //alert(themeClass);
            $("#objPropertiesX").attr("value",posix + "px");
            $("#objPropertiesY").attr("value",posiy + "px");
            $("#objPropertiesZ").attr("value",zIn );
            
            if($(this).attr("objType") == "Menu") {
                $('#objPropertiesHtml').attr("disabled", "disabled");
                $("#objPropertiesHtml").attr("value","{" + $(this).attr("command") + "}" );
            
            } else {
                $('#objPropertiesHtml').attr("disabled", false);
                $("#objPropertiesHtml").attr("value", htmlValue );
                $('#objPropertiesHtmlTiny').attr("value", htmlValue);

                var ed = tinyMCE.get('objPropertiesHtmlTiny');

                ed.setContent(htmlValue, {format : 'raw'});
               
                //$('#objPropertiesHtmlTiny').attr("value", htmlValue);
                //$('#objPropertiesHtmlTiny_ifr #tinymce').html(htmlValue);
                //toggleEditor('objPropertiesHtmlTiny');

            }
            
            $("#objPropertiesCSS").attr("value", css );
            //alert($("#objPropertiesCSS").attr("value"));
            if ( $(this).hasClass("shadowed") ) {
                $('#shadowCheck').prop("checked", "checked");
                 $('#shadowCheck').closest('span').addClass('checked');
            } else {
                $('#shadowCheck').prop("checked", "");
                $('#shadowCheck').closest('span').removeClass('checked');
            }

            if ( $(this).hasClass("cornered") ) {
                $('#cornerCheck').prop("checked", "checked");
                $('#cornerCheck').closest('span').addClass('checked');
                //$('#cornerPropDiv').show("slow");
            } else {
                $('#cornerCheck').prop("checked", "");
                $('#cornerCheck').closest('span').removeClass('checked');
                //$('#cornerPropDiv').hide("slow");
            }            
            

               
         });
        
        
        //handle the resizing of objects when input has changed
        //WIDTH
        $("#objPropertiesWidth").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("width", $(this).attr("value"));
                         
        });
        //height       
        $("#objPropertiesHeight").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("height", $(this).attr("value"));
                         
        }); 
        //border       
        $("#objPropertiesBorder").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("border", $(this).attr("value"));
                         
        }); 
        //X pos      
        $("#objPropertiesX").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("left", $(this).attr("value"));
                         
        });
        //Y pos      
        $("#objPropertiesY").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("top", $(this).attr("value"));
                         
        });

        $("#objPropertiesZ").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("z-index", $(this).attr("value"));
                         
        });
        $("#objPropertiesHtml").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).html($(this).attr("value"));
                         
        });
        $("#objPropertiesCSS").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).attr("style", $(this).attr("value"));
                         
        });        
        $("#objPropertiesBackground").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).css("background", absoluteUrl + $(this).attr("value"));
                         
        });        
        $("#objPropertiesBackgroundImage").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
//            $('#' + idObjekta).css("background-image", "url("+ absoluteUrl + $(this).attr("value")+")");
            $('#' + idObjekta).css("background-image", $(this).attr("value"));
            $('#' + idObjekta).css("background-repeat",   "no-repeat"  );         
        });

        $("#objPropertiesClass").livequery('change', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#' + idObjekta).attr("class", $(this).attr("value"));        
        }); 

         
        $("#bodyWidth").livequery('change', function(){
            $('#droppable').css("width", $(this).attr("value") );
        
        });       

        $("#bodyHeight").livequery('change', function(){
            $('#droppable').css("height", $(this).attr("value") );
        
        });         
        
        $("#template_bodyBg").livequery('change', function(){
            $('body').css("background", $(this).attr("value") );
        
        }); 
        
        //setting type and def background for the object
        //$('#objType').livequery('change', function(){
        $('#objType').change(function(){
            ajaxEvent();
            idObjekta = $('#objProperties').attr("objId");
            
            objectType = $('#' + idObjekta).attr("objType");
            
         
                //defaultBackground = $('#objType').attr("value"); 
                defaultBackground = $('#objType' + ' option:selected').attr('class');           
                $('#' + idObjekta).attr("objType", defaultBackground );
                //alert($(this).attr("value"));            
                
                //VAZNO!
                //$('#' + idObjekta).css("background", "url("+ absoluteUrl + "images/" + $('#' + idObjekta).attr("objType") + ".png) no-repeat center");
              
              //MANAGING OF THE TypeHANDLE
              //alert($(this).attr("value"));
              //alert($('#objType' + ' option:selected').attr('class'));
              
              //title
              if (defaultBackground == "title") {
                  //$('#' + idObjekta).addClass("menuObj");
                  $('#' + idObjekta).html("{title}");
                    setTimeout("clickMask()", 500); //closing all  
              }              
              //pageInfo
              if (defaultBackground == "pageinfo") {
                  //$('#' + idObjekta).addClass("menuObj");
                  $('#' + idObjekta).html("{pageinfo}");
                    setTimeout("clickMask()", 500); //closing all  
              }
              //SEARCHFORM
              if (defaultBackground == "searchform") {
                  //$('#' + idObjekta).addClass("menuObj");
                  $('#' + idObjekta).html("{searchform}");
                    setTimeout("clickMask()", 500); //closing all  
              }
              //languageFORM
              if (defaultBackground == "languageform") {
                  //$('#' + idObjekta).addClass("menuObj");
                  $('#' + idObjekta).html("{language:flags}");
                    setTimeout("clickMask()", 500); //closing all  
              }
              //contactFORM
              if (defaultBackground == "contactform") {
                  //$('#' + idObjekta).addClass("menuObj");
                  $('#' + idObjekta).html("{liveblock:forms:_contactForm:contact}");
                    setTimeout("clickMask()", 500); //closing all  
              }
              //footer
              if (defaultBackground == "footer") {
                  $('#' + idObjekta).addClass("footer");
                  //$('#' + idObjekta).html("{language:flags}");
                    setTimeout("clickMask()", 500); //closing all  
              }               
              //contentBg
              if (defaultBackground == "contentarea") {
                    $('#' + idObjekta).addClass("contentBg");
                    $('#' + idObjekta).css("overflow", "visible");
                    $('#' + idObjekta).html("{content}");
                    setTimeout("clickMask()", 500); //closing all  
              }

              //loginArea
              if (defaultBackground == "loginarea") {
                  //$('#' + idObjekta).addClass("menuObj");
                  $('#' + idObjekta).html("{liveblock:user:loginArea}");
                    setTimeout("clickMask()", 500); //closing all  
              }

              if ($(this).attr("value") == "Menu") {
                  $('#' + idObjekta).addClass("menuObj");
                  $('#MenuA').click();                  
                    //alert("Click on the menu to select it!");
                    ajaxEventDone(lang.ClickMenu);              
                    ajaxEmitMessage(lang.ClickMenu);
                    setTimeout("clickMask()", 2000); //closing all  
                  aaa = 1;
                  
              }           

              if ($(this).attr("value") == "Image") {
                  $('#ImagesA').click();                  
                    //alert("Click on the folder, and then on the image to select it!");
                    ajaxEventDone(lang.ClickFolIm);              
                    ajaxEmitMessage(lang.ClickFolIm);
                    setTimeout("clickMask()", 2000); //closing all 
                  imageSelectionActive = 1;
                  
              } 



        });
        
                      
        //DISPLAYING MENU IN AN OBJECT              
                      aaa = 0;
                      $('#chooseMenuForm').livequery('click', function(){
                          //$(this).change();
                      });
                      $('#chooseMenuForm').change(function(){
                          idObjekta = $('#objProperties').attr("objId");
                          //alert(idObjekta);
                          //MENU PUTTING
                          if (aaa == 1 || putInThisObj == 1) { 
                              selMenuTemplate = $('#' + $(this).attr("id") + " option:selected").attr("value");//selected menu
                              selValueTemplate = $('#' + $(this).attr("id") + " option:selected").attr("label");  
                              //alert("You have chosen " + selValueTemplate + " to display in this object!");
                              
                              aaa = 0;
                              
                              var tvCommand = "menu:display:" + selMenuTemplate + displayTypeMenu ;
                              
                              $.post(absoluteUrl + "view/render-tv/creatorAct/true/var/" + "{" + tvCommand + "}", function(data){
                                  $('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update   
                                  $('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).dblclick();
                                  
                                  $('#objPropertiesHtml').attr("value","{"+ tvCommand + "}");
                                  $('#' + idObjekta).attr("command", tvCommand);

                              });                              
                              //$('#poA').click();
                          }
                          
                      });        


        //IMAGE PUTTING  
    



                      imageSelectionActive = 0;
                      $('#chooseImageFolderForm').change(function(){
                          //ajaxEvent();
                          if (imageSelectionActive == 1 || putImagesInThisObj == 1) { 
                              ajaxEvent();
                              selFolder = $('#' + $(this).attr("id") + " option:selected").attr("value");//selected menu
                              selValueFolder = $('#' + $(this).attr("id") + " option:selected").attr("label");  
                              selectedImage = $('#imageNames').attr("value");
                              
                              //alert("You have chosen " + selFolder + " to display in this object!");
                              ajaxEventDone("You have chosen " + selFolder + " to display in this object!");              
                              ajaxEmitMessage("You have chosen " + selFolder + " to display in this object!");
                              setTimeout("clickMask()", 2000); //closing all 

                              
                              imageSelectionActive = 0;
                              //if (singleImage == 0) {
                                  var tvCommand = "images:display:'" + selFolder + "'" ;
                             // } else {
                                 // var tvCommand = "images:display:'" + selFolder + "':'" + selectedImage + "'" ;
                              //}
                              
                              
                              
                              $.post(absoluteUrl + "view/render-tv/var/" + "{" + tvCommand + "}", function(data){
                                  //$('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update   
                                  $('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).dblclick();                                  
                                  $('#objPropertiesHtml').attr("value","{"+ tvCommand + "}");
                                  $('#' + idObjekta).attr("command", tvCommand);

                              });
                                                            
                              
                          }
                      });     


        
        
        $("#delButton").livequery('click', function(){
            idObjekta = $('#objProperties').attr("objId");
            $('#objList option:contains("'+ idObjekta +'")').remove();
            
            $('#penPointer').hide();
            $('#objIDshow').html("");
            $('#' + idObjekta).remove();
            $('#objProperties').attr("objId", "");
                         
        });        
        $('#previewButton').click(function(){

        });
        
        //SHADOW
        $('#shadowCheck').click(function(){
            idObjekta = $('#objProperties').attr("objid");
            //alert($(this).attr("checked") );
            if ($(this).prop("checked") == true) {
                 $('#' + idObjekta).addClass("shadowed");
            } else {
                 $('#' + idObjekta).removeClass("shadowed");
            }

              
        });


        //CORNERS hide/show div and operation
        $('#cornerCheck').livequery('click', function(){
            idObjekta = $('#objProperties').attr("objid");
            //alert($(this).attr("checked") );
            if ($(this).prop("checked") == true) {
                 $('#' + idObjekta).addClass("cornered");
                 //$('#cornerPropDiv').show("slow");


                 
            } else {
                 $('#' + idObjekta).removeClass("cornered");
                 //$('#cornerPropDiv').hide("slow");
            }

              
        });
                 /*THIS WAS BEFORE corBg_() & corParams_()
                 $('#chooseCornerStyle').livequery('change', function(){
                    idObjekta = $('#objProperties').attr("objid");
                    //alert($(this).attr("value"));
                    $('#' + idObjekta).attr("cornerstyle", $('#chooseCornerStyle').attr("value") + " " + $('#chooseCornerOrientation').attr("value") );
                 });
                 $('#chooseCornerOrientation').livequery('change', function(){
                    idObjekta = $('#objProperties').attr("objid");
                    $('#' + idObjekta).attr("cornerstyle", $('#chooseCornerStyle').attr("value") + " " + $('#chooseCornerOrientation').attr("value") );
                    //alert($(this).attr("value"));
                 });
                 */
                 //CORNER HANDLING
                 $('#aParamCorner').livequery('click', function(){
                    if($('#cornerCheck').prop('checked') ){
                      ajaxEvent();
                      $('#dialogDiv').remove();
                      $('body').append('<div id="dialogDiv"></div>');
                      dialog(); 
                      $('#dialogDiv').html( $('#adminAjaxLoader').html() );                 
                      $.get(absoluteUrl + "creator/corner-params/" , function(data){
                          $('#dialogDiv').html( data  );                          
                          //filling the values 
                          idObj = $('#objIDshow').html();
                          objClass = $('#' + idObj ).prop("class");
                          re = /corParams_\S*/;
                          if(objClass.match(re)){
                              var sdwMtch = "" + objClass.match(re);
                              var sdwStat = "" + sdwMtch.replace("corParams_(", "");
                              var sdwExpr = "" + sdwStat.replace(")", "");                      
                              var names = sdwExpr.split(",");                      
                              for ( var i in names )
                              {
                                  if(i == 0){
                                      cornerStyle = names[i];
                                  }
                                  if(i == 1){
                                      cornerOrient = names[i];
                                  }                      
                                  if(i == 2){
                                      cornerRadius = names[i];
                                  }  
                              } 
                              //putting the existing values in the input boxes
                              $('#chooseCornerStyle').val(cornerStyle);
                              $('#chooseCornerOrientation').val(cornerOrient);
                              $('#cornerParamRadius').val(cornerRadius);
                          }
                          //background of the corner container
                          re = /corBg_\S*/;
                          if(objClass.match(re)){
                              var sdwMtch = "" + objClass.match(re);
                              var sdwStat = "" + sdwMtch.replace("corBg_(", "");
                      
                              var sdwExpr = "" + sdwStat.replace(")", "");
                              cornerBg = "" + sdwExpr;
                          } else {
                              cornerBg = "";
                          }
                          backgAttr = cornerBg ;
                          if (!backgAttr) {
                              backgAttr = "#ffffff";
                          }
                          $('#cornerParamBg').val(backgAttr);

    
                      });
                      $('#dialogDiv').show('slow');
                    } else {
                        return;
                    }
                 });
                 $('#cornerParamButton').livequery('click', function(){

                        idObjekta = $('#objIDshow').html();
                        objClass = $('#' + idObjekta).attr("class");
                        re = /corParams_\S*/;
                        if(objClass.match(re)){
                            a = objClass.replace(/corParams_\S*/g, '');
                            alert(a );
                            $('#' + idObjekta).attr('class', a);
                            
                            $('#' + idObjekta).removeClass(objClass.match(re));
                            $('#' + idObjekta).addClass("corParams_(" + $('#chooseCornerStyle').val() + "," + $('#chooseCornerOrientation').val() + "," + $('#cornerParamRadius').attr('value') + "px" + ")" );
                            alert($('#' + idObjekta).attr("class") );
                            $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );                                         
                            ajaxEmitMessage(objClass.match(re) + "is removed");
                             setTimeout("$('.ui-dialog').remove();", 500); //closing all
                        } else {
                            $('#' + idObjekta).addClass("corParams_(" + $('#chooseCornerStyle').val() + "," + $('#chooseCornerOrientation').val() + "," + $('#cornerParamRadius').attr('value') + "px" + ")" );
                            $('#objPropertiesClass').attr('value', $('#' + idObjekta).attr("class") );                                        
                            ajaxEmitMessage(objClass.match(re) + "is removed");
                             setTimeout("$('.ui-dialog').remove();", 500); //closing all                     
                        }
                        //background of the corner container
                        re2 = /corBg_\S*/;
                        if(objClass.match(re2)){
                            a = objClass.replace(/corBg_\S*/g, '');
                            //alert(a );
                            $('#' + idObjekta).attr('class', a);
                            $('#' + idObjekta).removeClass(objClass.match(re2));
                            $('#' + idObjekta).addClass( "corBg_(" + $('#cornerParamBg').val() + ")" );
                            $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );                            
                    
                        } else {
                            $('#' + idObjekta).addClass( "corBg_(" + $('#cornerParamBg').val() + ")" );
                            $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") ); 
                        }

                 });

                  //COLOR SELECTOR for the corners
                  $('#cornerParamBg').livequery(function(){
                      $(this).ColorPicker({
                      	onSubmit: function(hsb, hex, rgb, el) {
                      		$(el).val('#' + hex);
                          //idObjekta = $('#objProperties').attr("objId");
                          //$('#' + idObjekta).css("background", '#' + hex);    		
                      		$(el).ColorPickerHide();
                      	},
                      	onBeforeShow: function () {
                      		$(this).ColorPickerSetColor(this.value);
                      	}
                      })
                      .bind('keyup', function(){
                      	$(this).ColorPickerSetColor(this.value);
                      });
                  });
                  
                  
                 //SHADOW HANDLING
                 $('#aParamShadow').livequery('click', function(){
                    if($('#shadowCheck').prop('checked') ){
                      ajaxEvent();
                       $('#dialogDiv').remove();
                      $('body').append('<div id="dialogDiv"></div>');
                      dialog(); 
                      $('#dialogDiv').html( $('#adminAjaxLoader').html() );                 
                      $.get(absoluteUrl + "creator/shadow-params/" , function(data){
                          //making the dialog
                          $('#dialogDiv').html( data  );                          
                          //filling the values 
                          idObj = $('#objIDshow').html();
                          objClass = $('#' + idObj ).attr("class");
                          re = /dsParams_\S*/;
                          if(objClass.match(re)){
                              var sdwMtch = "" + objClass.match(re);
                              var sdwStat = "" + sdwMtch.replace("dsParams_(", "");
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
                              //putting the existing values in the input boxes
                              $('#shdwLeft').attr('value',Rleft);
                              $('#shdwTop').attr('value',Rtop);
                              $('#shdwBlur').attr('value',Rblur);
                              $('#shdwOpacity').attr('value',Ropacity);
                              $('#shdwColor').attr('value',Rcolor);                      
                          }
                      });
                      $('#dialogDiv').show('slow');
                    } else {
                        return;
                    }
                 });
                 $('#shadowParamButton').livequery('click', function(){

                        idObjekta = $('#objIDshow').html();
                        objClass = $('#' + idObjekta).attr("class");
                        re = /dsParams_\S*/;
                        if(objClass.match(re)){
                        //alert(objClass.match(re));
                            $('#' + idObjekta).removeClass(objClass.match(re));
                            a = objClass.replace(/dsParams_\S*/, '');
                            //alert(a );
                            $('#' + idObjekta).attr('class', a);
                            //alert($('#' + idObjekta).attr("class") );
                            $('#' + idObjekta).addClass("dsParams_(" + "left:" + $('#shdwLeft').attr('value') + "," + "top:" + $('#shdwTop').attr('value') + "," + "blur:" + $('#shdwBlur').attr('value') + "," + "opacity:" + $('#shdwOpacity').attr('value') + "," + "color:" + $('#shdwColor').attr('value') + ")" );
                            $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );                            
                            ajaxEmitMessage(objClass.match(re) + "is removed");
                            setTimeout("$('.ui-dialog').remove();", 500); //closing all 
                        } else {
                            //$('#' + idObjekta).removeClass(objClass.match(re));
                            $('#' + idObjekta).addClass("dsParams_(" + "left:" + $('#shdwLeft').attr('value') + "," + "top:" + $('#shdwTop').attr('value') + "," + "blur:" + $('#shdwBlur').attr('value') + "," + "opacity:" + $('#shdwOpacity').attr('value') + "," + "color:" + $('#shdwColor').attr('value') + ")" );
                            $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );                            
                            ajaxEmitMessage(objClass.match(re) + "is added");
                            setTimeout("$('.ui-dialog').remove();", 500); //closing all 
                        
                        }
                        //alert(objClass);

                 });
                //COLOR SELECTOR for the SHADOW
                $('#shdwColor').livequery(function(){
                    $(this).ColorPicker({
                    	onSubmit: function(hsb, hex, rgb, el) {
                    		$(el).val('#' + hex);    		
                    		$(el).ColorPickerHide();
                    	},
                    	onBeforeShow: function () {
                    		$(this).ColorPickerSetColor(this.value);
                    	}
                    })
                    .bind('keyup', function(){
                    	$(this).ColorPickerSetColor(this.value);
                    });
                });                 
        
        //CLEAR PAGE
        $('#clearPage').livequery('click', function(){
            $('#templateMask').empty();
            $('#droppable').empty();
            $('#objList').html("");          
        });
        
        
        //MENU MENAGEMENT
        //TURN putting in object on/off
        putInThisObj = 0;
        $('#putInThis').click(function(){
            //alert($(this).attr("checked") );
            if ($(this).prop("checked") == true) {
                 putInThisObj = 1;
            } else {
                 putInThisObj = 0;
            }

              
        });





        //IMAGES MENAGEMENT
        //TURN putting in object on/off
        putImagesInThisObj = 0;
        $('#putImagesInThis').click(function(){
            //alert($(this).attr("checked") );
            if ($(this).attr("checked") == true) {
                 putImagesInThisObj = 1;
            } else {
                 putImagesInThisObj = 0;
            }

              
        });


        //IMAGES MENAGEMENT - single image
        //TURN putting in object on/off
        singleImage = 0;
        $('#putSingleImageInThis').click(function(){
            //alert($(this).attr("checked") );
            if ($(this).attr("checked") == true) {
                 singleImage = 1;
            } else {
                 singleImage = 0;
            }

              
        });


        //UPLOAD IMAGES
        $('#addImageLink').livequery('click', function(){
              var valFolder = $('#folderNames').attr("value");
              if (valFolder == "") {
                    ajaxEventDone(lang.SelFolFirst);              
                    ajaxEmitMessage(lang.SelFolFirst);
                    setTimeout("clickMask()", 2000); //closing all  
              } else {
                  ajaxEvent();
                   $('#dialogDiv').remove();
                  $('body').append('<div id="dialogDiv"></div>');
                  dialog(); 
                  $('#dialogDiv').html( $('#adminAjaxLoader').html() );
     
                  $.get(absoluteUrl + "images/upload/fname/" + valFolder, function(data){
                      //alert(data);                  
                      
                      $('#dialogDiv').html(data);
                      
                  });
                  $('#dialogDiv').show('slow');
              }
            
        });

        //Add FOLDER
        $('#addFolderLink').livequery('click', function(){
               $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              
              $.get(absoluteUrl + "images/add-folder/", function(data){
                  //alert(data);                  
                  
                  $('#dialogDiv').html(data);
                  
              });
              $('#dialogDiv').show('slow');



            
        });

        //DELETE FOLDER
        $('#delFolderLink').click(function(){
                if($('#folderNames').attr("value") != ""){
                    var confir = confirm(lang.AYS);
                } else {
                    ajaxEvent();
                    ajaxEventDone(lang.SelFolFirst);              
                    ajaxEmitMessage(lang.SelFolFirst);
                    setTimeout("clickMask()", 2000); //closing all                  
                }   
                
                var val = $('#folderNames').attr("value");
                if (confir == true ){
                    ajaxEvent();
                    $.get(absoluteUrl + "images/delete-folder/fname/" + val , function(data){
                        //alert(data);
                        ajaxEmitMessage(lang.FolDeleted);
                        setTimeout("clickMask()", 1000); //closing all  
                        $('#folderNames option:contains('  + val + ')').remove();
                     });   
                    ajaxEventDone(lang.DeletingFolder);
                } 

        });

        //When folder is chosen show images in that folder
        $('#folderNames').livequery('change', function(){
            $('#imagesShow').html( $('#adminAjaxLoader').html() );
            var val = $('#folderNames').attr("value");
                     $.get(absoluteUrl + "images/show-images/fname/" + val , function(data){
                        //alert(data);
                        $('#imagesShow').html(data);
                        
                     });        
        
        });



                     singleImage = 0;
                      selectedImage = "";
                      $('#showFolderImages').livequery('change', function(){
                          //ajaxEvent();
                          //alert('ja');
                          if (imageSelectionActive == 1 || putImagesInThisObj == 1) { 
                              ajaxEvent();
                              selFolder = $('#folderNames').attr("value");//selected folder
                              selValueFolder = $('#folderNames').attr("label");  
                              selectedImage = $('#imageNames').attr("value");
                              imagePath = absoluteUrl + "images/" + selFolder + "/" + selectedImage;
                              $('#imagePathShow').html(imagePath);
                              
//                              alert("You have chosen " + selectedImage + " to display in this object!");
                              ajaxEventDone("You have chosen " + selectedImage + " to display in this object!");              
                              ajaxEmitMessage("You have chosen " + selectedImage + " to display in this object!");
                              setTimeout("clickMask()", 2000); //closing all 
                                                          
                              imageSelectionActive = 0;
                              if (singleImage == 0) {
                                  //var tvCommand = "images:display:'" + selFolder + "'" ;
                              } else {
                                  var tvCommand = "images:display:'" + selFolder + "':'" + selectedImage + "'" ;
                              }
                              
                              
                              
                              $.post(absoluteUrl + "view/render-tv/var/" + "{" + tvCommand + "}", function(data){
                                  //$('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update   
                                  $('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).dblclick();
                                                                    
                                  $('#objPropertiesHtml').attr("value","{"+ tvCommand + "}");
                                  $('#' + idObjekta).attr("command", tvCommand);

                              });
                                                            
                              
                          }
                      }); 


        //When  image is chosen  show details
        $('#showFolderImages').livequery('change', function(){

                              selFolder = $('#folderNames').attr("value");//selected folder
                              selValueFolder = $('#folderNames').attr("label");  
                              selectedImage = $('#imageNames').attr("value");
                              imagePath = absoluteUrl + "images/" + selFolder + "/" + selectedImage;
                              $('#imagePathShow').html(imagePath);
//$('#dialogDiv').remove();
//$('#imageDetails').remove();
if($( "#dialogDivImages" ).length == 0){
    $('body').append('<div id="dialogDivImages"><div id="imageDetails"></div></div>');
    $( "#dialogDivImages" ).dialog({modal:false, resizable: true, position: ['center','center'], title:"Image Details" , maxHeight:$(window).height() }); 
    $('#imageDetails').appendTo($('#dialogDivImages') );
}
if($('#imageDetails').length == 0){
    $('#dialogDivImages').remove();
    $('body').append('<div id="dialogDivImages"><div id="imageDetails"></div></div>');
    $( "#dialogDivImages" ).dialog({modal:false, resizable: true, position: ['center','center'], title:"Image Details" , maxHeight:$(window).height() }); 
    $('#dialogDivImages') .append('<div id="mageDetails"></div>');
} else{
    $('#dialogDivImages').dialog('open');
}
//$( ".ui-dialog" ).show();

            $('#imageDetails').html( $('#adminAjaxLoader').html() );
            //alert('ja');
            var val = $('#imageNames').attr("value");
            var valFolder = $('#folderNames').attr("value");
                     $.get(absoluteUrl + "images/show-image-details/fname/" + valFolder + "/imname/" + val , function(data){
                        //alert(data);
                        $('#imageDetails').html(data);
                        $('#deleteImage').show();
                        $('#insertImage').show();
                        $('#setBodyBgImage').show();
                        
                     });        
        
        });
        //INSERT IMAGE;
        $('#insertImage').click(function(){
            idObjekta = $('#objList').val();
            $('#' + idObjekta).resizable('destroy');
            $('#' + idObjekta).html('<p class="objContent"><img src = "' + $('#imagePathShow').text() + '" width="100%" height="100%" /></p>');
            
            $('#' + idObjekta).resizable({autohide:true});
                
        }); 
        //set as body bg;
        $('#setBodyBgImage').click(function(){
            if($('#bgSelect').val() == "BODY") {
                $('#template_bodyBg').attr("value" , "url(" + $('#imagePathShow').text() + ")" );
                $('#template_bodyBg').change();            
                $('.body2be').attr("src" , $('#imagePathShow').text() );
            }
            if($('#bgSelect').val() == "SHEET") {
                $('.sheet').css("background" , "url(" + $('#imagePathShow').text() + ")" );

            }
            if($('#bgSelect').val() == "HEADER") {
                /*var newImg = new Image();
                newImg.src =  $('#imagePathShow').text() ;
                var height = newImg.height;
                var width = newImg.width;
                $('.header img').attr("height" , height);
                $('.header img').attr("width" , width);

                $('.header img').attr("src" , $('#imagePathShow').text() );
                */
                $('.header').css("background" , "url(" + $('#imagePathShow').text() + ")" );

            }
            if($('#bgSelect').val() == "FOOTER") {
                $('#ftr').css("background" , "url(" + $('#imagePathShow').text() + ")" );
            }
            //alert($('#bgSelect').val());
                
        });

        $('#NR').livequery('change', function(){
        //alert($(this).val());
          if($(this).attr("value") == "repeat"){

            str = $('#template_bodyBg').attr("value");
           //alert(str);
            $('#template_bodyBg').prop("value" , str.replace("repeat", " no-repeat")  );
            $('#template_bodyBg').prop("value" , $('#template_bodyBg').attr("value") + " no-repeat" );
            //$('#template_bodyBg').prop("value",  $('#template_bodyBg').attr("value") + ";-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;");
            $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').attr("value") + ';background-repeat:no-repeat;');
            $('#template_bodyBg').change();
            //$('body').css("background-size" , "100%");
            $(this).prop("value", "no-repeat") ;
            str = $('#template_bodyBg').attr("value");
            $('body').css({backgroundRepeat:"no-repeat"});
            //alert(str);
            } else {
            str = $('#template_bodyBg').attr("value");
            //str.replace(";-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;", "");
            $('#template_bodyBg').attr("value" , str.replace(" no-repeat", " repeat") );
             $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').attr("value") + ';background-repeat:repeat;');

            $('#template_bodyBg').change();
            //$('body').css("background-size" , ""); 
            $(this).prop("value", "repeat") ; 
            $('body').css({backgroundRepeat:"repeat"});          
            }
        });

        $('#fixedBg').livequery('change', function(){
          if($(this).attr("value") == "fixed"){
            trenutniCss = $('#template_bodyBg').attr("value");
            if(trenutniCss.match(/;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;/g) ) {
              val = trenutniCss.replace(/;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;/g , "");
              $('#template_bodyBg').attr("value" ,  val + " fixed" + ";-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;");
            } else {
              $('#template_bodyBg').attr("value" , trenutniCss + " fixed" );
            }
            $('#bodyBack').css("position", "fixed");
             $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').attr("value") + ';background-attachment:fixed;');

            $('#template_bodyBg').change();
            $(this).prop("value", "") ;   
            $('body').css({backgroundAttachment:"fixed"});   
            //alert($('#template_bodyBg').attr("value"));         
            } else {
            str = $('#template_bodyBg').attr("value");
            
            $('#template_bodyBg').attr("value" , str.replace("fixed", "") );
            $('#bodyBack').css("position", "absolute");
            $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').attr("value") + ';background-attachment:scroll;');
$('#template_bodyBg').prop("value" , str.replace("fixed", "") );


 
            $('#template_bodyBg').change(); 
            //alert($('#template_bodyBg').attr("value"));
            $(this).prop("value", "fixed") ;
 $('body').css({backgroundAttachment:"scroll"});                                   
            }
            //alert($('#bodyBack').html());
        });
        //DELETE IMAGE;
        $('#deleteImage').click(function(){
                if($('#showFolderImages').attr("value") != ""){
                    var confir = confirm(lang.AYS);
                }    
                
                
                if (confir == true ){
                ajaxEvent();
                    $.get(absoluteUrl + "images/delete-image/f/" + $('#folderNames').attr("value") + '/i/' + $('#imageNames').attr("value"), function(data){
                        //alert(data);
                        ajaxEmitMessage(data);
                        setTimeout("clickMask()", 1000);                     
                     $('#folderNames').change();
                     });   
                    //$('#menuItemForm').html("");
                    //$('#menuItemForm').attr("value", "");
                    
                   ajaxEventDone(lang.DeletingImage);  
                } 
                
        }); 

        //MODULES
        
        //When module is chosen show admin action for that module
        $('#chooseModulesForm').livequery('change', function(){
            $('#modulesSelected').html( $('#adminAjaxLoader').html() );

            var val = $('#moduleName option:selected').text();
//$('#dialogDivModules').remove();
//$('#modulesSelected').remove();
//$('body').append('<div id="dialogDivModules"><div id="modulesSelected"></div></div>');
//$( "#dialogDivModules" ).dialog({modal:false, resizable: true});       
            $.get(absoluteUrl + val + "/admin/", function(data){
                //alert(data);
                $('#modulesSelected').html(data);
                        
            });        
        
        });

        //CATEGORIES

        $('#categoryNameAssign').livequery('change', function(){
            //alert($(this).attr("value") );        
        
        });

        //Add CATEGORY
        $('#addCategoryLink').livequery('click', function(){
               $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              
              $.get(absoluteUrl + "category/add-category/", function(data){
                  //alert(data);                  
                  
                  $('#dialogDiv').html( data);
                  
              });
              $('#dialogDiv').show('slow');
            
        });
        
        //Delete CATEGORY 
        $('#delCategoryLink ').livequery('click', function(){
            if(selCategory != ""){
                
                var confirCategory = confirm(lang.AYS);
                if (confirCategory == true){
                    ajaxEvent();
                    $.get(absoluteUrl + "category/del-category/id/" + selCategory, function(data){
                    //alert(data);
                    ajaxEmitMessage(data);
                    setTimeout("clickMask()", 1000);  

                    $('#chooseCategoryForm option:contains("'+ selValueCategory + '")').remove();
                    $('#categoryNameAssign  option:contains("'+ selValueCategory + '")').remove();

                    });            
                    ajaxEventDone(lang.DeletingCategory); 
                }               
                           
            } else {
                //alert("First select a category!");
                ajaxEvent();
                ajaxEventDone(lang.FirstSelCat);                 
                ajaxEmitMessage(lang.FirstSelCat);
                setTimeout("clickMask()", 2000);  
            }            
        }); 


        //CATEGORY ITEMS -add
        $('#addCategoryItemLink').livequery('click', function(){
            hrefVal = $(this).attr("href");
            if(selCategory != ""){
             $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
                $('#dialogDiv').html( $('#adminAjaxLoader').html() );            
                $.get(absoluteUrl + hrefVal +"/catid/" + selCategory, function(data){
                    $('#dialogDiv').html( data);
                });            
                $('#dialogDiv').show('slow');
            } else {
                //alert("First select a category!");
                ajaxEventDone(lang.FirstSelCat);                 
                ajaxEmitMessage(lang.FirstSelCat);
                setTimeout("clickMask()", 2000); 
            }                       
        });
        selCategoryItem = "";
        $('#catItems').livequery('change', function(){
            //alert( $(this).val() );
            selCategoryItem = $(this).val();
        });
        
        //CATEGORY ITEMS -delete
        $('#delCategoryItemLink').livequery('click', function(){
            ajaxEvent();
            hrefVal = $(this).attr("href");
            if(selCategoryItem != ""){
                var confirCategoryItem = confirm(lang.AYS);
                if (confirCategoryItem == true){    
                        //$('body').append('<div id="dialogDiv"></div>');
                        //$('#dialogDiv').html( $('#adminAjaxLoader').html() );            
                        $.get(absoluteUrl + hrefVal + "/catid/" + selCategory + "/catitid/" + selCategoryItem, function(data){
                            //$('#dialogDiv').html('<div id="closeDialogDiv"></div>' + data);
                            $('#categoryName').change();
                            ajaxEventDone(data);                 
                            ajaxEmitMessage(data);
                            setTimeout("clickMask()", 1000); 
                        });            
                        //$('#dialogDiv').show('slow');
                } else {
                    setTimeout("clickMask()", 500); 
                }                       
            } else {
                //alert("First select a category!");
                ajaxEventDone(lang.FirstSelCatIt);                 
                ajaxEmitMessage(lang.FirstSelCatIt);
                setTimeout("clickMask()", 2000); 
            }
        });

        //CATEGORY MENAGEMENT
        //TURN putting in object on/off
        putCategoryInThisObj = 0;
        $('#putCategoryInThis').click(function(){
            //alert($(this).attr("checked") );
            if ($(this).attr("checked") == true) {
                 putCategoryInThisObj = 1;
            } else {
                 putCategoryInThisObj = 0;
            }

              
        });


        //DISPLAYING CATEGORY IN AN OBJECT              
                      categ = 0;

                      $('#chooseCategoryForm').change(function(){
                          idObjekta = $('#objProperties').attr("objId");
                          //CATEG PUTTING
                          if (categ == 1 || putCategoryInThisObj == 1) { 
                              selCategoryTemplate = $('#' + $(this).attr("id") + " option:selected").attr("value");//selected category
                              selValueCategory = $('#' + $(this).attr("id") + " option:selected").attr("label");  
                              //alert("You have chosen " + selValueTemplate + " to display in this object!");
                              
                              categ = 0;
                              
                              var tvCommand = "category:display:" + selCategoryTemplate + displayTypeMenu ;
                              
                              $.post(absoluteUrl + "view/render-tv/var/" + "{" + tvCommand + "}", function(data){
                                  //$('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update   
                                  $('#' + idObjekta).html(data);
                                  $('#' + idObjekta ).dblclick();
                                                                    
                                  $('#objPropertiesHtml').attr("value","{"+ tvCommand + "}");
                                  $('#' + idObjekta).attr("command", tvCommand);
                                  $('#' + idObjekta).attr("objtype", "Category");

                              });                              
                              //$('#poA').click();
                          }
                          
                      });  


        //clickin on a category and deleting one
        selCategory = "";

        $('#chooseCategoryForm').change(function(){
        //$('#categorySelectedForm').hide();
        $('#categorySelected').html(lang.Loading);
        $('#categorySelected').append($('#adminAjaxLoader').html() );

            
            selCategory = $('#' + $(this).attr("id") + " option:selected").attr("value");//selected Category
            selValueCategory = $('#' + $(this).attr("id") + " option:selected").attr("label");        

                     $.get(absoluteUrl + "category/show-category-items/catid/" + selCategory , function(data){
                        //alert(data);
                        $('#categorySelected').html(data);
                        //$('#deleteImage').show();
                        
                     });        

        });

        
        //MENUS
        //Add A MENU
        $('#addMenuLink').livequery('click', function(){
               $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              
              $.get(absoluteUrl + "menu/add-menu/", function(data){
                  //alert(data);                  
                  
                  $('#dialogDiv').html( data);
                  
              });
              $('#dialogDiv').show('slow');



            
        });
        
        //clickin on a menu and deleting one
        selMenu = "";
        //$('#chooseMenuForm').livequery('change', function(){
        $('#chooseMenuForm').change(function(){
        //$('#menuSelectedForm').hide();
        $('#menuSelected').html(lang.Loading);
        $('#menuSelected').append($('#adminAjaxLoader').html() );
        //$('#adminAjaxLoader').fadeIn();
            //$('#menuSelected').html("");
            
            selMenu = $('#' + $(this).attr("id") + " option:selected").attr("value");//selected menu
            selValue = $('#' + $(this).attr("id") + " option:selected").attr("label");        
            
            

                              var tvCommand = "menu:display:" + selMenu + ":tree";
                              
                              $.post(absoluteUrl + "view/render-tv/creatorAct/true/var/" + "{" + tvCommand + "}", function(data){
                                    //$('#adminAjaxLoader').fadeOut();
                                    $('#menuSelected').html(data);

/*
                                  			$("#menuSelected #tree").treeview({
                                  				collapsed: true,
                                  				animated: "medium",
                                  				control:"#sidetreecontrol",
                                  				persist: "location"
                                  			});
*/                                  			
                                  	//ADDING ADMIN CLASS TO TREE 
                                    $("#menuSelected #tree").addClass("adminTree");
                                    
                                    $("#menuSelected #tree.adminTree a").click(function(){
                                        miId = $(this).attr("id").replace(/mi_/, "") ;
                                        //alert(miId );
                                        //alert(miId);
                                        $('#menuSelectedForm').show();//first show the form
                                        
                                        $('#menuItemForm').html('ID:' + miId );
                                        $('#menuItemForm').attr("value", miId);
                                        $('#editMenuItem').click();
                                        $('#deleteMenuItem').show();
                                        
                                        return false;
                                    });		

                              
                              });

            //$('#menuFormContainer').append('<div id="menuSelected">' + selMenu + '</div>');
        });

        //Add MENU ITEM
        $('#addMenuItemLink').livequery('click', function(){
              $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              mid = $('#menuName').attr("value");
              if(mid != ""){              
                  $.get(absoluteUrl + "menu/add-menu-item/mid/" + mid, function(data){
                      //alert(data);                  
                      $('#dialogDiv').html(data);
                  });
                  $('#dialogDiv').show('slow');
              } else {
                  //alert("Choose a menu first!");
                  ajaxEventDone(lang.FSelMenu);                 
                  ajaxEmitMessage(lang.FSelMenu);
                  setTimeout("clickMask()", 2000); 

              }            
        });

        $('#addMenuItemForm').livequery('change', function(){
            
            checkedValue = $('#addMenuItemForm input[type=radio]:checked').val();
            //alert(checkedValue + 'e');
            if(checkedValue == "page"){

                $('#menuItemCategory').show();
                $('#menuItemPage').show();
                $('#menuItemModule').hide(); 
                //uniform
                $('#uniform-menuItemCategory').show();
                $('#uniform-menuItemPage').show();
                $('#uniform-menuItemModule').hide(); 
                $('#uniform-addMenuItemSubmit').show();                           
            }
            if(checkedValue == "module"){

                $('#menuItemCategory').hide();
                $('#menuItemPage').hide();
                $('#menuItemModule').show();
                if($('#menuItemModule').attr("value") == '0'){
                    $('#addMenuItemSubmit').hide();
                }                         

                //uniform
                $('#uniform-menuItemCategory').hide();
                $('#uniform-menuItemPage').hide();
                $('#uniform-menuItemModule').show();
                if($('#uniform-menuItemModule').attr("value") == '0'){
                    $('#uniform-addMenuItemSubmit').hide();
                } 
            }
        
        });

        //when category for the menu item that is to be added is choosed, then call the filter function
        $('#menuItemCategory').livequery('change', function(){
            //alert($(this).attr("value") );
            val = $(this).attr("value");
            $.post(absoluteUrl + "menu/get-pages-by-category/catid/" + val, function(data){
                $('#menuItemPage').empty();
                //$('#menuItemPage').livequery('html', function(){
                    $('#menuItemPage').html(data);
                //});
                //$('#dialogDiv').html('<div id="closeDialogDiv"></div>' + data);            
            });            

        });
        
        //when page is selected display the submit button
        $('#menuItemPage').livequery('change', function(){
            pageVal = $(this).attr("value");
            if($(this).attr("value") != "0"){
                //alert(pageVal);
                $('#addMenuItemSubmit').show();
            } else {
                $('#addMenuItemSubmit').hide();
            }
        });        

        //when module is selected display the submit button
        $('#menuItemModule').livequery('change', function(){
            moduleVal = $(this).attr("value");
            if($(this).attr("value") != "0"){
                //alert(pageVal);
                $('#addMenuItemSubmit').show();
            } else {
                $('#addMenuItemSubmit').hide();
            }
        });
      
        
        //EDIT MENU ITEM
        $('#editMenuItem').click(function(){
            $('#menuItemForm').append("<br />" + lang.Loading);
            $('#menuItemForm').append($('#adminAjaxLoader').html() );
            //alert("ja");
            $.get(absoluteUrl + "menu/edit-menu-item/id/" + $('#menuItemForm').attr("value"), function(data){
                
                $('#menuItemForm').html('ID:' + $('#menuItemForm').attr("value") + "<br />" + data);
            
             });
        });

        //DELETE MENU ITEM;
        $('#deleteMenuItem').click(function(){
                if($('#menuItemForm').attr("value") != ""){
                    var confir = confirm(lang.AYS);
                }    
                
                
                if (confir == true ){
                ajaxEvent();
                    $.get(absoluteUrl + "menu/delete-menu-item/id/" + $('#menuItemForm').attr("value"), function(data){
                        //alert(data);
                        ajaxEmitMessage(data);
                        setTimeout("clickMask()", 1000);                     
                    $('#menuItemForm').html("");
                    $('#menuItemForm').attr("value", "");
                    $('#chooseMenuForm').change();
                ajaxEventDone(lang.DelMenuItem); 
                     });   

                } 
                
        });        
        
        //DeleteMENU ;
        $('#delMenuLink ').livequery('click', function(){
            
            if(selMenu != ""){
                
                var confir = confirm(lang.AYS);
                if (confir == true){
                    ajaxEvent();
                    $.get(absoluteUrl + "menu/del-menu/id/" + selMenu, function(data){
                    //alert(data);
                    ajaxEmitMessage(data);
                    setTimeout("clickMask()", 1000); 

                    $('#chooseMenuForm option:contains("'+ selValue + '")').remove();
                    $('#menuNameAssign option:contains("'+ selValue + '")').remove();

                    });
                    ajaxEventDone(lang.DelMenu);    
        
                }               
           
            } else {
                ajaxEvent();
                //alert("First select a menu!");
                ajaxEventDone(lang.FirstSelMenu);                 
                ajaxEmitMessage(lang.FirstSelMenu);
                setTimeout("clickMask()", 2000);

            }            
        });        


        //ON ASSIGN THIS PAGE TO MENU
        $('#menuNameAssign').livequery('change', function(){
            ajaxEvent();
            menu = "";
            selMenu = $('#' + $(this).attr("id") + " option:selected").attr("value");//selected menu
            selValue = $('#' + $(this).attr("id") + " option:selected").attr("label");   
            if (selMenu =="select") {return;};
            var tvCommand = "menu:display:" + selMenu + ":tree";

            menuSelected = $('#' + $(this).attr("id") + " option:selected").attr("value");
            if (menuSelected != "select"){
                $('body').append('<div id="dialogDiv"></div>');
                dialog();
                $('#dialogDiv').html( $('#adminAjaxLoader').html() );

                //GETTING  THE MENU TREE
                $.post(absoluteUrl + "view/render-tv/creatorAct/true/var/" + "{" + tvCommand + "}", function(data){
                    menu = data;            
                    $.get(absoluteUrl + "menu/show-menu-items/id/" + menuSelected + "/cid/" + $('#pgID').html(), function(data){
                        //alert(data);                  
                        $('#dialogDiv').append( menu + '<div id="addMenuItForm">' + data + '</div>');
                        $('#dialogDiv img').hide(); 
    
                        //ADDING ADMIN CLASS TO TREE 
                        $("#dialogDiv #tree").addClass("adminTree");
                        $("#dialogDiv #tree").css({width:"200px", float:"left" });
    
                                        //CLICK ON THE TREE
                                        $("#dialogDiv #tree a").click(function(){
                                            miId = $(this).attr("id").replace(/mi_/, "") ;
                                            //alert(miId );
                                            $('#menuItemName').attr("value",miId);
                                            $('#menuItemName').prev('span').text( $('#menuItemName').find(':selected').text() );
                                            //alert($('#menuItemName').attr("value") );
     
                                            return false;
                                        });	    
/*
 //$('#addMenuItemSubmit2').click(function(){
    $('#addMenuItemForm2').ajaxForm({
        clearForm: true,
        success: function(data){    
        //$('#addMenuItForm').html(data);
        ajaxEventDone(data);                 
        ajaxEmitMessage(data);
        setTimeout("clickMask()", 2000);
        $('#dialogDiv').remove();
        $('#menuNameAssign').prop("value", "select"); 
        $('#addMenuItemSubmit2').prop('disabled', true);
        }
    });
//});  
*/                
                    });
        
                      
                });     
                //$('#dialogDiv').show('slow');           
            }           
       
        
        });
        
        
        $('#menuItemName').livequery('change', function(){
            var menuItemSelected = $('#' + $(this).attr("id") + " option:selected").attr("value");
            //alert(menuItemSelected);
            
        });               
        
        //DISPLAY MENU IN DIFFERENT WAYS
        displayTypeMenu = "";
        $('#menuDisplayType').change(function(){
            //alert( $("#menuDisplayType input:checked").attr("value") );
            displayTypeMenu = $("#menuDisplayType input:checked").attr("value");
        });
    
    //CSS TAB
    $('#addCssCodeA').click(function(){
        ajaxEvent();
        if(codepressOff == false) {//IF codepress is turned on       
            pageCSS.toggleEditor();
        }
        
        //alert($('#objListForCss').attr("value"));
        oldCss = $('#pageCSS').attr("value");
        if(codepressOff == true) {//IF codepress is turned off
            oldCss_cp = oldCss;
        } else {
            oldCss_cp = $('#pageCSS_cp').attr("value");        
        }
       
        newPageCss = "\n#" + $('#objListForCss').attr("value") + '{' + "\n\n\n" + '}' + "\n" + oldCss;
        if(codepressOff == true) {//IF codepress is turned off
            newPageCss_cp = newPageCss;                
        } else {
            newPageCss_cp = "\n#" + $('#objListForCss').attr("value") + '{' + "\n\n\n" + '}' + "\n" + oldCss_cp;        
        }
        
        
        if ( $('#objListForCss').attr("value") != "") {
            $('#pageCSS').attr("value", newPageCss);
            if(codepressOff == true) {//IF codepress is turned off
                //$('#pageCSS_cp').attr("value", newPageCss_cp);//cp is for codepress                        
            } else {
                $('#pageCSS_cp').attr("value", newPageCss_cp);//cp is for codepress            
            }

            if(codepressOff == false) {//IF codepress is turned on              
                pageCSS.toggleEditor();
            }
        } else {
//            alert("First select the object!");
                ajaxEventDone(lang.FirstSelObj);                 
                ajaxEmitMessage(lang.FirstSelObj);
                setTimeout("clickMask()", 2000); 
            if(codepressOff == false) {//IF codepress is turned on  
                pageCSS.toggleEditor();
            }
        }
    
    });

    

    //JS TAB
    
    $('#addJsCodeA').click(function(){
        ajaxEvent();
        if(codepressOff == false) {//IF codepress is turned on       
            pageJS.toggleEditor();
        }
        
        //alert($('#objListForJs').attr("value"));
        oldJs = $('#pageJS').attr("value");

        if(codepressOff == true) {//IF codepress is turned off
            oldJs_cp = oldJs;
        } else {
            oldJs_cp = $('#pageJS_cp').attr("value");     
        }



        
        newPageJs = "\n$('#" + $('#objListForJs').attr("value") + "').livequery('" + $('#eventListForJs').attr("value") + "', " + 'function(){' + "\n\n\n" + '});' + "\n" + oldJs;
        if(codepressOff == true) {//IF codepress is turned off
            newPageJs_cp = newPageJs;                
        } else {
            newPageJs_cp = "\n$('#" + $('#objListForJs').attr("value") + "').livequery('" + $('#eventListForJs').attr("value") + "', " + 'function(){' + "\n\n\n" + '});' + "\n" + oldJs_cp;
        }



        //newPageJs_cp = "\n#" + $('#objListForJs').attr("value") + '{' + "\n\n\n" + '}' + "\n" + oldJs_cp;


        if ( $('#objListForJs').attr("value") != "") {
            $('#pageJS').attr("value", newPageJs);
            if(codepressOff == true) {//IF codepress is turned off
                //                       
            } else {
                $('#pageJS_cp').attr("value", newPageJs_cp);//cp is for codepress
            }


            
            if(codepressOff == false) {//IF codepress is turned on
                pageJS.toggleEditor();
            }
            
        } else {
            //alert("First select the object!");
                ajaxEventDone(lang.FirstSelObj);                 
                ajaxEmitMessage(lang.FirstSelObj);
                setTimeout("clickMask()", 2000); 

            if(codepressOff == false) {//IF codepress is turned on
                pageJS.toggleEditor();
            }
        }
    
    });
    
    //ARROW ON SELECTED OBJECT FOR CSS
    $('#objListForCss').change(function(){
            //alert( $(this).attr("value") );

            if ($(this).attr("value") != "") {
                lefT = $('#' + $(this).attr("value") ).position().left;
                toP = $('#' + $(this).attr("value") ).position().top;            
            
                $('#downPointer').css({left:lefT +drOff, top:toP}).fadeIn();
            } else {
                $('#downPointer').fadeOut();
            }   
    });    

    //ARROW ON SELECTED OBJECT FOR JS
    $('#objListForJs').change(function(){
            //alert( $(this).attr("value") );

            if ($(this).attr("value") != "") {
                lefT = $('#' + $(this).attr("value") ).position().left;
                toP = $('#' + $(this).attr("value") ).position().top;            
            
                $('#downPointer').css({left:lefT + drOff, top:toP}).fadeIn();
            } else {
                $('#downPointer').fadeOut();
            }   
    });
    //RESETING ARROW WHEN CLICKIN ON TABS
    $('#CssA').click(function(){
        //$('#downPointer').fadeOut();
        $('#objListForCss').change();
    });  

    $('#JsA').click(function(){
        //$('#downPointer').fadeOut();
        $('#objListForJs').change();
    });
    
    $('#ImagesA').click(function(){
        $('#downPointer').fadeOut();    
    });
    $('#ModA').click(function(){
        $('#downPointer').fadeOut();    
    });
    $('#LangA').click(function(){
        $('#downPointer').fadeOut();    
    });
    $('#CatA').click(function(){
        $('#downPointer').fadeOut();    
    });
    $('#MenuA').click(function(){
        $('#downPointer').fadeOut();    
    });
    $('#poA').click(function(){
        $('#downPointer').fadeOut();    
    });      

    //COLOR SELECTOR
    $('#objPropertiesBackground').ColorPicker({
    	onSubmit: function(hsb, hex, rgb, el) {
    		$(el).val('#' + hex);
        idObjekta = $('#objProperties').attr("objId");
        $('#' + idObjekta).css("background", '#' + hex);    		
    		$(el).ColorPickerHide();
    	},
    	onBeforeShow: function () {
    		$(this).ColorPickerSetColor(this.value);
    	}
    })
    .bind('keyup', function(){
    	$(this).ColorPickerSetColor(this.value);
    });


    //TEMPLATE CHANGER
    $('#templateChanger').change(function(){
        ajaxEvent();
        templateId = $(this).attr("value");
        if(templateId == 0) {return false;}
        //alert(templateId);
        pageId = $('#pgID').html();
        //alert( templateId );
        $.post(absoluteUrl + "page/change-template/pageid/" + pageId + "/templateid/" + templateId, function(data){
            //alert(data);
            ajaxEmitMessage(data);
            setTimeout("clickMask()", 1000);             
        });
        ajaxEventDone(lang.TChange);         
    });
    
    $('#pageDisplayer').click(function(){
        //alert( $(this).attr("value"));
        $('#pageEditing').show();
        $('#assignPageToCategory').show();
        $('#assignPageMenuForm').show();
        $('#descKeyDiv').show();
        $('body').css("background", "none");
        
        $('#templateEditing').hide();
        $('#deletePage').show(); 
        $('#clearPage').click();
        document.cookie = 'templateSelected=0;  path=/'; 
        if(getCookie("pageSelectedId")){loadPage(getCookie("pageSelectedId"));}  //return to the previously edited page
    });    

    $('#templateDisplayer').click(function(){
        $('#pageEditing').hide();
        $('#assignPageToCategory').hide();
        $('#assignPageMenuForm').hide();
        $('#descKeyDiv').hide();
                
        $('#templateEditing').show();
        $('#deletePage').hide();  
        $('#clearPage').click(); 
        document.cookie = 'templateSelected=1; path=/';
        if(getCookie("templateSelectedId")){loadTemplate(getCookie("templateSelectedId"));} //return to the previously edited template
 
    });       



    //TABLE MANIPULATION UniversalTableAdmin
    $('a.uniTableAdmin').livequery('click', function(){
        tableid =   $(this).attr("value");
        rowId = $(this).closest("tr").attr("id");
        hrefVal =  $(this).attr("href");
        
        if ($(this).hasClass("a_add") ){
    
            //$('#addRowForm').remove();
            $('#dialogDiv').remove();
            $('body').append('<div id="dialogDiv"></div>');
            dialog(); 
            $('#dialogDiv').html( $('#adminAjaxLoader').html() );
            
            
            if(hrefVal == "") {
                hrefVal = "tables/add-row/tableid/" + tableid;
            }
                       
            //alert(tableid);
            $.get(absoluteUrl + hrefVal, function(data){
                //alert(data);
                $('#dialogDiv').html( data);        
            });
            $('#dialogDiv').show('slow');
    
        }
    
        //IF EDIT
        if ($(this).hasClass("a_edit") ){
            var rowId = $(this).closest("tr").attr("id");
    
            //alert(parentTag );
            //var rowId = $(this).attr("id");
            //var rowId = "5";
            $('#editRowForm').remove();
            $('#dialogDiv').remove();
            $('body').append('<div id="dialogDiv"></div>');
            dialog(); 
            $('#dialogDiv').html( $('#adminAjaxLoader').html() );
            $.get(absoluteUrl + "tables/edit-row/tableid/" + tableid + "/rowid/" + rowId, function(data){
                //alert(data);
                $('#dialogDiv').html(data);        
            });
            
            $('#dialogDiv').show('slow');
    
        }
    
        //IF DELETE
        if ($(this).hasClass("a_delete") ){
            //alert($(this).attr("id") );
            var rowId = $(this).attr("id");
            var confir = confirm(lang.AYS);
            if(hrefVal == "") {
                hrefVal = "tables/delete-row/tableid/" + tableid + "/rowid/" + rowId;
            } else {
                 hrefVal = hrefVal + "id/" + rowId;                       
            }

            if (confir == true) {
            ajaxEvent();
                $.post(absoluteUrl + hrefVal, function(data){
                    //alert(data);
                    ajaxEmitMessage(data);
                    setTimeout("$('#ajaxEventMask').click()", 1000);  
                    $('#uta_' + tableid  + ' tr[id^='+ rowId +']').fadeOut(2000, function(){
                        $(this).remove();
                    });
            
                });
                ajaxEventDone(lang.Deleting);                         
            }
    
        }    
    
    });
  
    $('.universalTableAdmin tr').livequery('mouseover', function(){
        $(this).removeClass("utaNormal");
        $(this).addClass("utaHover");
    });    
    $('.universalTableAdmin tr').livequery('mouseout', function(){
        $(this).removeClass("utaHover");
        $(this).addClass("utaNormal");
    });
    $('.universalTableAdmin tr').livequery('click', function(){
        //alert($(this).attr("id") );

    });

    $('.expanderDiv').livequery('click', function(){

        if($(this).hasClass("expanderDiv") ) {
            $(this).addClass("expanderDivClosed");
            $(this).removeClass("expanderDiv");
        } else if($(this).hasClass("expanderDivClosed") ) {
            $(this).addClass("expanderDiv");
            $(this).removeClass("expanderDivClosed");        
        }    
        $('#' + $(this).attr("value")).toggle();    
    });
    
    $('.expanderDivClosed').livequery('click', function(){

        if($(this).hasClass("expanderDiv") ) {
            $(this).addClass("expanderDivClosed");
            $(this).removeClass("expanderDiv");
        } else if($(this).hasClass("expanderDivClosed") ) {
            $(this).addClass("expanderDiv");
            $(this).removeClass("expanderDivClosed");        
        }    
        $('#' + $(this).attr("value")).toggle();    
    });    
    
    //Pagination
    $('.pag_a').livequery('click', function(){
        
        idCurrent = $(this).html();//this is important for refreshing of the table
        //idCurrent = parseInt($('#paginationControl span.current').text() );
        //alert(idCurrent);
        div = $(this).parents("div:eq(1)").attr("id");
        //$('#' + div + " .universalTableAdmin").fadeOut(1000);
        $('#' + div + " .universalTableAdmin").prepend('<div id="loadingBook" style="position:absolute;bottom:20px;left:85%;z-index:999999;text-align:center;background:transparent;padding:10px;"><img align="center" src="' + absoluteUrl2 + 'images/ajax-loaderTable.gif" /></div>');

        //$('#' + div + " .universalTableAdmin").prepend('<tr><td style="text-align:center;background:#f4f4f4;padding:10px;"><img align="center" src="' + absoluteUrl + 'images/ajax-loaderTable.gif" /></td></tr>');
       // $('#' + div + " .universalTableAdmin").fadeIn(1000);
        
        $.get( absoluteUrl + $(this).attr("href"), function(data){
            $('#loadingBook').remove();
            $('#' + div).html(data);
        });
        return false;
    });
            
    //TABLE MANIPULATION TILL HERE 
    
    
    
    
    //LANGUAGE CHANGE
    $('#langName').livequery('change', function(){
        ajaxEvent();
        langcode = $(this).attr("value");
        $.post(absoluteUrl + "creator/change-language/code/" + langcode, function(data) {
            //alert($('#deletePage').css("display"));
            if($('#deletePage').css("display") != 'none'){
                  //Otvaranje strane koja je bila otvorena pre promene languagea
                  $.getJSON(absoluteUrl + "page/open/id/" + $("#pgID").html(), function(data){
                      //alert(data.category);
                      //jsin = eval("(" + data + ")" );
                      //alert(jsin.output);
                      $('#categoryNameAssign').prop("value" , data.category);
                      $('#pageImage').prop("value" , data.image);
                      $('#pageDescription').prop("value" , data.description);
                      $('#pageKeywords').prop("value" , data.keywords);
                      $('#templateID').html(data.template_id);
                      $('#templateChanger').prop("value" , data.template_id);
// alert('ej3' + data.pageTitle);
 $('#templateChanger').prev('span').text($('#templateChanger').find(":selected").text() );
                      $('#pageTitle').prop("value", data.pageTitle);
                      
                      $('#allowedRolesDiv').html( data.rolesAllowed );
                      //CHECK ACCESS setting
                      if(data.check_access == 1){
                          $('#restrictiveCB').prop('checked','checked' );
                          $('#openPagePermisions').show();
                      } else {
                          $('#restrictiveCB').prop('checked','' );
                          $('#openPagePermisions').hide();
                      }

                      //BOUNDED TO CONTENT AREA setting
                      if(data.unbounded == 0){//if should be inside content area only
                          $('#boundCB').prop('checked','checked' );
                      } else {//if absolutely positioned on the page
                          $('#boundCB').prop('checked','' );
                      }
                                            
                      $('#droppable').css("display", "none");
                      if(data.output){
                          $('#droppable').html(data.output).fadeIn();
                      
                          $(".draggable").draggable({
                              drag:function() {
                              id = $(this).attr("id");
                              },
                          containment: 'parent' 
                          });
                          
                          $('#objList').html("");
                          $('.draggable').each(function(){
                              $(this).removeClass("inactiveObject");
                              $('#objList').append('<option>' + $(this).attr("id") + '</option>');
                          });
                      }
                  //redrawMenus();
                  refreshControls();
                  //ajaxEmitMessage(lang.PageOpened);
                  //setTimeout("$('#ajaxEventMask').click()", 1000);
                  });//end za otvaranje strane
            } else {//END AKO JE PAGE
                  
                //templateReopenAfterLanguage();
                loadTemplate($('#templateIDediting').html());          
            
            } //END AKO JE TEMPLATE
            $('#clearPage').click();
            //alert(data);
            ajaxEmitMessage(data);
            setTimeout("$('#ajaxEventMask').click()", 1500);  
        });
        ajaxEventDone(lang.LChange);     
    });
    //LANGUAGE CHANGE TILL HERE     

    
    
    //EMPTY CACHE
    $('#emptyCacheButton').livequery('click', function(){
        $.post(absoluteUrl + "creator/clean-cache/", function(data) {
            //$('#clearPage').click();
            //alert(data);
            ajaxEmitMessage(data);
            setTimeout("$('#ajaxEventMask').click()", 1000);                
        });    
    ajaxEventDone(lang.CClean);  
    });
    
    //GENERATE CACHE
    $('#generateCacheButton').livequery('click', function(){
        var confir = confirm(lang.GCacheAYS);
        if (confir == true) {
            ajaxEvent();        
            
            $.post(absoluteUrl + "creator/generate-cache/", function(data) {
                //$('#clearPage').click();
                ajaxEmitMessage(data);        
                setTimeout("$('#ajaxEventMask').click()", 1000);
            });
            ajaxEventDone(lang.PW);
        } else {
                setTimeout("$('#ajaxEventMask').click()", 500);        
        }    
    
    });       
    showFooterChecked = 1;
    //SHOW FOOTER CHECKBOX
    $('#showFooterCheck').livequery('click', function(){
        //showFooterChecked = $(this).attr("checked");
        
        if(showFooterChecked == 1) {
            $('.footer').show('slow');
            $('.ajax-loader').show('slow');
            showFooterChecked = 0;
        } else {
            $('.footer').hide('slow');
            $('.ajax-loader').hide('slow');
            showFooterChecked = 1;
        }
    });

    //DELETING PAGE AND TEMPLATE
    $('#deletePage').livequery('click',function(){
        var confir = confirm(lang.AYS);
        if (confir == true) {
        ajaxEvent();
            $.post(absoluteUrl + "page/delete-page/pid/" + $('#pgID').html(), function(data) {
                $('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
                    
            });
            ajaxEventDone(lang.Deleting); 
        }    
    });

    $('#deleteTemplate').livequery('click',function(){
        var confir = confirm(lang.AYS);
        if (confir == true) {
        ajaxEvent();
            $.post(absoluteUrl + "page/delete-template/tid/" + $('#templateIDediting').html(), function(data) {
                $('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
                    
            });
            ajaxEventDone(lang.Deleting); 
        }    
    });    
    
    
    //INSTALL MODULE link
    $('#installModulesLink').livequery('click', function(){
        hrefVal = $(this).attr("href");
        $.post(absoluteUrl + hrefVal, function(data){
            ajaxEmitMessage(data);
            setTimeout("$('#ajaxEventMask').click()", 1000);        
        });
        ajaxEventDone(lang.PW); 
    });    
    //DELETE MODULE link
    $('#delModulesLink').livequery('click', function(){
        ajaxEvent();
        hrefVal = $(this).attr("href");
        $.post(absoluteUrl + hrefVal, function(data){
            ajaxEmitMessage(data);
            setTimeout("$('#ajaxEventMask').click()", 1000);        
        });
        ajaxEventDone(lang.PW); 
    }); 

    //THEME FOR THE OBJECT
    $('#objTheme').livequery('change', function(){
        //alert($(this).val());
        selectedId = $('#objList').val();
        //alert(selectedId);
        $('#' + selectedId).removeClass("noTheme");
        $('#' + selectedId).removeClass("silverTheme");
        $('#' + selectedId).removeClass("greenTheme");        
        $('#' + selectedId).removeClass("redTheme");        
        $('#' + selectedId).removeClass("blueTheme");
        $('#' + selectedId).removeClass("whiteTheme");
        $('#' + selectedId).removeClass("blackTheme");
        
        $('#' + selectedId).addClass($(this).val()+ "Theme");        
    });
    
    $('#logout').livequery('click', function(){
        //$.get(absoluteUrl + 'user/logout/',function(){
        //    document.location.href = absoluteUrl + 'user/logout/';
        //});//ovo treba ispraviti
    });
    
    //CHANGING DEFAULT TEMPLATE
    $('#templateDefaultCB').livequery('change', function(){
        //alert($(this).attr("checked") );
    });
    
    //BACKUP OF THE SITE
    $('#backupSiteButton').livequery('click', function(){
        ajaxEventDone(lang.GBackup);
        $.get(absoluteUrl + "creator/backup-site", function(data){
            //alert("BackedUp");
            ajaxEmitMessage(data);
            setTimeout("$('#ajaxEventMask').click()", 1000); 
        });
    });
    
    //SETTING PERMISSIONS
    $('#restrictiveCB').livequery('click', function(){
        pageId = $('#pgID').html();
        //alert('ja');//alert($(this).attr('checked'));
        if($(this).prop('checked') == true){
            ajaxEvent();            
            $('#openPagePermisions').show();
            $.post(absoluteUrl + "creator/set-check-access/rtype/page/chkacc/1/id/" + pageId, function(data){
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000); 
            });
            ajaxEventDone(lang.PW);
        } else {
            ajaxEvent();  
            $('#openPagePermisions').hide();
            $.post(absoluteUrl + "creator/set-check-access/rtype/page/chkacc/0/id/" + pageId, function(data){
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000); 
            });
            ajaxEventDone(lang.PW);
        } 
    });
    
    
    $('#openPagePermisions').livequery('click', function(){
        $('#permissionsForm').remove();
        $('#dialogDiv').remove();
        $('body').append('<div id="dialogDiv"></div>');
        dialog(); 
        $('#dialogDiv').html( $('#adminAjaxLoader').html() );
        pageId = $('#pgID').html();
              
        $.get(absoluteUrl + "creator/set-permissions/rtype/page/id/" + pageId, function(data){
            //alert(data);
            $('#dialogDiv').html( data);
        });
        $('#dialogDiv').show('slow');
    });
    
    $('#catItems').livequery('change', function(){
        //alert($(this).val());
    });    

    //BOUND TO CONTENT AREA
    $('#boundCB').livequery('click', function(){
        pageId = $('#pgID').html();
        //alert('ja');//alert($(this).attr('checked'));
        if($(this).prop('checked') == true){//if should be inside content area
            ajaxEvent();            
            $.post(absoluteUrl + "creator/set-bound/val/0/page/" + pageId, function(data){
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000); 
            });
            ajaxEventDone(lang.PW);
        } else {
            ajaxEvent();  
            $.post(absoluteUrl + "creator/set-bound/val/1/page/" + pageId, function(data){
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000); 
            });
            ajaxEventDone(lang.PW);
        } 
    }); 

    $('.paginationStep').livequery('change', function(){
        psId = $(this).attr('id');
        psValue = $(this).val();
        $.post(absoluteUrl + 'creator/change-pagination-step/pagid/' + psId + '/val/' + psValue, function(data){
            replaced = psId.replace(/paginationStep_/, "");
            //$.get(absoluteUrl + 'creator/paginate-table/tid/'+ replaced, function(data){
            //    alert(data);
            //});
        });
        
    });    
    
    
    //Checkboxes in manage pages table
    $('.chk_all').livequery('click', function(){
        checkedAll = $(this).prop('checked');
        if(checkedAll == true){
            $('.chk_page').each(function(){
                $(this).prop('checked', 'checked');
                $(this).closest('span').addClass('checked');
            });
        } else {
            $('.chk_page').each(function(){
                $(this).prop('checked', '');
                $(this).closest('span').removeClass('checked');
            });        
        
        }
    });
    
    //tree display
    $("#tree").livequery(function(){
      $(this).treeview({
        	collapsed: true,
        	animated: "medium",
        	//control:"#sidetreecontrol",
        	persist: "location"
      });
   });

    //DELETING SINGLE PAGE from Manage all pages
    $('.a_deleteManage').livequery('click',function(){
        var confir = confirm(lang.AYS);
        pid = $(this).attr('id');
        if (confir == true) {
        ajaxEvent();
            $.post(absoluteUrl + "page/delete-page/pid/" + pid , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
         refreshManageAllPagesTable();//refresh table                     
            });
            ajaxEventDone(lang.Deleting); 
        }    
    });     

    //TOGGLE PUBLISHED from Manage all pages
    $('.publish').livequery('click',function(){
        var confir = confirm(lang.AYS);
        pid = $(this).attr('value');
        if (confir == true) {

                if($(this).hasClass('a_published')){
                    $(this).removeClass('a_published');
                    $(this).addClass('a_unpublished');
                    pubval = 0;
                } else {
                    $(this).removeClass('a_unpublished');
                    $(this).addClass('a_published');
                    pubval = 1;                
                }
                
        ajaxEvent();
            $.post(absoluteUrl + "page/toggle-published/pid/" + pid + '/pubval/' + pubval, function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Changing); 
        }

        return false;   
    });  


    //DELETE ALL SELECTED PAGES from Manage all pages
    $('.deleteAll').livequery('click',function(){
        var confir = confirm(lang.AYSdelPag);

        if (confir == true) {
              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              //alert(ar);
                
        ajaxEvent();
            $.post(absoluteUrl + "page/delete-pages-selected/pids/" + ar  , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Deleting); 
        

        }

        return false;   
    }); 



    //set unPUBLISHED all SELECTED from Manage all pages
    $('.unpublishAll').livequery('click',function(){
        var confir = confirm(lang.AYS);

        if (confir == true) {
              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              //alert(ar);
                
        ajaxEvent();
            $.post(absoluteUrl + "page/toggle-published-selected/pids/" + ar + '/pubval/0/' , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Changing); 
        

        }

        return false;   
    });  
    
    //set PUBLISHED all SELECTED from Manage all pages
    $('.publishAll').livequery('click',function(){
        var confir = confirm(lang.AYS);

        if (confir == true) {
              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              //alert(ar);
                
        ajaxEvent();
            $.post(absoluteUrl + "page/toggle-published-selected/pids/" + ar + '/pubval/1/' , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Changing); 
        

        }

        return false;   
    }); 

    //TOGGLE CHECK ACCESS from Manage all pages
    $('.access').livequery('click',function(){
        var confir = confirm(lang.AYS);
        pid = $(this).attr('value');
        if (confir == true) {

                if($(this).hasClass('a_chkAccess1')){
                    $(this).removeClass('a_chkAccess1');
                    $(this).addClass('a_chkAccess0');
                    accval = 0;
                } else {
                    $(this).removeClass('a_chkAccess0');
                    $(this).addClass('a_chkAccess1');
                    accval = 1;                
                }
                
        ajaxEvent();
            $.post(absoluteUrl + "page/toggle-check-access/pid/" + pid + '/accval/' + accval, function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Changing); 
        }

        return false;   
    }); 



    //set unRESTRICTED all SELECTED from Manage all pages
    $('.unrestrictAll').livequery('click',function(){
        var confir = confirm(lang.AYS);

        if (confir == true) {
              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              //alert(ar);
                
        ajaxEvent();
            $.post(absoluteUrl + "page/toggle-restrict-selected/pids/" + ar + '/pubval/0/' , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Changing); 
        

        }

        return false;   
    });  
    
    //set RESTRICTED all SELECTED from Manage all pages
    $('.restrictAll').livequery('click',function(){
        var confir = confirm(lang.AYS);

        if (confir == true) {
              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              //alert(ar);
                
        ajaxEvent();
            $.post(absoluteUrl + "page/toggle-restrict-selected/pids/" + ar + '/pubval/1/' , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
        refreshManageAllPagesTable();//refresh table         
            });
            ajaxEventDone(lang.Changing); 
        

        }

        return false;   
    }); 

    
    //set permissions to all SELECTED from Manage all pages
    $('.setPermissionsAll').livequery('click',function(){

              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              $('#dialogDiv').remove();
              $('body').append('<div id="dialogDiv" style="z-index:999999 !important;"></div>');
              dialog();
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );           
            $.get(absoluteUrl + "page/set-permissions/pids/" + ar , function(data) {
                  $('#dialogDiv').html(data);       
            });
              $('#dialogDiv').show('slow');
      
        return false;   
    }); 
    //export to FTP from Manage all pages
    $('.exportToFTP').livequery('click',function(){

              ar = new Array();
              $('.chk_page').each(function(){
              //alert($(this).attr('checked') );
                  pid = $(this).prop('checked');
                  if(pid == true){
                    ar.push($(this).attr('value')); 
                  }
              });
              $('body').append('<div id="dialogDiv" style="z-index:9999999"></div>');
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );           
            $.get(absoluteUrl + "exportsite/export-pages/pids/" + ar , function(data) {
                  $('#dialogDiv').html(data);       
            });
              $('#dialogDiv').show('slow');
      
        return false;   
    }); 

    //TOGGLE HOMEPAGE from Manage all pages
    $('.homepage').livequery('click',function(){
        var confir = confirm(lang.AYS);
        pid = $(this).attr('value');
        if (confir == true) {
                if($(this).hasClass('a_published')){
                    $(this).removeClass('a_published');
                    $(this).addClass('a_unpublished');
                    pubval = 0;
                } else {
                    $(this).removeClass('a_unpublished');
                    $(this).addClass('a_published');
                    pubval = 1;                
                } 
        ajaxEvent();
            $.post(absoluteUrl + "page/set-homepage/pid/" + pid , function(data) {
                //$('#clearPage').click();  
                ajaxEmitMessage(data);
                setTimeout("$('#ajaxEventMask').click()", 1000);
                refreshManageAllPagesTable();//refresh table                      
            });
            ajaxEventDone(lang.PW); 
        }

        return false;   
    }); 
    
    $('#helpButton').livequery('click', function(){
        $('#helpDiv').toggle(1500);
        document.cookie = 'enableHelp=' + $('#helpDiv').css("opacity") + ';  path=/'; //cookie za help
    });
    
    //help system
    $('.help').livequery('mouseover', function(){
        if($(this).attr('description')){ desc = $(this).attr('description'); } else {desc = "";}
        if($(this).attr('title')){ tit = $(this).attr('title'); } else {tit = "";}
        $('#helpDiv').html( tit + '<p>' + desc + '</p>' );
    });
    $('#rotate a').each(function(){
        $(this).addClass('help');
    });
    $('#rotate select').each(function(){
        $(this).addClass('help');
    });
    
    //editModules link - dealing with module settings
    $('#editModulesLink').livequery('click', function(){
        $('#dialogDiv').remove();
        $('body').append('<div id="dialogDiv"></div>');
        dialog(); 
        $('#dialogDiv').html( $('#adminAjaxLoader').html() );
        $('#dialogDiv').show();       
        $.get(absoluteUrl + $(this).attr("href") +  $('#moduleName').val(), function(data){
              $('#dialogDiv').html( data);
              
        });
    });

    $('#ftpform').livequery(function(){
        $(this).ajaxForm(function(data){
            //alert(data);
           $('#dialogDiv').html(data);
           // refreshManageAllPagesTable();//refresh table                   
           // ajaxEmitMessage(data + " allowed!");
            setTimeout("clickMask()", 1000); //closing all
           // $('#dialogDiv').remove();  
        });
    }); 
    

    //$('select, input[type="text"], textarea, input[type="radio"], input[type="checkbox"]').livequery(function(){$(this).uniform();}); 
     
    $('#objList option').livequery('dblclick', function(){
     //alert('a');
     //$('#objPropertiesHtmlTiny_fullscreen').click();
     tinyMCE.execCommand('mceFullScreen');
    });
    //alert($.browser.msie);
    
    //FULSCREEN ZA CODEPRESS
   // $('.cssjswrapp').dblclick(function(){

/* 
Native FullScreen JavaScript API
-------------
Assumes Mozilla naming conventions instead of W3C for now
*/

isFS = 0;
// do something interesting with fullscreen support
var fsButton = document.getElementById('fsbutton');
	fsElement = document.getElementById('fragment-7wrapper');

var fsButton2 = document.getElementById('fsbutton2');
	fsElement2 = document.getElementById('fragment-8wrapper');


var fsButton3 = document.getElementById('fsbutton3');
	fsElement3 = document.getElementById('fragment-5wrapper');  	
	//fsStatus = document.getElementById('fsstatus');

(function() {
	var 
		fullScreenApi = { 
			supportsFullScreen: false,
			isFullScreen: function() { return false; }, 
			requestFullScreen: function() {}, 
			cancelFullScreen: function() {},
			fullScreenEventName: '',
			prefix: ''
		},
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');
	
	// check for native support
	if (typeof document.cancelFullScreen != 'undefined') {
		fullScreenApi.supportsFullScreen = true;
	} else {	 
		// check for fullscreen support by vendor prefix
		for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
			fullScreenApi.prefix = browserPrefixes[i];
			
			if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
				fullScreenApi.supportsFullScreen = true;
				
				break;
			}
		}
	}
	
	// update methods to do something useful
	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
		
		fullScreenApi.isFullScreen = function() {
			switch (this.prefix) {	
				case '':
					return document.fullScreen;
				case 'webkit':
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + 'FullScreen'];
			}
		}
		fullScreenApi.requestFullScreen = function(el) {
		//isFS = 2;
			return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
		}
		fullScreenApi.cancelFullScreen = function(el) {
		  //isFS = 3;
		  $(fsElement).addClass('fs').find('iframe').height(150);
			return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
		  
    }		
	}

	// jQuery plugin
	if (typeof jQuery != 'undefined') {
		jQuery.fn.requestFullScreen = function() {
	
			return this.each(function() {
				var el = jQuery(this);
				if (fullScreenApi.supportsFullScreen) {
					fullScreenApi.requestFullScreen(el);
				}
			});
		};
	}

	// export api
	window.fullScreenApi = fullScreenApi;	
})(); 
	
	// handle button click CSS
	fsButton.addEventListener('click', function() {
		window.fullScreenApi.requestFullScreen(fsElement);
		$(fsElement).addClass('fs').find('iframe').height($(window).height());
			//$(fsElement).resizable();
		//$(fsElement).addClass('fs').find('iframe').height($(fsElement).height()-20);
		//$(fsElement).height($(window).height());
		//$(fsElement).css({height:"800px"});
	}, true);
	//JS
	fsButton2.addEventListener('click', function() {
		window.fullScreenApi.requestFullScreen(fsElement2);
		$(fsElement2).addClass('fs').find('iframe').height($(window).height());
	}, true);
	//modules
	fsButton3.addEventListener('click', function() {
		window.fullScreenApi.requestFullScreen(fsElement3);
		$('.ui-dialog').livequery(function(){
		    if(window.fullScreen == 1){
           $(this).appendTo(fsElement3);
        } 
    });
		//$(fsElement3).addClass('fs').height($(window).height());
	}, true);

//install/export template
          //Exporting a template for use on another server
          $('#exportTemplate').click(function(){
              $('#dialogDiv').remove();         
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              
              $.get(absoluteUrl + "page/export-template/id/" + $('#templateIDediting').html(), function(data){                  
                  $('#dialogDiv').html(data);
              });
              $('#dialogDiv').show('slow');
          

          });           
          
          
          //Installing exported template
          $('#installTemplate').click(function(){
               $('#dialogDiv').remove();             
              $('body').append('<div id="dialogDiv"></div>');
              dialog(); 
              $('#dialogDiv').html( $('#adminAjaxLoader').html() );
              // $('#dialogDiv').show();
               
              $.get(absoluteUrl + "page/install-template/", function(data){                  
                  $('#dialogDiv').html( data);
                  //alert(data);
                  $('#ajaxEventMask').remove();


              });
              //$('#dialogDiv').show('slow');
           

          }); 
/*          
    $('#uploadTemplateForm').livequery(function(){
        $(this).ajaxForm(function(data){
        alert(data);
                  $('#ajaxEventMask').remove();
                      $.fancybox({
                        content:data,  parent : "body", 
                        wrapCSS:'fbox', padding:0,  
                        autoCenter :true, autoSize:false ,
                        height:'355px', width: '530px', topRatio :0.5,  index:99999,
                        helpers: {overlay : { closeClick : false }  }
                        }) ;
            //$('#dialogDiv').html('<div id="closeDialogDiv"></div>' + data);
            //ajaxEmitMessage(lang.FileUploaded);
            //setTimeout("$('#ajaxEventMessage').fadeOut(1000)", 1000);


              
        });
        
    });    
*/
/* ERROR HANDLING for development only
$(function () {
    //setup ajax error handling
    $.ajaxSetup({
        error: function (x, status, error) {
            if (x.status == 403) {
                alert("Sorry, your session has expired. Please login again to continue");
                window.location.href ="/Account/Login";
            }
            else {
                alert("An error occurred: " + status + "\nError: " + error);
            }
        }
    });
});

*/

    $('#chooseTemplateRevisionForm').livequery(function(){
     $(this).attr('action', $(this).attr('action') + 'file/' + $('#revisionSelect option:selected').text() );
        $(this).ajaxForm(function(data){
        //alert(data);
            //$('#uploadTemplateForm').html(data);
            ajaxEmitMessage(lang.TemplateInstalled );
            //setTimeout("$('#ajaxEventMessage').fadeOut(1000)", 1000);
            $('#dialogDiv').remove();
            //$('#folderNames').change();
            //alert(data);
            //ajaxEmitMessage(lang.FileUploaded);
            setTimeout("clickMask()", 1000); //closing all  
        }); 
    });

    $('#ajaxEventMessage').livequery('click', function(){ 
        $('#ajaxEventMessage').remove();
    });

//UPDATING CHECKBOXES, COMBOBOXES
$('select#objList').livequery('change', function(){
    //alert($(this).val() );
    $('input[type="checkbox"]').each(function(){
    if($(this).prop('checked') == true ) {
      // $(this).closest('span').addClass('checked');
       //alert(this.id);
    }  else{
       // $(this).closest('span').removeClass('checked');
    }  
    });
});
$('input[type="checkbox"]').livequery(function(){


});

$('#contProperties').draggable();

$('#enableModulesLink').click(function(){
    url = $(this).attr('href');
    $.get(url,function(data){alert(data) ; });
});