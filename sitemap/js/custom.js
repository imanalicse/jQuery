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


jQuery(document).ready(function () {
    $(document).ready(function () {
        var $subPage = $(".arrow-box-b");

        var sub_page_width = $(".arrow-box-b").outerWidth();
        var current_page;

        $(document).on('mouseenter', '.area-block', function (e) {
            var _self = $(this);
            var top = _self.offset().top;
            var left = _self.offset().left;
            var area_block_height = $('.area-block').outerHeight();
            var area_block_width = $('.area-block').outerWidth();
            $subPage.show();
            $subPage.css({
                left: left + (area_block_width / 2) - (sub_page_width / 2),
                top: top + area_block_height
            });

            current_page = $(this).closest(".tree-leaf");

        }).on('mouseleave', '.area-block',  function(e){

            if($(e.relatedTarget).hasClass('arrow-box-b')){
                $(document).on('mouseleave', '.arrow-box-b', function (e) {
                    $(".arrow-box-b").hide();
                });
            }else{
                $(".arrow-box-b").hide();
            }
        });

        $subPage.on('click', function () {
            console.log(current_page);
            var subpage_Html = '<li class="tree-leaf">'+
                '<div class="tree-node">'+
                '<div class="blank-space"></div>'+
                '<div class="area-block nochilds">'+
                '<textarea maxlength="250">Page</textarea>'+
                '</div>'+
                '<div class="blank-space"></div>'+
                '</div>'+
                '<ul class="tree-children">'+
                '<li class="tree-leaf"></li>'+
                '</ul>'+
                '</li>';

            current_page.find(".tree-children").html(subpage_Html);
        });
    });

});

