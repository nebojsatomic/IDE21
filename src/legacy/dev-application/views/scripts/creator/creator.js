// JavaScript for creator
/**
* IDE21 Content Management System
*
* @category   Creator JavaScript
* @package    IDE21
*  Copyright (C) 2010-present  Nebojsa Tomic (nebojsatmc@gmail.com)
*
*  This file is part of IDE21.
*
*  IDE21 is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*
*
*
*/
jQuery.extend({
  handleError: function( s, xhr, status, e ) {
    // If a local callback was specified, fire it
    if ( s.error )
    s.error( xhr, status, e );

    // If we have some XML response text (e.g. from an AJAX call) then log it in the console
    else if(xhr.responseText)
    console.log(xhr.responseText);

  }
});
$('.navLinks').click( function(){
  $('.currentTitle').removeClass('currentTitle');
  $(this).addClass('currentTitle');
});
function dialog(){

  if (screen.width == window.innerWidth && screen.height == window.innerHeight) {
    //full web browser
    isFS = 2;
  } else {
    isFS = 0;
  }

  $( "#dialogDiv" ).dialog({modal:false, resizable: false, title:$('.currentTitle').text() });
}

// change behaviour of edit object button from version 24.05: this button and some other buttons should appear above the currently selected object
function showEditObjectButtons(obj){
  // place pointer above the selected object on the top left
  if( typeof $('#'+ obj ).offset() == 'undefined' ) return;
  let adjustTopPosition = 30;
  if( $('#'+ obj ).offset().top < 70 ) adjustTopPosition = 0;

  $('#movePointer').css({left: $('#'+ obj ).offset().left + 'px',top: $('#'+ obj ).offset().top  - adjustTopPosition + 'px'}).fadeIn();
  $('#dropPointer').css({left: $('#'+ obj ).offset().left + 40 + 'px',top: $('#'+ obj ).offset().top  - adjustTopPosition + 'px'}).fadeIn();
  $('#moveUpPointer').css({left: $('#'+ obj ).offset().left + 80 + 'px',top: $('#'+ obj ).offset().top  - adjustTopPosition + 'px'}).fadeIn();
  $('#moveDownPointer').css({left: $('#'+ obj ).offset().left + 120 + 'px',top: $('#'+ obj ).offset().top  - adjustTopPosition + 'px'}).fadeIn();
}

function doLightBox(){
  //LB u slideu  mora opet
  $('#manageAllPages').livequery('click', function(){
    $('.TB_overlayBG').css({zIndex:"999997"});
    $('#TB_window').css({zIndex:"999999"});
  });
}

function saveCSSandJS(){
  if(codepressOff == true) {
    $('#pageCSSC').val( $('#pageCSS').val() );
    $('#pageJSC').val( $('#pageJS').val() );
  } else {
    $('#pageCSSC').val( pageCSS.getCode() );
    $('#pageJSC').val( pageJS.getCode() );
  }
}

function ajaxEvent(){
  $('#dialogDiv').css({left:$(window).width()/2, top:$(window).height()/4});
}
message = "";
function ajaxEventDone(message){

  $('body').append('<div id="ajaxEventMessage" role="alert" class="fixed inset-0 w-72 h-24 mx-auto my-auto alert alert-success bg-accent text-accent-content"  style="display:none;opacity:0.9;z-index:999999;"><svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>' +  message + '</span></div>');
  $('#ajaxEventMessage').fadeIn(1000);
  setTimeout("$('#ajaxEventMessage').fadeOut()", 3000);
}

function ajaxEmitMessage(emitMessage){
  $('#ajaxEventMessage').html( '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>' + emitMessage + '</span>');
  //setTimeout("$('#ajaxEventMessage').fadeOut()", 1000);
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

  $('#objListForCss').html($('#objList').html() );//css
  $('#objListForCss').prepend('<option selected="selected"></option>');

  $('#objListForJs').html($('#objList').html() );//js
  $('#objListForJs').prepend('<option selected="selected"></option>');

}
function unhideOverflowMenus(){
  $(".draggable").each(function(){

    if ($(this).attr("objtype") == "Menu"  ){
      $(this).css("overflow", "visible");
    }
  });

}

function redrawMenus(){

  $(".draggable").each(function(){

    if ($(this).attr("objtype") == "Menu"  ){

      tvId = $(this).attr("id");

      var tvCommand = "{" + $(this).attr("command") + "}";

      $.post(absoluteUrl + "view/render-tv/var/" + tvCommand  , function(data){
        $('#' + tvId ).html(data);
      });
    }
  });

}

function showConfirm(linkId){
  var r = confirm(lang.AYS);
  if (r == true){
    alert($('#' + linkId).attr("href") );
  }
}

function floatProperties(){
  var name = "#contProperties";
  var menuYloc = null;

  menuYloc = parseInt($(name).css("top").substring(0,$(name).css("top").indexOf("px")));
  $(window).scroll(function () {
    offset = menuYloc+$(document).scrollTop()-100 + "px";

    $(name).animate({bottom:offset},{duration:500,queue:false});
  });

}

