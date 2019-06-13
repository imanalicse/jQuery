/*
* Scroll to top functionality
* */
jQuery('.home_arrow').on('click', function(){
  var item_top = jQuery(".home_page_content").offset().top;
	scrollTo(item_top);
});

function scrollTo(top) {
	jQuery("html").animate({scrollTop: top});
}

/*
* Finding Scroll direction
*/
var previousScroll = 0;
jQuery(window).scroll(function (){
	var currentScroll = jQuery(this).scrollTop();
	if (currentScroll > previousScroll){
		console.log('down');
	} else {
		console.log('up');
	}
	previousScroll = currentScroll;
});

