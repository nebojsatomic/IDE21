//CODEPRESS FIX
//codepressOff = false;
codepressOff = true; // codepress will have to be replaced with something new

//if($.browser.mozilla == false) {
//  codepressOff = true;
//}
if($('html.gecko').length == 0 ) {
  codepressOff = true;
}
if(codepressOff == true) {
    $('.codepress').removeClass("codepress");
}