/**
*Function that refreshes table in the 'Manage all pages'
*
*/
function refreshManageAllPagesTable()
{
  idCurrent = $('#paginationControl span.current').html();

  if(!idCurrent){idCurrent = 1;}
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

function templateReopenAfterLanguage(){

  if($('#templateMask').length < 1){
    $('body').append('<div id="templateMask"></div>');
  }

  $.getJSON(absoluteUrl + "page/apply-template/id/" + $("#templateIDediting").html(), function(data){

    $('#templateMask').empty();

    $('#templateTitle').val( data.title);//templateName
    if(data.bodyBg){
      $('#template_bodyBg').prop("value", data.bodyBg);//template body BG

      $('body').css({background:data.bodyBg});

    }
    if(data.defaultTemplate == "1"){chck = "checked";} else {chck = "";}
    $('#templateDefaultCB').prop("checked", chck);//templateDefault

    $('#templateMask').html(data.output).fadeIn(1500);
    $('#templateMask').appendTo($('#droppable')).css({left: "0px"});
    $(".templateDiv").each(function(){

    });

    /*$(".draggable").draggable({
      drag:function() {
        id = $(this).attr("id");
      }
      //containment: 'parent'
    }); // D */

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
//body streching depending on the template
function bodyStrech(){
  $("body").css("background-size" , "100%");
}
// and the oposite, enabling the body bg repeat
function removeBodyStrech(){
  $("body").css("background-size" , "");
}
/*get cookie values*/
function getCookie(c_name){
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

  templSel = idT;

  $.getJSON(absoluteUrl + "page/apply-template/id/" + templSel, function(data){

    $('#templateMask').empty();

    $('#templateTitle').val( data.title);//templateName
    if(data.bodyBg){
      $('#template_bodyBg').prop("value", data.bodyBg);//template body BG

      bg = data.bodyBg.replace(/;background-size:100%;/g, "");

      splBG = bg.split(';');
      $(splBG).each(function(k,v){
        splRule = v.split(':');
        if(splRule[1]){

          $('body').css(splRule[0], splRule[1]);
        }
        if(k == 0) {$('body').css("background" , v);}

      });
    }

    if(data.defaultTemplate == "1"){chck = "checked";} else {chck = "";}
    $('#templateDefaultCB').prop("checked", chck);//templateDefault

    $('#templateMask').html(data.output).fadeIn(1500);
    $('#templateMask').appendTo($('#droppable')).css({left: "0px"});
    $(".templateDiv").each(function(){

    });

    /*$(".draggable").draggable({
      drag:function() {
        id = $(this).attr("id");
      }
      //containment: 'parent'
    }); // D */

    $('#objList').html("");
    //$('.draggable').each(function(){
    $('#templateMask *').each(function(){
      const objID = $(this).attr("id");

      if(typeof $(this).attr("id") === 'undefined') return;
      $(this).removeClass("inactiveObject");
      $('#objList').append('<option>' + $(this).attr("id") + '</option>');
    });

    refreshControls();
    ajaxEmitMessage(lang.Done);
    setTimeout("$('#ajaxEventMask').click()", 1000);

  });

  $('#templateIDediting').html(idT);
  document.cookie = 'templateSelectedId=' + idT + ';  path=/'; //needs improvement
}

function loadPage(idP){
  $('#templateMask').empty();
  $('#droppable').empty();

  $('#pgID').html(idP);

  $.getJSON(absoluteUrl + "page/open/id/" + idP, function(data){

    $('#categoryNameAssign').prop("value" , data.category);

    $('#categoryNameAssign').prev('span').text($('#categoryNameAssign').find(":selected").text() );

    $('#pageImage').prop("value" , data.image);
    $('#pageDescription').prop("value" , data.description);
    $('#pageKeywords').prop("value" , data.keywords);
    $('#templateID').html(data.template_id);
    $('#templateChanger').prop("value" , data.template_id);
    $('#templateChanger').prev('span').text($('#templateChanger').find(":selected").text() );
    $('#pageTitle').prop("value", data.pageTitle);

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

    /*$(".draggable").draggable({
      drag:function() {
        id = $(this).attr("id");
      },
      containment: 'parent'
    }); // D */

    $('#objList').html("");
    $('.draggable').each(function(){
      $(this).removeClass("inactiveObject");
      $('#objList').append('<option>' + $(this).attr("id") + '</option>');
    });

    refreshControls();

  });

  document.cookie = 'pageSelectedId=' + idP + ';  path=/'; //needs improvement
}

$('#droppable *').livequery('click', function(e){
  const hasTemplateParent = $(e.target).closest('#droppable');
  $('.selected-for-append').removeClass('selected-for-append');
  if(!$(e.target).hasClass('movable')){
    $('#movePointer').removeClass('bg-green-400');
  } else {
    $('#movePointer').addClass('bg-green-400');
  }

  if (hasTemplateParent.length < 1 ) return;
    // continue only if it is a part of the template or page working area

  $(e.target).addClass('selected-for-append');
  //$(e.target).addClass('selected-droppable');
  const contentsToName = $(e.target).text().replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '').substring(0, 15).toLowerCase(); // append this string to id of the object, to be able to see which one it is just by looking in the object list

  const selectedObjectNewID = $(this).get(0).localName + '_sel_' + Math.floor(Math.random() * 10000) + '_' + contentsToName;

  if(typeof $(e.target).attr('id') != 'string'){

    $(e.target).attr('id', selectedObjectNewID );
    $('#objList').append('<option>' + selectedObjectNewID + '</option>');

  }

  if( $('#objList option:contains(' + $(e.target).attr('id') + ')').length == 0) {
    $('#objList').append('<option>' + $(e.target).attr('id') + '</option>');
  }

  $('#objList').val( $(e.target).attr('id') ).change();

  $('#objIDshow').html($(e.target).attr('id'));
  $('#objProperties').data("objid", $(e.target).attr('id') );
  e.preventDefault();
  $(e.target).attr('contenteditable', 'true').focus();// edit in place

  // if there was ID assistant active, trigger redraw of classes, and disable mouseover event until the next object is selected
  if($('#tooltip').css('display') != 'none') {
    $(e.target).trigger('mouseover');
    $(e.target).addClass('tooltip-freeze');
  }
});

$('.object-buttons').livequery('mouseover', function(){
  $(this).addClass('hovered');
});
$('.object-buttons').livequery('mouseout', function(){
  $(this).removeClass('hovered');
});

$('#droppable *').livequery('blur', function(e){
  $(e.target).attr('contenteditable', 'false');
  $('.tooltip-freeze').removeClass('tooltip-freeze');

  if(!$('.object-buttons').hasClass('hovered')) $('.object-buttons').hide();

});

// reset selected-for-append
$('.navbar, #contProperties').click( function(){
  //$('.selected-for-append').removeClass('selected-for-append');
});

$(document).ready(function(){
  const simpleBar = new SimpleBar(document.getElementById('containerRadnePovrsine'));
  simpleBar.getScrollElement().addEventListener('scroll', function(){
    if( typeof $('.selected-for-append').offset() == 'undefined' ) return;

    let adjustTopPosition = 30;
    if( $('.selected-for-append').offset().top < 70 ) adjustTopPosition = 0;

    $('#movePointer, #dropPointer, #moveUpPointer, #moveDownPointer').css({
      top: $('.selected-for-append').offset().top - adjustTopPosition + 'px'
    });
    /*$('#tooltip').css({
      top: $('.selected-for-append').offset().top + $('.selected-for-append').outerHeight() + 'px'
    });*/
  });
  //idCurrent = 1;
  drOff = $('#droppable').position().left;

  if(getCookie("enableHelp") == "0"){
    $('#helpDiv').show();
  } else {
    $('#helpDiv').hide();
  }

  //$('#droppable').resizable({autohide:true});

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

  $('#saveCssCodeA').click(function(){
    const editorCSSValue = editorCSS.getValue();
    $('#pageCSS').val(editorCSSValue);
    $('#saveThisPage').click();

  });

  $('#saveJsCodeA').click(function(){
    const editorJSValue = editorJS.getValue();
    $('#pageJS').val(editorJSValue);
    $('#saveThisPage').click();
  });

  $('#previewButton').click(function(){
    $(this).attr("href", absoluteUrl + "pages/" + $('#pgID').html());

  });

  //FONT BIGGER
  $('#fontBigger').click(function(){
    fSize =  $( '#' + $('#objProperties').data("objid") ).css("font-size").replace(/px/, '');
    fSize++;

    $('#' + $('#objProperties').data("objid")).css( {fontSize:fSize} );
    $('#' + $('#objIDshow').html() ).css( {fontSize:fSize} );

  });
  //FONT SMALLER
  $('#fontSmaller').click(function(){
    fSize =  $( '#' + $('#objProperties').data("objid") ).css("font-size").replace(/px/, '');
    fSize--;

    $('#' + $('#objProperties').data("objid")).css( {fontSize:fSize} );
  });

  // load tailwindCSS classes to be used for autocomplete
  $.getScript("/daisy/tailwind.classes.js", function(data) {

  });
  //ID ASSISTANT displayed
  tooltipShow = 0;
  $('#droppable *').livequery('mouseover', function(e){
    if (tooltipShow == 1) {

      if($('.tooltip-freeze').length > 0 ) return;
      // find all the classes that object has and put them in an array
      let objectClassesArray = []; // initial empty array
      if( typeof $(e.target).attr('class') != 'undefined' ){
        objectClassesArray = $(e.target).attr('class').split(' '); // if class attribute present, get classes in an array
      }

      let objectClassesFields = ''; // reset for every object

      // go through the classes and create html with checkboxes to enable toggling classes
      $.each( objectClassesArray, function( index, item ){
        let currentClass = item;
        if( currentClass === '' || currentClass == 'selected-for-append') return;

        objectClassesFields = objectClassesFields + '<div class="inline-flex gap-2 items-center max-w-80"><input type="checkbox" class="checkbox-sm classes-toggle" checked="true" value="' + currentClass + '" /><span style="overflow-wrap: break-word;inline-size: 9rem;">' + currentClass + '</span></div>';
      });

      // create the part in ID assistenat that holds classes and their checkboxes
      const objectClasses = '<div class="grid grid-cols-2 gap-2 bg-base p-2">' + objectClassesFields + '</div>';

      // Add New Class input field and button
      const addNewClass = '<div class="grid gap-2"><input id="add-new-class-input" type="text" class="input input-sm mt-2" /><button id="add-new-class" class="btn btn-sm bg-neutral text-neutral-content btn-ghost">Add</button></div>'

      // finaly put it all together
      $('#tooltip').html( '<div id="assistant-target-id" class="text-normal font-semibold">' + $(e.target).attr("id") + '</div>' + objectClasses + addNewClass );

      $('#tooltip').appendTo('#dialogDiv_assistant');

      // add tailwindCSS classes autocomplete
      $('#add-new-class-input').autocomplete({source: tailwindClasses });

      $('#tooltip').show();
    } else {
      $('#tooltip').hide();
    }

  });

  // toggling classes for the object that ID assistant is pointing to
  $('.classes-toggle').livequery('change', function(e){

    if($(e.target).attr('checked') === undefined) {

      $( '#' + $('#assistant-target-id').text()).removeClass($(e.target).val());
    } else {

      $( '#' + $('#assistant-target-id').text()).addClass($(e.target).val());
    }
  });
  $('#add-new-class-input').livequery('keypress', function(e){
    if(e.which == 13) {
      $('#add-new-class').trigger('click'); // add a new class by clicking on a button
      $('#add-new-class-input').focus();
    }
  });

  // add a new class to the object that ID assistant is pointing to
  $('#add-new-class').livequery('click', function(e){
    $( '#' + $('#assistant-target-id').text()).addClass($('#add-new-class-input').val());
    $( '#' + $('#assistant-target-id').text()).trigger('mouseover');
  });

  //TURN ID ASSISTANT on/off
  $('#tttoggle').attr('checked', false); // uncheck by default
  $('#tttoggle').livequery('click', function(){

    if ($(this).prop("checked") == true) {
      tooltipShow = 1;
      // dialog
      $('#dialogDiv_assistant').remove();

      if($('#dialogDiv_assistant' ).length < 1 ){

        $('body').append('<div class="dialogDiv bg-accent text-accent-content" id="dialogDiv_assistant" ><p>Select the object to see its classes</p></div>');
        $('#tooltip').appendTo('#dialogDiv_assistant');

        $('#dialogDiv_assistant' ).dialog({modal: false, resizable: true, title: 'ID Assistant', closeOnEscape: false,
          position: { my: "left top", at: "left bottom", of: '#objList' },
          width: $('#objList').outerWidth(),
          beforeClose: function(event, ui) {
          $('#tooltip').appendTo('body');

        }, close: function(event, ui){

          $('#dialogDiv_assistant').dialog('destroy');
          $('#dialogDiv_assistant').remove();

          $('#tttoggle').attr('checked', false);
        }
        });
        $('#dialogDiv_assistant').show();
      }
      $('#dialogDiv_assistant').show();
    } else {
      tooltipShow = 0;

      $('#tooltip').appendTo('body');
      $('#dialogDiv_assistant').remove();

    }
  });

  //CONTAINER
  objContainer = 0;
  $('#objContainer').livequery('click', function(){

    if ($(this).prop("checked") == true) {
      objContainer = 1;

    } else {
      objContainer = 0;

    }

  });

  //TURN APPLY TO ALL LANGUAGES ON/OFF
  $('#allLangCheck').livequery('click', function(){

    if ($(this).prop("checked") == true) {
      applytoAllLangs = "yes";

    } else {
      applytoAllLangs = "no";
    }
  });

  //TURN APPLY TO ALL LANGUAGES ON/OFF FOR TEMPLATES
  $('#allLangCheckTemplate').livequery('click', function(){

    if ($(this).prop("checked") == true) {
      applytoAllLangsTemplate = "yes";
    } else {
      applytoAllLangsTemplate = "no";
    }
  });

  $('#redraw').livequery('click', function(){
    redrawMenus();

  });
  newIt = 1;
  pageID ="<?php echo $this->pageId;?>";

  selMenuTemplate = "";
  idForRem = "";
  zIndexCounter = 500;// separation from the template

  $('#rotate').tabs();

  $('#poA').click();

  propPos = "visible" ;
  $('#propertiesLeft').fadeOut(4000);
  //$('#contProperties').css({width:"auto", right:"0px", bottom:"0px"});
  $('#toggleProperties').livequery('click', function(){

    if(propPos == "hidden") {
      $('#contProperties').animate({marginRight:0 });
      $('#contProperties').css({display: "grid"}).animate({marginRight:0 });
      propPos = "visible" ;
      $('#containerRadnePovrsine').removeClass('full-width');
    } else {
      $('#contProperties').animate({marginRight:-($('#properties').width()-5 )}).css({display: "none"});
      propPos = "hidden" ;
      //setTimeout(function(){
        $('#containerRadnePovrsine').addClass('full-width');
      //}, 500);
    }

  });

  //DRAGGABLES
  /*$(".draggable").draggable({
    drag:function() {
      //$(this).clone();
      id = $(this).prop("id");
    },
    containment: 'parent'
  }); // D*/

  $(".draggable").each(function(){
    //$('#' +$(this).attr("id") ).resizable();
  });
  $("#droppable").droppable({
    drop: function() {
      if(typeof id === "undefined") return;
      $('#objList').val( $('#' + id).attr("id"));

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

      if(absPosTop < 0 || absPosLeft < 0){
        idForRem = $('#' + id).attr("id");
      }

      $('#' + id).dblclick();

      $('#droppable').css("min-width", $("#bodyWidth").val() );
      $('#droppable').css("min-height", $("#bodyHeight").val() );

    }

  });

  $('#poA').click(function(){
    shouldDisplayMenu = 0;
  });
  //toggle visibility for the textareas with html and style for the object
  $('#toggleVisibilityRowAnchor').click(function(){
    $('#toggleVisibilityRow').toggle();
  });

  $('#objList').livequery('click', function(){
    $('#' + $(this).val() ).dblclick();

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

    //IF THERE IS A SELECTED OBJECT, THEN INSERT AFTER IT, ELSE APPEND TO #droppable
    if ($('.selected-for-append').length > 0) {

      droppableContainer = '.selected-for-append';

      // insert inside selected object - TODO
      //$(droppableContainer).append("\n" + '<div class="draggable" id="net_'+newObjId+'" style="border:1px dotted red;z-index:' + zIndexCounter + '">' + "\n\t" + '<p class="objContent">NeT.Object ' + newObjId + "\n\t" + '</p>' + "\n" + '</div>'+ "\n");

      // insertAfter selected object
      $("\n" + '<div class="draggable" id="net_'+newObjId+'" style="border:1px dotted red;z-index:' + zIndexCounter + '">' + "\n\t" + '<p class="objContent">NeT.Object ' + newObjId + "\n\t" + '</p>' + "\n" + '</div>'+ "\n").insertAfter(droppableContainer);
    } else {

      droppableContainer = "#droppable";
      // insert inside #droppable
      $(droppableContainer).append("\n" + '<div class="draggable" id="net_'+newObjId+'" style="border:1px dotted red;z-index:' + zIndexCounter + '">' + "\n\t" + '<p class="objContent">NeT.Object ' + newObjId + "\n\t" + '</p>' + "\n" + '</div>'+ "\n");

    }

    //IF CONTAINER ON, THEN ADD class IN THE CURRENT OBJECT, ELSE the same
    if (objContainer == 1) {
      $(droppableContainer ).addClass("container");
    } else {}

    $('#objList').append('<option>net_' + newObjId + '</option>');
    /*$('#net_' + newObjId  ).resizable({
      autoHide: true,
      handles: 'all',
      stop: function() {
        $( '#' + $(this).attr("id") ).dblclick();
      }
    });*/

    /*$(".draggable").draggable({
      drag:function() {
        id = $(this).attr("id");
      },
      containment: 'parent'
    }); // D */

    refreshControls();
    $('#net_' + newObjId  ).dblclick();
    newIt++;
    zIndexCounter++;

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

    //IF CONTAINER ON, THEN APPEND IN THE CURRENT OBJECT, ELSE in droppable
    if ($('.selected-for-append').length == 1) {
      droppableContainer = '.selected-for-append';
    } else {
      droppableContainer = "#droppable";
    }

    /*if (objContainer == 1) {
      droppableContainer = '#' + $('#objIDshow').html();
    } else {
      droppableContainer = "#droppable";
    }*/

    // INSIDE selected object - todo
    //$(droppableContainer).append("\n" + '<div class="draggable ' + $('#' + $('#objIDshow').html() ).attr('class') + '" id="net_'+newObjId+'" style="z-index:' + zIndexCounter + $('#' + $('#objIDshow').html() ).attr('style') + ';">' + $('#' + $('#objIDshow').html() ).html() + "\n" + '</div>'+ "\n");

    // AFTER selected object
    // first remove the olds ids for each element inside the cloned one
    const regexForIDs = /id=\"[\S]*\"/g;

    const elementWithNewIDs = $('#' + $('#objIDshow').html() ).get(0).outerHTML.replace( regexForIDs , '').replace('selected-for-append', '');

    $("\n" + elementWithNewIDs + "\n").insertAfter(droppableContainer);
    // insertAfter till here

    //IF CONTAINER ON, THEN ADD class IN THE CURRENT OBJECT, ELSE the same
    if (objContainer == 1) {
      $(droppableContainer ).addClass("container");
    } else {}

    $('#objList').append('<option>net_' + newObjId + '</option>');

    /*$('#net_' + newObjId  ).resizable({
      autoHide: true,
      handles: 'all',
      stop: function() {
        $( '#' + $(this).attr("id") ).dblclick();
      }
    });*/

    /*$(".draggable").draggable({
      drag:function() {
        id = $(this).attr("id");
      },
      containment: 'parent'
    }); // D */

    refreshControls();
    $('#net_' + newObjId  ).css({left:$('#net_' + newObjId  ).position().left + 5, top:$('#net_' + newObjId  ).position().top +5 });
    //$('#net_' + newObjId  ).resizable('destroy');
    $('#net_' + newObjId  ).dblclick();
    newIt++;
    zIndexCounter++;

    return false;
  });

  $('.navLinks').livequery('click', function(){

    return false;
  });

  //Saving a new page
  $('#savePageNew').livequery('click', function(){
    boundCBval = $('#boundCB').val();

    if(boundCBval == 'on') {
      firstObjVal = $('#objList option:first').val();
      $('#' + firstObjVal).css("position", "relative");
      $('#' + firstObjVal).css("min-height", $('#' + firstObjVal).height() + "px" );
      $('#' + firstObjVal).css("height", "auto");
    }
    $(".draggable").each(function(){
      $(this).removeClass("inactiveObject");
      $(this).css("border", "0");
      //$(this).resizable('destroy');

      //if it is a menu write command
      /*if ($(this).attr("objtype") == "Menu"){
        $(this).addClass("menuObj");
        $(this).html( "{" +$(this).attr("command") + "}");

      }*/
      if ($(this).attr("objtype") == "Category"){
        $(this).html( "{" +$(this).attr("command") + "}");
      }

    });
    //$('#droppable').resizable('destroy');
    strCodeP =  $('#droppable').html();
    //$('#droppable').resizable({autohide: true});

    $('#pageCodeHtml').val( strCodeP );
    //$('#pageCodeHtml').val( $('#droppable').html() );

    //description and keywords
    $('#pageDESC').val( $('#pageDescription').val() );
    $('#pageKEYWORDS').val( $('#pageKeywords').val() );

    $('#pageTitleC').val( $('#pageTitle').val() );
    $('#pageCategoryC').val( $('#categoryNameAssign').val() );

    saveCSSandJS();

    $('#pageCode').attr("action", absoluteUrl + "page/save"  );
    $('#pageCode').ajaxSubmit(function(){

      ajaxEmitMessage(lang.Done);
      setTimeout("$('#ajaxEventMask').click()", 1000);

    });
    ajaxEventDone(lang.PUpdate);//removing mask

  });

  applytoAllLangs = "no";
  applytoAllLangsTemplate = "no";
  //UPDATING A PAGE
  $('#saveThisPage').click(function(){

    boundCBval = $('#boundCB').val();

    if(boundCBval == 'on') {
      firstObjVal = $('#objList option:first').val();

      $('#' + firstObjVal).css("position", "relative");
      $('#' + firstObjVal).css("min-height", $('#' + firstObjVal).height() + "px" );
      $('#' + firstObjVal).css("height", "auto");
    }

    $(".draggable").each(function(){
      $(this).css("border", "0");
      $(this).removeClass("inactiveObject");

      //if it is a menu write command
      /*if ($(this).attr("objtype") == "Menu"){
        $(this).addClass("menuObj");
        $(this).html( "{" +$(this).attr("command") + "}");
      }*/
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

    });
    $('embed').each(function(){
      $(this).remove();
    });

    //$('#droppable').resizable('destroy');
    strCodeP =  $('#droppable').html();
    //$('#droppable').resizable({autohide: true});

    $('#pageCodeHtml').val( strCodeP );
    //description and keywords
    $('#pageDESC').val( $('#pageDescription').val() );
    $('#pageKEYWORDS').val( $('#pageKeywords').val() );

    $('#pageImageC').val( $('#pageImage').val() );

    $('#pageTitleC').val( $('#pageTitle').val() );
    $('#pageCategoryC').val( $('#categoryNameAssign').val() );

    saveCSSandJS();

    $('#pageCode').attr("action", absoluteUrl + "page/update/pageId/" + $('#pgID').html() + "/applytoall/" + applytoAllLangs );
    $('#pageCode').ajaxSubmit(function(data){

      ajaxEmitMessage(lang.Done);
      setTimeout("$('#ajaxEventMask').click()", 1000);
    });
    ajaxEventDone(lang.PUpdate);//removing mask
    return;
  });

  //Opening page
  $('#openPage').livequery('click', function(){
    const openPageDialogUniqueId = Date.now();
    $('#openPageForm').remove();
    $('.dialogDiv').remove();
    $('body').append('<div class="dialogDiv bg-accent text-accent-content" id="dialogDiv_' + openPageDialogUniqueId + '" ></div>');
    //$('#dialogDiv').draggable();
    $('#dialogDiv_' + openPageDialogUniqueId).html( $('#adminAjaxLoader').html() );
    //dialog();
    $('#dialogDiv_'  + openPageDialogUniqueId ).dialog({modal:false, resizable: false, title:$('.currentTitle').text() });
    $.get(absoluteUrl + "page/choose-page", function(data){

      $('#dialogDiv_' + openPageDialogUniqueId ).html( data);

    });
    $('#ajaxEventMask').remove();

    //onchange combo for page handling
    $('#dialogDiv_' + openPageDialogUniqueId + ' #pageName').livequery('change', function(){
      $('#templateMask').empty();
      $('#droppable').empty();
      //update data on the interface
      //getting output for the loaded page
      pageTitle = $('#dialogDiv_' + openPageDialogUniqueId + ' #pageName :selected').text();
      pgId = $('#' + $(this).attr("id") + " option:selected").val();

      $('#pgID').html(pgId);
      $('#pageTitle').prop("value", pageTitle);
      const pageID = $(this).val();
      $.getJSON(absoluteUrl + "page/open/id/" + pageID, function(data){

        $('#categoryNameAssign').prop("value" , data.category);
        $('#categoryNameAssign').prev('span').text($('#categoryNameAssign').find(":selected").text() );

        $('#pageImage').prop("value" , data.image);
        $('#pageDescription').prop("value" , data.description);
        $('#pageKeywords').prop("value" , data.keywords);
        $('#templateID').html(data.template_id);
        $('#templateChanger').prop("value" , data.template_id);
        $('#templateChanger').prev('span').text($('#templateChanger').find(":selected").text() );

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
        /*$(".draggable").draggable({
          drag:function() {
            id = $(this).attr("id");
          },
          containment: 'parent'
        }); // D */

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
      ajaxEventDone(lang.POpen);// remove the mask
      $('#dialogDiv_' + openPageDialogUniqueId).hide('slow').remove();// removing the dialog MUST
      document.cookie = 'pageSelectedId=' +  pgId + ';  path=/'; // temp
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
      //$(this).resizable('destroy');
      $(this).removeClass("inactiveObject");
      $(this).addClass("templateDiv");
      //if it is a menu write command
      if ($(this).attr("objtype") == "Menu"){
        //$(this).html( "{" +$(this).attr("command") + "}");
      }
      if ($(this).attr("objtype") == "Category"){
        $(this).html( "{" +$(this).attr("command") + "}");
        //$(this).attr("command", "");
      }

    });
    //$('#droppable').resizable('destroy');
    $('#templateMask').appendTo($('body'));
    strCodeT =  $('#templateMask').html() + $('#droppable').html();
    //$('#droppable').resizable({autohide: true});
    $('#templateMask').appendTo($('#droppable')).css({left: "0px"});

    $('#templateCodeHtml').val(  strCodeT );//template code

    $('#templateTitleC').val( $('#templateTitle').val() );//name of the template
    $('#templateBodyBgC').val( $('#template_bodyBg').val() );//body BG of the template

    $('#templateCode').attr("action", absoluteUrl + "page/save-as-template");
    $('#templateCode').ajaxSubmit(function(){

      ajaxEmitMessage(lang.Done);
      setTimeout("$('#ajaxEventMask').click()", 1000);
    });
    ajaxEventDone('Saving template...');//removing mask
  });

  //Saving a template - needs more work
  $('#saveThisTemplate').click(function(){

    $(".draggable:not('.templateDiv')").each(function(){
      $(this).css("border", "0");

      $(this).removeClass("inactiveObject");
      $(this).addClass("templateDiv");
    });

    $(".draggable").each(function(){
      $(this).removeClass("inactiveObject");
      //$(this).resizable('destroy');
      //if it is a menu write command
      if ($(this).attr("objtype") == "Menu"){
        //$(this).html( "{" +$(this).attr("command") + "}");
      }
      if ($(this).attr("objtype") == "Category"){
        $(this).html( "{" +$(this).attr("command") + "}");
        //$(this).attr("command", "");
      }
    });

    //$('.ui-resizable-handle').remove();
    //$('#droppable').resizable('destroy');
    $('#templateMask').appendTo($('body'));
    strCodeT =  $('#templateMask').html() + $('#droppable').html();
    //$('#droppable').resizable({autohide: true});
    $('#templateMask').appendTo($('#droppable')).css({left: "0px"});

    $('#templateCodeHtml').val(  strCodeT );//template code

    $('#templateTitleC').val( $('#templateTitle').val() );//name of the template
    $('#templateBodyBgC').val( $('#template_bodyBg').val() );//body BG of the template
    $('#templateDefaultC').val( $('#templateDefaultCB').prop("checked") );//template default

    $('#templateCode').attr("action", absoluteUrl + "page/update-template/templateId/" + $('#templateIDediting').html() + "/applytoall/" + applytoAllLangsTemplate );
    $('#templateCode').ajaxSubmit(function(){

      $('#ajaxEventMask').click();
    });
    ajaxEventDone(lang.TUpdate);//removing mask
  });

  //Applying a template
  $('#applyTemplate').click(function(){
    $('#dialogDiv').remove();

    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );
    dialog();
    $.get(absoluteUrl + "page/choose-template", function(data){
      $('#dialogDiv').html(data);
      $('#ajaxEventMask').remove();

    });
    $('#dialogDiv').show('slow');
    //onchange combo for page handling

  });

  $('#templateName').livequery('change', function(){

    loadTemplate( $(this).val());

    // ajaxEventDone(lang.TOpen);//removing mask
    $('#templateIDediting').html($(this).val());
    document.cookie = 'templateSelectedId=' + $(this).val() + ';  path=/'; //needs improvement
    $('#dialogDiv').hide('slow').remove();// removing dialog - MUST
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
      //loadPage(getCookie("pageSelectedId")); // disable temp bcs it's making the page open twice on load
    }
  }
});//end document ready

$(".container").livequery('click', function(e){

  var id = $('#' + $(this).attr("id") + ' .draggable').html();

});

//DBLCLICK ON OBJECT
$(".draggable").livequery('dblclick', function(e){
  const currentObject = $(this);

  lefT = $(this).position().left;
  toP = $(this).position().top;
  drOff = $('#droppable').position().left;

  $(".draggable").each(function(){

    $(this).removeClass("activeObject");
    $(this).addClass("inactiveObject");

    //$('#' +$(this).attr("id") ).resizable({ autoHide: true  });
  });

  $(this).removeClass("inactiveObject");
  $(this).addClass("activeObject");

  width = $(e.target).css("width");
  height= $(e.target).css("height");
  border = $(e.target).css("border");
  bgColor = $(e.target).css("background-color");
  fontColor = $(e.target).css("color");
  bgImage = $(e.target).css("background-image");
  objectClasses = $(e.target).attr("class");
  htmlValue = $('#' + $('#objIDshow').text() ).html();
  outerHtmlValue = $('#' + $('#objIDshow').text() ).get(0).outerHTML;
  zIn = $(e.target).css("z-index");
  css = $(e.target).attr("style");

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

    $('#objType').prop("value", objectHasType);
    $('#objType').val($('#objType option[class="' + objectHasType + '"]').text() );
    $('#objType').prev("span").text($('#objType option[class="' + objectHasType + '"]').text() );

  } else {

    $('#objType').val("Text");
    $('#objType').prev("span").text("Text");

  }

  if( typeof $('.selected-for-append').attr('id') !== undefined) {
    selectedObjID = $('.selected-for-append').attr('id');
  } else {

  }

  $('#objProperties').data("objid", selectedObjID );
  $('#objIDshow').html($(selectedObjID).attr("id"));

  $("#objPropertiesWidth").val( width );
  $("#objPropertiesHeight").val( height );
  $("#objPropertiesBorder").val( border );
  $("#objPropertiesClass").val( objectClasses );
  $("#objPropertiesBackground").val( bgColor );
  $("#objPropertiesFontColor").val( fontColor );
  $("#objPropertiesBackground").closest('.clr-field').css({ color: bgColor });
  $("#objPropertiesFontColor").closest('.clr-field').css({ color: fontColor });

  $("#objPropertiesBackgroundImage").val( bgImage );
  //objTheme
  $('#objTheme').val( themeClass);
  $('#objTheme').val(themeClass);
  $('#objTheme').prev("span").text($('#objTheme option[value="' + themeClass + '"]').text() );

  $("#objPropertiesX").val(posix + "px");
  $("#objPropertiesY").val(posiy + "px");
  $("#objPropertiesZ").val(zIn );

  if($(this).attr("objType") == "Menu") {
    $('#objPropertiesHtml').attr("disabled", "disabled");
    $("#objPropertiesHtml").val("{" + $(this).attr("command") + "}" );

  } else {
    $('#objPropertiesHtml').attr("disabled", false);
    $("#objPropertiesHtml").val( htmlValue );

    $('#objPropertiesHtmlSelected').val( outerHtmlValue);

  }

  if( typeof css == 'string' ) {
    $("#objPropertiesCSS").val( css );
  } else {
    $("#objPropertiesCSS").val( '' );
  }
  if ( $(e.target).hasClass("shadowed") ) {
    $('#shadowCheck').prop("checked", "checked");
    $('#shadowCheck').closest('span').addClass('checked');
  } else {
    $('#shadowCheck').prop("checked", "");
    $('#shadowCheck').closest('span').removeClass('checked');
  }

  if ( $(e.target).hasClass("cornered") ) {
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
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).css("width", $(this).val());

});
//height
$("#objPropertiesHeight").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).css("height", $(this).val());

});
//border
$("#objPropertiesBorder").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).css("border", $(this).val());

});
//X pos
$("#objPropertiesX").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).css("left", $(this).val());

});
//Y pos
$("#objPropertiesY").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).css("top", $(this).val());

});

