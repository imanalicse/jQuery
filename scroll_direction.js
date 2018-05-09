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
	