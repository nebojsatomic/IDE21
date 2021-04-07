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