$("#objPropertiesZ").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).css("z-index", $(this).val());
});

$("#objPropertiesHtml").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).html($(this).val());
});

$("#objPropertiesHtmlSelected").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).replaceWith( $(this).val() );
});

$("#objPropertiesCSS").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).attr("style", $(this).val());
});

document.addEventListener('coloris:pick', event => {

  // if change the background of the selected object
  if(event.detail.currentEl.id === 'objPropertiesBackground') {
    idObjekta = $('#objProperties').data("objid");
    $('#' + idObjekta).css("background-color", event.detail.color);
  }
  // if change font-color of the selected object
  if(event.detail.currentEl.id === 'objPropertiesFontColor') {
    idObjekta = $('#objProperties').data("objid");
    $('#' + idObjekta).css("color", event.detail.color);
  }

});

$("#objPropertiesBackgroundImage").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");

  $('#' + idObjekta).css("background-image", $(this).val());
  $('#' + idObjekta).css("background-repeat",   "no-repeat"  );
});

$("#objPropertiesClass").livequery('change', function(){
  idObjekta = $('#objProperties').data("objid");
  $('#' + idObjekta).attr("class", $(this).val());
});

$("#bodyWidth").livequery('change', function(){
  $('#droppable').css("width", $(this).val() );

});

$("#bodyHeight").livequery('change', function(){
  $('#droppable').css("height", $(this).val() );

});

