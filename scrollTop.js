jQuery(document).ready(function(){
	jQuery('.home_arrow').bind('click', function(){
	  var item_top = jQuery(".home_page_content").offset().top;
		scrollTo(item_top);
	});
	function scrollTo(top) {
		jQuery("html").animate({scrollTop: top});
	}
});