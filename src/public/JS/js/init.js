 $(document).ready(function(){
	
	// partneri
	 $('#mycarousel').jcarousel();
	
	// Form Input
	 $('.change').focus(function() {
		if (this.value == this.defaultValue) {
	 this.value = ''; }});
	 
	 $('.change').blur(function() {
		if (this.value == '') {
	 this.value = this.defaultValue; }});
	 
	 $('ul.faq-list li span').hide();
	$('ul.faq-list li a').click(function() {
		$(this).next('ul.faq-list li span').slideToggle(500);
	});
	 
	 //Fancybox
	 $("a.fancybox").fancybox();
	 

 });
	 