$("#template_bodyBg").livequery('change', function(){
  $('body').css("background", $(this).val() );

});

//setting type and def background for the object
//$('#objType').livequery('change', function(){
$('#objType').change(function(){
  ajaxEvent();
  idObjekta = $('#objProperties').data("objid");

  objectType = $('#' + idObjekta).attr("objType");

  //defaultBackground = $('#objType').val();
  defaultBackground = $('#objType' + ' option:selected').attr('class');
  $('#' + idObjekta).attr("objType", defaultBackground );

  //VAZNO!
  //$('#' + idObjekta).css("background", "url("+ absoluteUrl + "images/" + $('#' + idObjekta).attr("objType") + ".png) no-repeat center");

  //title
  if (defaultBackground == "title") {

    $('#' + idObjekta).html("{title}");
    setTimeout("clickMask()", 500); //closing all
  }
  //pageInfo
  if (defaultBackground == "pageinfo") {

    $('#' + idObjekta).html("{pageinfo}");
    setTimeout("clickMask()", 500); //closing all
  }
  //SEARCHFORM
  if (defaultBackground == "searchform") {

    $('#' + idObjekta).html("{searchform}");
    setTimeout("clickMask()", 500); //closing all
  }
  //languageFORM
  if (defaultBackground == "languageform") {

    $('#' + idObjekta).html("{language:flags}");
    setTimeout("clickMask()", 500); //closing all
  }
  //contactFORM
  if (defaultBackground == "contactform") {

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

    $('#' + idObjekta).html("{liveblock:user:loginArea}");
    setTimeout("clickMask()", 500); //closing all
  }

  if ($(this).val() == "Menu") {
    $('#' + idObjekta).addClass("menuObj");
    $('#MenuA').click();

    ajaxEventDone(lang.ClickMenu);
    ajaxEmitMessage(lang.ClickMenu);
    setTimeout("clickMask()", 2000); //closing all
    shouldDisplayMenu = 1;

  }

  if ($(this).val() == "Image") {
    $('#ImagesA').click();

    ajaxEventDone(lang.ClickFolIm);
    ajaxEmitMessage(lang.ClickFolIm);
    setTimeout("clickMask()", 2000); //closing all
    imageSelectionActive = 1;

  }
});

// DISPLAYING A MENU INSIDE THE SELECTED OBJECT
shouldDisplayMenu = 0;
$('#chooseMenuForm').change(function(){
  idObjekta = $('#objProperties').data("objid");

  // PUTTING A MENU INSIDE THE SELECTED OBJECT
  if (shouldDisplayMenu == 1 || putInThisObj == 1) {
    selMenuTemplate = $('#' + $(this).attr("id") + " option:selected").val();//selected menu
    selValueTemplate = $('#' + $(this).attr("id") + " option:selected").attr("label");

    shouldDisplayMenu = 0;

    var tvCommand = "menu:display:" + selMenuTemplate + displayTypeMenu ;

    $.post(absoluteUrl + "view/render-tv/creatorAct/true/var/" + "{" + tvCommand + "}", function(data){
      //$('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes well after update
      if(displayTypeMenu === ':tree') {
        $('#' + idObjekta).html(data.replace('id="tree"', 'id="tree_' + selMenuTemplate + '"'));
        $('#tree_' + selMenuTemplate).treeview({
          collapsed: true,
          animated: "medium"
        });

      } else {
        $('#' + idObjekta).html(data);
      }
      $('#' + idObjekta ).dblclick();

      $('#objPropertiesHtml').val("{"+ tvCommand + "}");
      $('#' + idObjekta).attr("command", tvCommand);

    });

  }

});

