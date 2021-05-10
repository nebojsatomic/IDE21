//CODEPRESS FIX
codepressOff = false;
//if($.browser.mozilla == false) {
//  codepressOff = true;
//}
if($('html.gecko').length == 0 ) {
  codepressOff = true;
}
if(codepressOff == true) {
    $('.codepress').removeClass("codepress");
}
