// jsCycle.js
	
$(function() {
	//if (typeof document.body.style.maxHeight != "undefined"){
    // run the code in the markup!
		eval($('#banner')
			.cycle({
				fx:    'scrollLeft',
				speed:  'slow'
		}));
		$('#banner').cycle('pause');
	//}
});	

function slideBanner(num,lVal) {
     
	$('#banner').show();
	$('#banner').cycle(num);

	//var leftvar = $('#'+lVal).offsetLeft;
    var leftvar = lVal;


	$("#banner_current").animate({ 
        left: leftvar
      }, 'slow' );
	
}