//IMAGE PUTTING
imageSelectionActive = 0;
$('#chooseImageFolderForm').change(function(){

  if (imageSelectionActive == 1 || putImagesInThisObj == 1) {
    ajaxEvent();
    selFolder = $('#' + $(this).attr("id") + " option:selected").val();//selected menu
    selValueFolder = $('#' + $(this).attr("id") + " option:selected").attr("label");
    selectedImage = $('#imageNames').val();

    ajaxEventDone("You have chosen " + selFolder + " to display in this object!");
    ajaxEmitMessage("You have chosen " + selFolder + " to display in this object!");
    setTimeout("clickMask()", 2000); //closing all

    imageSelectionActive = 0;

    var tvCommand = "images:display:'" + selFolder + "'" ;

    $.post(absoluteUrl + "view/render-tv/var/" + "{" + tvCommand + "}", function(data){
      //$('#' + idObjekta).html(data);
      //$('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update
      $('#' + idObjekta).html(data);
      $('#' + idObjekta ).dblclick();
      $('#objPropertiesHtml').val("{"+ tvCommand + "}");
      $('#' + idObjekta).attr("command", tvCommand);

    });
  }
});

$("#delButton").livequery('click', function(){
  idObjekta = $('#objIDshow').text();
  $('#objList option:contains("'+ idObjekta +'")').remove();

  $('#objIDshow').html("");
  $('#' + idObjekta).remove();
  $('#objProperties').data("objid", "");

});
$('#previewButton').click(function(){

});

//SHADOW
$('#shadowCheck').click(function(){
  idObjekta = $('#objProperties').data("objid");

  if ($(this).prop("checked") == true) {
    $('#' + idObjekta).addClass("shadowed");
  } else {
    $('#' + idObjekta).removeClass("shadowed");
  }
});

//CORNERS hide/show div and operation
$('#cornerCheck').livequery('click', function(){
  idObjekta = $('#objProperties').data("objid");

  if ($(this).prop("checked") == true) {
    $('#' + idObjekta).addClass("cornered");
    //$('#cornerPropDiv').show("slow");
  } else {
    $('#' + idObjekta).removeClass("cornered");
    //$('#cornerPropDiv').hide("slow");
  }
});

//CORNER HANDLING
$('#aParamCorner').livequery('click', function(){
  if($('#cornerCheck').prop('checked') ){
    ajaxEvent();
    $('#dialogDiv').remove();
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );
    $.get(absoluteUrl + "creator/corner-params" , function(data){
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

    $('#' + idObjekta).attr('class', a);

    $('#' + idObjekta).removeClass(objClass.match(re));
    $('#' + idObjekta).addClass("corParams_(" + $('#chooseCornerStyle').val() + "," + $('#chooseCornerOrientation').val() + "," + $('#cornerParamRadius').val() + "px" + ")" );

    $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );
    ajaxEmitMessage(objClass.match(re) + "is removed");
    setTimeout("$('.ui-dialog').remove();", 500); //closing all
  } else {
    $('#' + idObjekta).addClass("corParams_(" + $('#chooseCornerStyle').val() + "," + $('#chooseCornerOrientation').val() + "," + $('#cornerParamRadius').val() + "px" + ")" );
    $('#objPropertiesClass').attr('value', $('#' + idObjekta).attr("class") );
    ajaxEmitMessage(objClass.match(re) + "is removed");
    setTimeout("$('.ui-dialog').remove();", 500); //closing all
  }
  //background of the corner container
  re2 = /corBg_\S*/;
  if(objClass.match(re2)){
    a = objClass.replace(/corBg_\S*/g, '');

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
// switched from ColorPicker to Coloris

//SHADOW HANDLING
$('#aParamShadow').livequery('click', function(){
  if($('#shadowCheck').prop('checked') ){
    ajaxEvent();
    $('#dialogDiv').remove();
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );
    $.get(absoluteUrl + "creator/shadow-params" , function(data){
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
        $('#shdwLeft').val(Rleft);
        $('#shdwTop').val(Rtop);
        $('#shdwBlur').val(Rblur);
        $('#shdwOpacity').val(Ropacity);
        $('#shdwColor').val(Rcolor);
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

    $('#' + idObjekta).removeClass(objClass.match(re));
    a = objClass.replace(/dsParams_\S*/, '');

    $('#' + idObjekta).attr('class', a);

    $('#' + idObjekta).addClass("dsParams_(" + "left:" + $('#shdwLeft').val() + "," + "top:" + $('#shdwTop').val() + "," + "blur:" + $('#shdwBlur').val() + "," + "opacity:" + $('#shdwOpacity').val() + "," + "color:" + $('#shdwColor').val() + ")" );
    $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );
    ajaxEmitMessage(objClass.match(re) + "is removed");
    setTimeout("$('.ui-dialog').remove();", 500); //closing all
  } else {
    //$('#' + idObjekta).removeClass(objClass.match(re));
    $('#' + idObjekta).addClass("dsParams_(" + "left:" + $('#shdwLeft').val() + "," + "top:" + $('#shdwTop').val() + "," + "blur:" + $('#shdwBlur').val() + "," + "opacity:" + $('#shdwOpacity').val() + "," + "color:" + $('#shdwColor').val() + ")" );
    $('#objPropertiesClass').prop('value', $('#' + idObjekta).attr("class") );
    ajaxEmitMessage(objClass.match(re) + "is added");
    setTimeout("$('.ui-dialog').remove();", 500); //closing all

  }

});

//COLOR SELECTOR for the SHADOW
// switched from ColorPicker to Coloris

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

  if ($(this).attr("checked") == true) {
    singleImage = 1;
  } else {
    singleImage = 0;
  }
});

//UPLOAD IMAGES
$('#addImageLink').livequery('click', function(){
  var valFolder = $('#folderNames').val();
  if (valFolder == "") {
    ajaxEventDone(lang.SelFolFirst);
    ajaxEmitMessage(lang.SelFolFirst);
    setTimeout("clickMask()", 2000); //closing all
  } else {
    ajaxEvent();
    $('#dialogDiv').remove();
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );

    $.get(absoluteUrl + "images/upload/fname/" + valFolder, function(data){

      $('#dialogDiv').html(data);

      // ajax upload
      $('#uploadImagesForm').ajaxForm(function(data){
          $('#dialogDiv').remove();
          $('#folderNames').change();
          ajaxEmitMessage(lang.FileUploaded);
          setTimeout("clickMask()", 1000); //closing all
      });

    });
    $('#dialogDiv').show('slow');
  }

});

//Add FOLDER
$('#addFolderLink').livequery('click', function(){
  $('#dialogDiv').remove();
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );

  $.get(absoluteUrl + "images/add-folder", function(data){

    $('#dialogDiv').html(data);
  });
  $('#dialogDiv').show('slow');
});

