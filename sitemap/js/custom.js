  (function($) {
    $('.tabs .tab-links a').on('click', function(e){
        e.preventDefault();
        var currentAttrValue = $(this).attr('href');
        $('.tabs ' + currentAttrValue).show(500).siblings().hide(500);
        $(this).parent('li').addClass('active').siblings().removeClass('active');
    });


    function close_accordion_section(){
        $('.accordion .accordion-section-title').removeClass('active');
        $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
    }
    $('.accordion-section-title').click(function(e){
        e.preventDefault();

        var currentAttrValue = $(this).attr('href');

        if($(e.target).is('.active')){
        }else{
            close_accordion_section();

            $(this).addClass('active');

            $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
        }
    });

}(jQuery));