//DELETE FOLDER
$('#delFolderLink').click(function(){
  if($('#folderNames').val() != ""){
    var confir = confirm(lang.AYS);
  } else {
    ajaxEvent();
    ajaxEventDone(lang.SelFolFirst);
    ajaxEmitMessage(lang.SelFolFirst);
    setTimeout("clickMask()", 2000); //closing all
  }

  var val = $('#folderNames').val();
  if (confir == true ){
    ajaxEvent();
    $.get(absoluteUrl + "images/delete-folder/fname/" + val , function(data){

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
  var val = $('#folderNames').val();
  $.get(absoluteUrl + "images/show-images/fname/" + val , function(data){

    $('#imagesShow').html(data);
  });
});

singleImage = 0;
selectedImage = "";
$('#showFolderImages').livequery('change', function(){

  if (imageSelectionActive == 1 || putImagesInThisObj == 1) {
    ajaxEvent();
    selFolder = $('#folderNames').val();//selected folder
    selValueFolder = $('#folderNames').attr("label");
    selectedImage = $('#imageNames').val();
    imagePath = "/images/" + selFolder + "/" + selectedImage;
    $('#imagePathShow').html(imagePath);

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
      //$('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update
      $('#' + idObjekta).html(data);
      $('#' + idObjekta ).dblclick();

      $('#objPropertiesHtml').val("{"+ tvCommand + "}");
      $('#' + idObjekta).attr("command", tvCommand);

    });
  }
});

//When  image is chosen  show details
$('#showFolderImages').livequery('change', function(){

  selFolder = $('#folderNames').val();//selected folder
  selValueFolder = $('#folderNames').attr("label");
  selectedImage = $('#imageNames').val();
  imagePath = "/images/" + selFolder + "/" + selectedImage;
  $('#imagePathShow').html(imagePath);

  if($( "#dialogDivImages" ).length == 0){
    $('body').append('<div id="dialogDivImages" class="bg-accent text-accent-content w-full h-full"><div id="imageDetails"></div></div>');
    $( "#dialogDivImages" ).dialog({modal:false, resizable: true, position: ['center','center'], title:"Image Details" , maxHeight:$(window).height() });
    $('#imageDetails').appendTo($('#dialogDivImages') );
  }
  if($('#imageDetails').length == 0){
    $('#dialogDivImages').remove();
    $('body').append('<div id="dialogDivImages" class="bg-accent text-accent-content w-full h-full"><div id="imageDetails"></div></div>');
    $( "#dialogDivImages" ).dialog({modal:false, resizable: true, position: ['center','center'], title:"Image Details" , maxHeight:$(window).height() });
    $('#dialogDivImages') .append('<div id="mageDetails"></div>');
  } else{
    $('#dialogDivImages').dialog('open');
  }

  $('#imageDetails').html( $('#adminAjaxLoader').html() );

  var val = $('#imageNames').val();
  var valFolder = $('#folderNames').val();
  $.get(absoluteUrl + "images/show-image-details/fname/" + valFolder + "/imname/" + val , function(data){

    $('#imageDetails').html(data);
    $('#deleteImage').show();
    $('#insertImage').show();
    $('#setBodyBgImage').show();

  });

});
//INSERT IMAGE;
$('#insertImage').click(function(){
  idObjekta = $('#objList').val();
  //$('#' + idObjekta).resizable('destroy');
  $('#' + idObjekta).append('<img src = "' + $('#imagePathShow').text() + '" />');

  $('#' + idObjekta).resizable({autohide:true});

});
//set as body bg;
$('#setBodyBgImage').click(function(){
  if($('#bgSelect').val() == "BODY") {
    $('#template_bodyBg').val("url(" + $('#imagePathShow').text() + ")" );
    $('#template_bodyBg').change();
    $('.body2be').attr("src" , $('#imagePathShow').text() );
  }
  if($('#bgSelect').val() == "SHEET") {
    $('.sheet').css("background" , "url(" + $('#imagePathShow').text() + ")" );
  }
  if($('#bgSelect').val() == "HEADER") {
    $('.header').css("background" , "url(" + $('#imagePathShow').text() + ")" );
  }
  if($('#bgSelect').val() == "FOOTER") {
    $('#ftr').css("background" , "url(" + $('#imagePathShow').text() + ")" );
  }
  if($('#bgSelect').val() == "SELECTED-OBJECT") {
    $('.selected-for-append').css({
      "background-image" : "url(" + $('#imagePathShow').text() + ")",
      "background-repeat" : "no-repeat",
      "background-position" : "center center",
      "background-size" : "cover"
    });
  }
});

$('#NR, #fixedBg').removeAttr('checked'); // reset checkboxes to unchecked
$('#NR').livequery('change', function(){

  if($(this).val() == "repeat"){

    str = $('#template_bodyBg').val();

    $('#template_bodyBg').prop("value" , str.replace("repeat", " no-repeat")  );
    $('#template_bodyBg').prop("value" , $('#template_bodyBg').val() + " no-repeat" );

    $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').val() + ';background-repeat:no-repeat;');
    $('#template_bodyBg').change();

    $(this).prop("value", "no-repeat") ;
    str = $('#template_bodyBg').val();
    $('body').css({backgroundRepeat:"no-repeat"});

  } else {
    str = $('#template_bodyBg').val();

    $('#template_bodyBg').attr("value" , str.replace(" no-repeat", " repeat") );
    $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').val() + ';background-repeat:repeat;');

    $('#template_bodyBg').change();

    $(this).prop("value", "repeat") ;
    $('body').css({backgroundRepeat:"repeat"});
  }
});

$('#fixedBg').livequery('change', function(){

  if($(this).val() == "fixed"){
    trenutniCss = $('#template_bodyBg').val();
    if(trenutniCss.match(/;background-size:100%;/g) ) {
      val = trenutniCss.replace(/;background-size:100%;/g , "");
      $('#template_bodyBg').attr("value" ,  val + " fixed" + ";background-size:100%;");
    } else {
      $('#template_bodyBg').attr("value" , trenutniCss + " fixed" );
    }
    $('#bodyBack').css("position", "fixed");
    $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').val() + ';background-attachment: fixed; background-size: cover; background-position: center center;');

    $('#template_bodyBg').change();
    $(this).prop("value", "") ;
    $('body').css({backgroundAttachment:"fixed"});
    $('body').css({backgroundSize:"cover"});
    $('body').css({backgroundPosition:"center center"});

  } else {
    str = $('#template_bodyBg').val();

    $('#template_bodyBg').attr("value" , str.replace("fixed", "") );
    $('#bodyBack').css("position", "absolute");
    $('#template_bodyBg').prop("value" ,  $('#template_bodyBg').val() + ';background-attachment:scroll;');
    $('#template_bodyBg').prop("value" , str.replace("fixed", "") );

    $('#template_bodyBg').change();

    $(this).prop("value", "fixed") ;
    $('body').css({backgroundAttachment:"scroll"});
  }

});
//DELETE IMAGE;
$('#deleteImage').click(function(){
  if($('#imageNames').val() != ""){
    var confir = confirm(lang.AYS);
  }

  if (confir == true ){
    ajaxEvent();
    $.get(absoluteUrl + "images/delete-image/f/" + $('#folderNames').val() + '/i/' + $('#imageNames').val(), function(data){

      ajaxEmitMessage(data);
      setTimeout("clickMask()", 1000);
      $('#folderNames').change();
    });

    ajaxEventDone(lang.DeletingImage);
  }
});

//MODULES
//When module is chosen show admin action for that module
$('#chooseModulesForm').livequery('change', function(){
  $('#modulesSelected').html( $('#adminAjaxLoader').html() );

  var val = $('#moduleName option:selected').text();

  $.get(absoluteUrl + val + "/admin", function(data){

    $('#modulesSelected').html(data);

  });

});

//CATEGORIES
$('#categoryNameAssign').livequery('change', function(){

});

//Add CATEGORY
$('#addCategoryLink').livequery('click', function(){
  $('#dialogDiv').remove();
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );

  $.get(absoluteUrl + "category/add-category", function(data){

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

        ajaxEmitMessage(data);
        setTimeout("clickMask()", 1000);

        $('#chooseCategoryForm option:contains("'+ selValueCategory + '")').remove();
        $('#categoryNameAssign  option:contains("'+ selValueCategory + '")').remove();

      });
      ajaxEventDone(lang.DeletingCategory);
    }

  } else {

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
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );
    $.get(absoluteUrl + hrefVal +"/catid/" + selCategory, function(data){
      $('#dialogDiv').html( data);
    });
    $('#dialogDiv').show('slow');
  } else {

    ajaxEventDone(lang.FirstSelCat);
    ajaxEmitMessage(lang.FirstSelCat);
    setTimeout("clickMask()", 2000);
  }
});
selCategoryItem = "";
$('#catItems').livequery('change', function(){

  selCategoryItem = $(this).val();
});

//CATEGORY ITEMS -delete
$('#delCategoryItemLink').livequery('click', function(){
  ajaxEvent();
  hrefVal = $(this).attr("href");
  if(selCategoryItem != ""){
    var confirCategoryItem = confirm(lang.AYS);
    if (confirCategoryItem == true){

      $.get(absoluteUrl + hrefVal + "/catid/" + selCategory + "/catitid/" + selCategoryItem, function(data){
        //$('#dialogDiv').html('<div id="closeDialogDiv"></div>' + data);
        $('#categoryName').change();
        ajaxEventDone(data);
        ajaxEmitMessage(data);
        setTimeout("clickMask()", 1000);
      });

    } else {
      setTimeout("clickMask()", 500);
    }
  } else {

    ajaxEventDone(lang.FirstSelCatIt);
    ajaxEmitMessage(lang.FirstSelCatIt);
    setTimeout("clickMask()", 2000);
  }
});

//CATEGORY MENAGEMENT
//TURN putting in object on/off
putCategoryInThisObj = 0;
$('#putCategoryInThis').click(function(){

  if ($(this).attr("checked") == true) {
    putCategoryInThisObj = 1;
  } else {
    putCategoryInThisObj = 0;
  }

});

//DISPLAYING CATEGORY IN AN OBJECT
categ = 0;

$('#chooseCategoryForm').change(function(){
  idObjekta = $('#objProperties').data("objid");
  //CATEG PUTTING
  if (categ == 1 || putCategoryInThisObj == 1) {
    selCategoryTemplate = $('#' + $(this).attr("id") + " option:selected").val();//selected category
    selValueCategory = $('#' + $(this).attr("id") + " option:selected").attr("label");

    categ = 0;

    var tvCommand = "category:display:" + selCategoryTemplate + displayTypeMenu ;

    $.post(absoluteUrl + "view/render-tv/var/" + "{" + tvCommand + "}", function(data){
      //$('#' + idObjekta).html(data);
      //$('#' + idObjekta ).resizable('destroy');//removing resizable so that it goes good after update
      $('#' + idObjekta).html(data);
      $('#' + idObjekta ).dblclick();

      $('#objPropertiesHtml').val("{"+ tvCommand + "}");
      $('#' + idObjekta).attr("command", tvCommand);
      $('#' + idObjekta).attr("objtype", "Category");

    });

  }

});

//clickin on a category and deleting one
selCategory = "";

$('#chooseCategoryForm').change(function(){
  //$('#categorySelectedForm').hide();
  $('#categorySelected').html(lang.Loading);
  $('#categorySelected').append($('#adminAjaxLoader').html() );

  selCategory = $('#' + $(this).attr("id") + " option:selected").val();//selected Category
  selValueCategory = $('#' + $(this).attr("id") + " option:selected").attr("label");

  $.get(absoluteUrl + "category/show-category-items/catid/" + selCategory , function(data){

    $('#categorySelected').html(data);

  });

});

//MENUS
//Add A MENU
$('#addMenuLink').livequery('click', function(){
  $('#dialogDiv').remove();
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );

  $.get(absoluteUrl + "menu/add-menu", function(data){

    $('#dialogDiv').html( data);

  });
  $('#dialogDiv').show('slow');

});

//clickin on a menu and deleting one
selMenu = "";
$('#chooseMenuForm').change(function(){

  $('#menuSelected').html(lang.Loading);
  $('#menuSelected').append($('#adminAjaxLoader').html() );

  selMenu = $('#' + $(this).attr("id") + " option:selected").val();//selected menu
  selValue = $('#' + $(this).attr("id") + " option:selected").attr("label");

  var tvCommand = "menu:display:" + selMenu + ":tree";
  $('#chosen-menu-id').text(selMenu);

  $.post(absoluteUrl + "view/render-tv/creatorAct/true/var/" + "{" + tvCommand + "}", function(data){
    //$('#adminAjaxLoader').fadeOut();
    $('#menuSelected').html(data);

    //ADDING ADMIN CLASS TO TREE
    $("#menuSelected #tree").addClass("adminTree");

    $("#menuSelected #tree.adminTree a").click(function(){
      miId = $(this).attr("id").replace(/mi_/, "") ;

      $('#menuSelectedForm').show();//first show the form

      $('#menuItemForm').html('ID:' + miId );
      $('#menuItemForm').val( miId);
      $('#editMenuItem').click();
      $('#deleteMenuItem').show();

      return false;
    });
  });
});

//Add MENU ITEM
$('#addMenuItemLink').livequery('click', function(){
  $('#dialogDiv').remove();
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );
  mid = $('#menuName').val();
  if(mid != ""){
    $.get(absoluteUrl + "menu/add-menu-item/mid/" + mid, function(data){

      $('#dialogDiv').html(data);
    });
    $('#dialogDiv').show('slow');
  } else {

    ajaxEventDone(lang.FSelMenu);
    ajaxEmitMessage(lang.FSelMenu);
    setTimeout("clickMask()", 2000);
  }
});

$('#addMenuItemForm').livequery('change', function(){

  checkedValue = $('#addMenuItemForm input[type=radio]:checked').val();

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
    if($('#menuItemModule').val() == '0'){
      $('#addMenuItemSubmit').hide();
    }

    //uniform
    $('#uniform-menuItemCategory').hide();
    $('#uniform-menuItemPage').hide();
    $('#uniform-menuItemModule').show();
    if($('#uniform-menuItemModule').val() == '0'){
      $('#uniform-addMenuItemSubmit').hide();
    }
  }
});

//when category for the menu item that is to be added is choosed, then call the filter function
$('#menuItemCategory').livequery('change', function(){

  val = $(this).val();
  $.post(absoluteUrl + "menu/get-pages-by-category/catid/" + val, function(data){
    $('#menuItemPage').empty();

    $('#menuItemPage').html(data);
  });
});

//when page is selected display the submit button
$('#menuItemPage').livequery('change', function(){
  pageVal = $(this).val();
  if($(this).val() != "0"){

    $('#addMenuItemSubmit').show();
  } else {
    $('#addMenuItemSubmit').hide();
  }
});

//when module is selected display the submit button
$('#menuItemModule').livequery('change', function(){
  moduleVal = $(this).val();
  if($(this).val() != "0"){

    $('#addMenuItemSubmit').show();
  } else {
    $('#addMenuItemSubmit').hide();
  }
});

//EDIT MENU ITEM
$('#editMenuItem').click(function(){
  $('#menuItemForm').append("<br />" + lang.Loading);
  $('#menuItemForm').append($('#adminAjaxLoader').html() );

  $.get(absoluteUrl + "menu/edit-menu-item/id/" + $('#menuItemForm').val(), function(data){

    $('#menuItemForm').html('ID:' + $('#menuItemForm').val() + "<br />" + data);

  });
});

//DELETE MENU ITEM;
$('#deleteMenuItem').click(function(){
  if($('#menuItemForm').val() != ""){
    var confir = confirm(lang.AYS);
  }

  if (confir == true ){
    ajaxEvent();
    $.get(absoluteUrl + "menu/delete-menu-item/id/" + $('#menuItemForm').val(), function(data){

      ajaxEmitMessage(data);
      setTimeout("clickMask()", 1000);
      $('#menuItemForm').html("");
      $('#menuItemForm').val( "");
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

        ajaxEmitMessage(data);
        setTimeout("clickMask()", 1000);

        $('#chooseMenuForm option:contains("'+ selValue + '")').remove();
        $('#menuNameAssign option:contains("'+ selValue + '")').remove();

      });
      ajaxEventDone(lang.DelMenu);

    }

  } else {
    ajaxEvent();

    ajaxEventDone(lang.FirstSelMenu);
    ajaxEmitMessage(lang.FirstSelMenu);
    setTimeout("clickMask()", 2000);

  }
});

//ON ASSIGN THIS PAGE TO MENU
$('#menuNameAssign').livequery('change', function(){
  ajaxEvent();
  menu = "";
  selMenu = $('#' + $(this).attr("id") + " option:selected").val();//selected menu
  selValue = $('#' + $(this).attr("id") + " option:selected").attr("label");
  if (selMenu =="select") {return;};
  var tvCommand = "menu:display:" + selMenu + ":tree";

  menuSelected = $('#' + $(this).attr("id") + " option:selected").val();
  if (menuSelected != "select"){
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );

    //GETTING  THE MENU TREE
    $.post(absoluteUrl + "view/render-tv/creatorAct/true/var/" + "{" + tvCommand + "}", function(data){
      menu = data;
      $.get(absoluteUrl + "menu/show-menu-items/id/" + menuSelected + "/cid/" + $('#pgID').html(), function(data){

        $('#dialogDiv').append( menu + '<div id="addMenuItForm">' + data + '</div>');
        $('#dialogDiv img').hide();

        //ADDING ADMIN CLASS TO TREE
        $("#dialogDiv #tree").addClass("adminTree");
        $("#dialogDiv #tree").css({width:"200px", float:"left" });

        //CLICK ON THE TREE
        $("#dialogDiv #tree a").click(function(){
          miId = $(this).attr("id").replace(/mi_/, "") ;

          $('#menuItemName').val(miId);
          $('#menuItemName').prev('span').text( $('#menuItemName').find(':selected').text() );

          return false;
        });

      });
    });
  }
});

$('#menuItemName').livequery('change', function(){
  var menuItemSelected = $('#' + $(this).attr("id") + " option:selected").val();

});

//DISPLAY MENU IN DIFFERENT WAYS
displayTypeMenu = "";
$('#menuDisplayType').change(function(){
  displayTypeMenu = $("#menuDisplayType input:checked").val();
});

//CSS TAB
$('#addCssCodeA').click(function(){
  ajaxEvent();

  oldCss = $('#pageCSS').val();

  newPageCss = "\n#" + $('#objListForCss').val() + '{' + "\n\n\n" + '}' + "\n" + oldCss;

  if ( $('#objListForCss').val() != "") {
    $('#pageCSS').val( newPageCss);
    editorCSS.setValue(newPageCss);// update ace editor

  } else {

    ajaxEventDone(lang.FirstSelObj);
    ajaxEmitMessage(lang.FirstSelObj);
    setTimeout("clickMask()", 2000);
  }
});

//JS TAB

$('#addJsCodeA').click(function(){
  ajaxEvent();

  oldJs = $('#pageJS').val();

  newPageJs = "\n$('#" + $('#objListForJs').val() + "').livequery('" + $('#eventListForJs').val() + "', " + 'function(){' + "\n\n\n" + '});' + "\n" + oldJs;

  if ( $('#objListForJs').val() != "") {
    $('#pageJS').val( newPageJs);
    editorJS.setValue(newPageJs);// update ace editor

  } else {

    ajaxEventDone(lang.FirstSelObj);
    ajaxEmitMessage(lang.FirstSelObj);
    setTimeout("clickMask()", 2000);
  }

});

//ARROW ON SELECTED OBJECT FOR CSS
$('#objListForCss').change(function(){

});

//ARROW ON SELECTED OBJECT FOR JS
$('#objListForJs').change(function(){

});
//RESETING ARROW WHEN CLICKIN ON TABS
$('#CssA').click(function(){
  $('#objListForCss').change();
});

$('#JsA').click(function(){
  $('#objListForJs').change();
});

//TEMPLATE CHANGER
$('#templateChanger').change(function(){
  ajaxEvent();
  templateId = $(this).val();
  if(templateId == 0) {return false;}

  pageId = $('#pgID').html();

  $.post(absoluteUrl + "page/change-template/pageid/" + pageId + "/templateid/" + templateId, function(data){

    ajaxEmitMessage(data);
    setTimeout("clickMask()", 1000);
  });
  ajaxEventDone(lang.TChange);
});

$('#pageDisplayer').click(function(){

  $('#pageEditing').show();
  $('#assignPageToCategory').show();
  $('#assignPageMenuForm').show();
  $('#descKeyDiv').show();
  $('body').css("background", "white");
  $('#p_t-label-page').removeClass('hidden');
  $('#p_t-label-template').addClass('hidden');

  $('#templateEditing').hide();
  $('#deletePage').show();
  $('#clearPage').click();
  $('.object-buttons').hide();

  document.cookie = 'templateSelected=0;  path=/';
  if(getCookie("pageSelectedId")){loadPage(getCookie("pageSelectedId"));}  //return to the previously edited page
});

$('#templateDisplayer').click(function(){
  $('#pageEditing').hide();
  $('#assignPageToCategory').hide();
  $('#assignPageMenuForm').hide();
  $('#descKeyDiv').hide();
  $('#p_t-label-template').removeClass('hidden');
  $('#p_t-label-page').addClass('hidden');

  $('#templateEditing').show();
  $('#deletePage').hide();
  $('#clearPage').click();
  $('.object-buttons').hide();

  document.cookie = 'templateSelected=1; path=/';
  if(getCookie("templateSelectedId")){loadTemplate(getCookie("templateSelectedId"));} //return to the previously edited template

});

//TABLE MANIPULATION UniversalTableAdmin
$('a.uniTableAdmin').livequery('click', function(e){
  tableid =  $(e.target).attr('value');

  rowId = $(this).closest("tr").attr("id");
  hrefVal =  $(this).attr("href");

  if ($(this).hasClass("a_add") ){

    //$('#addRowForm').remove();
    $('#dialogDiv').remove();
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );

    if(hrefVal == "") {
      hrefVal = "tables/add-row/tableid/" + tableid;
    }

    $.get(absoluteUrl + hrefVal, function(data){

      $('#dialogDiv').html( data);
    });
    $('#dialogDiv').show('slow');

  }

  //IF EDIT
  if ($(this).hasClass("a_edit") ){

    let rowId = $(this).closest("tr").attr("id");
    let tableid =  $(this).attr('value');

    $('#editRowForm').remove();
    $('#dialogDiv').remove();
    $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
    dialog();
    $('#dialogDiv').html( $('#adminAjaxLoader').html() );
    $.get(absoluteUrl + "tables/edit-row/tableid/" + tableid + "/rowid/" + rowId, function(data){

      $('#dialogDiv').html(data);
    });

    $('#dialogDiv').show('slow');

  }

  //IF DELETE
  if ($(this).hasClass("a_delete") ){

    let tableid =  $(this).attr('value');
    let rowId = $(this).attr("id");
    let confir = confirm(lang.AYS);

    if(hrefVal == "") {
      hrefVal = "tables/delete-row/tableid/" + tableid + "/rowid/" + rowId;
    } else {
      hrefVal = hrefVal + "id/" + rowId;
    }

    if (confir == true) {
      ajaxEvent();
      $.post(absoluteUrl + hrefVal, function(response){
        try { // first check if the backend has provided json response
          const data = JSON.parse(response);

          ajaxEmitMessage(data.message);

          if(data.success === true){
            $('#uta_' + tableid  + ' tr[id^='+ rowId +']').fadeOut(2000, function(){
              $(this).remove();
            });
          }
        } catch(e) {// not a json response, TODO: make all the responses to delete buttons from backend as JSON
            ajaxEmitMessage(response);
            $('#uta_' + tableid  + ' tr[id^='+ rowId +']').fadeOut(2000, function(){
              $(this).remove();
            });
        }
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

});

$('.expanderDiv').livequery('click', function(){

  if($(this).hasClass("expanderDiv") ) {
    $(this).addClass("expanderDivClosed");
    $(this).removeClass("expanderDiv");
  } else if($(this).hasClass("expanderDivClosed") ) {
    $(this).addClass("expanderDiv");
    $(this).removeClass("expanderDivClosed");
  }
  $('#' + $(this).val()).toggle();
});

$('.expanderDivClosed').livequery('click', function(){

  if($(this).hasClass("expanderDiv") ) {
    $(this).addClass("expanderDivClosed");
    $(this).removeClass("expanderDiv");
  } else if($(this).hasClass("expanderDivClosed") ) {
    $(this).addClass("expanderDiv");
    $(this).removeClass("expanderDivClosed");
  }
  $('#' + $(this).val()).toggle();
});

//Pagination
$('.pag_a').livequery('click', function(){

  idCurrent = $(this).html();//this is important for refreshing of the table

  div = $(this).parents(".pagination-closest").attr("id");

  $(this).closest('.pagination-container').prepend('<div id="loadingBook" class="absolute right-1 bottom-1 "><span class="loading loading-spinner loading-xs text-white w-8 h-8"></span></div>');

  $.get( absoluteUrl + $(this).attr("href"), function(data){
    $('#loadingBook').remove();

    if( $('#' + div).parents('#TB_window').length < 1 ) {
      $('#' + div).html(data);
    } else {
      $('#TB_ajaxContent').html(data);
    }
  });
  return false;
});

//TABLE MANIPULATION TILL HERE
//LANGUAGE CHANGE
$('#langName').livequery('change', function(){
  ajaxEvent();
  langcode = $(this).val();
  $.post(absoluteUrl + "creator/change-language/code/" + langcode, function(data) {

    if($('#deletePage').css("display") != 'none'){
      //Opening the page that was open before the language change
      $.getJSON(absoluteUrl + "page/open/id/" + $("#pgID").html(), function(data){

        $('#categoryNameAssign').prop("value" , data.category);
        $('#pageImage').prop("value" , data.image);
        $('#pageDescription').prop("value" , data.description);
        $('#pageKeywords').prop("value" , data.keywords);
        $('#templateID').html(data.template_id);
        $('#templateChanger').prop("value" , data.template_id);

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

          /*$(".draggable").draggable({
            drag:function() {
              id = $(this).attr("id");
            },
            containment: 'parent'
          }); // D */

          $('#objList').html("");
          $('.draggable').each(function(){
            $(this).removeClass("inactiveObject");
            $('#objList').append('<option>' + $(this).attr("id") + '</option>');
          });
        }

        refreshControls();

      });//end opening the page
    } else {//END IF IT IS A PAGE

      //templateReopenAfterLanguage();
      loadTemplate($('#templateIDediting').html());

    } //END IF IT IS A TEMPLATE
    $('#clearPage').click();

    ajaxEmitMessage(data);
    setTimeout("$('#ajaxEventMask').click()", 1500);
  });
  ajaxEventDone(lang.LChange);
});
//LANGUAGE CHANGE TILL HERE

//EMPTY CACHE
$('#emptyCacheButton').livequery('click', function(){
  $.post(absoluteUrl + "creator/clean-cache", function(data) {

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

    $.post(absoluteUrl + "creator/generate-cache", function(data) {
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

  selectedId = $('#objList').val();

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

});

//CHANGING DEFAULT TEMPLATE
$('#templateDefaultCB').livequery('change', function(){

});

//BACKUP OF THE SITE
$('#backupSiteButton').livequery('click', function(){
  ajaxEventDone(lang.GBackup);
  $.get(absoluteUrl + "creator/backup-site", function(data){

    ajaxEmitMessage(data);
    setTimeout("$('#ajaxEventMask').click()", 1000);
  });
});

//SETTING PERMISSIONS
$('#restrictiveCB').livequery('click', function(){
  pageId = $('#pgID').html();

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
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );
  pageId = $('#pgID').html();

  $.get(absoluteUrl + "creator/set-permissions/rtype/page/id/" + pageId, function(data){

    $('#dialogDiv').html( data);
  });
  $('#dialogDiv').show('slow');
});

$('#catItems').livequery('change', function(){

});

//BOUND TO CONTENT AREA
$('#boundCB').livequery('click', function(){
  pageId = $('#pgID').html();

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

// close Manage All Pages window
$('#close-manage-all-pages').livequery('click', function(){
  $('#TB_closeWindowButton').trigger('click');
  return false;
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

      pid = $(this).prop('checked');
      if(pid == true){
        ar.push($(this).attr('value'));
      }
    });

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

      pid = $(this).prop('checked');
      if(pid == true){
        ar.push($(this).attr('value'));
      }
    });

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

      pid = $(this).prop('checked');
      if(pid == true){
        ar.push($(this).attr('value'));
      }
    });

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

      pid = $(this).prop('checked');
      if(pid == true){
        ar.push($(this).attr('value'));
      }
    });

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

      pid = $(this).prop('checked');
      if(pid == true){
        ar.push($(this).attr('value'));
      }
    });

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

    pid = $(this).prop('checked');
    if(pid == true){
      ar.push($(this).attr('value'));
    }
  });
  $('#dialogDiv').remove();
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content" style="z-index:999999 !important;"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );
  $.get(absoluteUrl + "page/set-permissions/pids/" + ar , function(data) {
    $('#dialogDiv').html(data);
  });
  $('#dialogDiv').show('slow');

  return false;
});

$('.exportToFTP').livequery('click',function(){

  ar = new Array();
  $('.chk_page').each(function(){

    pid = $(this).prop('checked');
    if(pid == true){
      ar.push($(this).attr('value'));
    }
  });
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content" style="z-index:9999999"></div>');
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
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );
  $('#dialogDiv').show();
  $.get(absoluteUrl + $(this).attr("href") +  $('#moduleName').val(), function(data){
    $('#dialogDiv').html( data);

  });
});

$('#ftpform').livequery(function(){
  $(this).ajaxForm(function(data){
    $('#dialogDiv').html(data);

    setTimeout("clickMask()", 1000); //closing all

  });
});

$('#objList').livequery('click', function(){
  const val = $(this).val();
  $('#objIDshow').html(val);

  // since 24.05 - show edit object above the hovered object
  const selectedObjID = $(this).val();
  showEditObjectButtons(selectedObjID);
  $('.selected-for-append').removeClass('selected-for-append');
  $('#'+ selectedObjID ).addClass('selected-for-append');

  $('#'+ selectedObjID ).trigger('click');
  $('#'+ selectedObjID ).trigger('mouseover'); // triger refresh of classes in ID assistant
});

$('#movePointer').livequery('click', function(){

  if( !$('.selected-for-append').hasClass('movable')) {
    $('#movePointer').addClass('bg-green-400');
    $('.selected-for-append').addClass('movable');
  } else {
    $('#movePointer').removeClass('bg-green-400');
    $('.selected-for-append').removeClass('movable');
    return;
  }

  const getMovingObjectID = $('.selected-for-append').attr('id');
  const getMovingObjectParent = $('.selected-for-append').parent();
  const getMovingObjectIndex = $('.selected-for-append').index();

});

$('#dropPointer').livequery('click', function(){

  if( $('.movable').length > 0 ){
    $('.movable').appendTo($('.selected-for-append'));
    $('#movePointer').removeClass('bg-green-400');
    $('.movable').removeClass('movable');
  }
});

$('#moveUpPointer').livequery('click', function(){
  const getMovingObjectID = $('.selected-for-append').attr('id');
  const getMovingObjectParent = $('.selected-for-append').parent();
  const getMovingObjectIndex = $('.selected-for-append').index();

  $('.selected-for-append').insertBefore($('.selected-for-append').prev());

});

$('#moveDownPointer').livequery('click', function(){
  const getMovingObjectID = $('.selected-for-append').attr('id');
  const getMovingObjectParent = $('.selected-for-append').parent();
  const getMovingObjectIndex = $('.selected-for-append').index();

  $('.selected-for-append').insertAfter($('.selected-for-append').next());

});

//FULSCREEN CSS and JS tabs

isFS = 0;
// do something interesting with fullscreen support
var fsButton = document.getElementById('fsbutton');
fsElement = document.getElementById('fragment-7wrapper');

var fsButton2 = document.getElementById('fsbutton2');
fsElement2 = document.getElementById('fragment-8wrapper');

var fsButton3 = document.getElementById('fsbutton3');
fsElement3 = document.getElementById('fragment-5wrapper');

var fsButtonAll = document.getElementById('fsbuttonAll');
fsElementAll = document.getElementById('body');

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
fsButton.addEventListener('click', function(e) {
  e.preventDefault();
  // if already in fullscreen, it needs to get out of it
  if( $(fsElement).hasClass('fs') === true ){
    window.fullScreenApi.cancelFullScreen(fsElement);
    $(fsElement).removeClass('fs');
    $('#pageCSS-ace').height('auto');
    return;
  }

  window.fullScreenApi.requestFullScreen(fsElement);
  $(fsElement).addClass('fs').find('iframe').height($(window).height());
  $('#pageCSS-ace').height( $(window).innerHeight() - $('#addCssCodeA').outerHeight() - $('#objListForCss').outerHeight() );

}, true);

//JS
fsButton2.addEventListener('click', function(e) {
  e.preventDefault();
  // if already in fullscreen, it needs to get out of it
  if( $(fsElement2).hasClass('fs') === true ){
    window.fullScreenApi.cancelFullScreen(fsElement2);
    $(fsElement2).removeClass('fs');
    $('#pageJS-ace').height('auto');
    return;
  }
  window.fullScreenApi.requestFullScreen(fsElement2);
  $(fsElement2).addClass('fs').find('iframe').height($(window).height());
  $('#pageJS-ace').height( $(window).innerHeight() - $('#addJsCodeA').outerHeight() - $('#objListForJs').outerHeight() - $('#eventListForJs').outerHeight() - 50 );

}, true);

//MODULES
fsButton3.addEventListener('click', function(e) {
  e.preventDefault();
  // if already in fullscreen, it needs to get out of it
  if( $(fsElement3).hasClass('fs') === true ){
    window.fullScreenApi.cancelFullScreen(fsElement3);
    $(fsElement3).removeClass('fs');
    return;
  }

  window.fullScreenApi.requestFullScreen(fsElement3);
  $(fsElement3).addClass('fs').find('iframe').height($(window).height());
  $('.ui-dialog').livequery(function(){
    if(window.fullScreen == 1){
      $(this).appendTo(fsElement3);
    }
  });

}, true);

// fullscreen All
fsButtonAll.addEventListener('click', function(e) {
  e.preventDefault();
  // if already in fullscreen, it needs to get out of it
  if( $(fsElementAll).hasClass('fs') === true ){
    window.fullScreenApi.cancelFullScreen(fsElementAll);
    $(fsElementAll).removeClass('fs');
    return;
  }
  window.fullScreenApi.requestFullScreen(fsElementAll);
  $(fsElementAll).addClass('fs').find('iframe').height($(window).height());
}, true);

//install/export template
//Exporting a template for use on another server
$('#exportTemplate').click(function(){
  $('#dialogDiv').remove();
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
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
  $('body').append('<div id="dialogDiv" class="bg-accent text-accent-content"></div>');
  dialog();
  $('#dialogDiv').html( $('#adminAjaxLoader').html() );
  // $('#dialogDiv').show();

  $.get(absoluteUrl + "page/install-template", function(data){
    $('#dialogDiv').html( data);

    $('#ajaxEventMask').remove();
  });
});

$('#chooseTemplateRevisionForm').livequery(function(){
  $(this).attr('action', $(this).attr('action') + 'file/' + $('#revisionSelect option:selected').text() );
  $(this).ajaxForm(function(data){

    //$('#uploadTemplateForm').html(data);
    ajaxEmitMessage(lang.TemplateInstalled );
    //setTimeout("$('#ajaxEventMessage').fadeOut(1000)", 1000);
    $('#dialogDiv').remove();
    //$('#folderNames').change();

    //ajaxEmitMessage(lang.FileUploaded);
    setTimeout("clickMask()", 1000); //closing all
  });
});

$('#ajaxEventMessage').livequery('click', function(){
  $('#ajaxEventMessage').remove();
});

//UPDATING CHECKBOXES, COMBOBOXES
$('select#objList').livequery('change', function(){

  $('input[type="checkbox"]').each(function(){
    if($(this).prop('checked') == true ) {
      // $(this).closest('span').addClass('checked');

    }  else{
      // $(this).closest('span').removeClass('checked');
    }
  });
  const val = $(this).val();
  $('#objIDshow').html(val);
  //$("#" + val).trigger('dblclick');
  showEditObjectButtons(val);
});
$('input[type="checkbox"]').livequery(function(){

});

//$('#contProperties').draggable(); // remove dragging of the properties in daisyui upgrade

$('#enableModulesLink').click(function(){
  url = $(this).attr('href');
  $.get(url,function(data){alert(data) ; });
});
