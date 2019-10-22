$(document).ready(function () {
    var $sub_page_selector = $(".arrow-box-b");
    var $same_level_page_selector = $(".arrow-box-r");
    var $delete_selector = $(".opt-ic");

    var sub_page_width = $sub_page_selector.outerWidth();
    var current_page;
    var page = 1;

    $(document).on('mouseenter', '.area-block', function (e) {
        var _self = $(this);
        var top = _self.offset().top;
        var left = _self.offset().left;
        var area_block_height = $('.area-block').outerHeight();
        var area_block_width = $('.area-block').outerWidth();
        $sub_page_selector.show();

        $sub_page_selector.css({
            left: left + (area_block_width / 2) - (sub_page_width / 2),
            top: top + area_block_height
        });

        if(!_self.hasClass('page-root')) {
            $same_level_page_selector.show();
            $same_level_page_selector.css({
                left: left + area_block_width,
                top: top
            });
        }

        current_page = $(this).closest(".tree-leaf");

    }).on('mouseleave', '.area-block',  function(e){
        //console.log(e.relatedTarget);
        if($(e.relatedTarget).hasClass('arrow-box-b')){
            $(document).on('mouseleave', '.arrow-box-b', function (e) {
                $sub_page_selector.hide();
            });
        }else{
            $sub_page_selector.hide();
        }

        if($(e.relatedTarget).hasClass('arrow-box-r-inner')){
            $(document).on('mouseleave', '.arrow-box-r-inner', function (e) {
                $same_level_page_selector.hide();
            });
        }else{
            $same_level_page_selector.hide();
        }

    });

    $sub_page_selector.on('click', function () {

        page++;

        var sub_pages = current_page.find('> .tree-children').html();

        var nochilds_class = '';
        if(!sub_pages || sub_pages.trim().length == 0){
            nochilds_class = 'nochilds';
        }
        current_page.find('> .tree-node').find(".area-block").removeClass('nochilds');

        var subpage_html = '<li class="tree-leaf">'+
            '<div class="tree-node">'+
            '<div class="blank-space"></div>'+
            '<div class="area-block '+nochilds_class+'">'+
            '<textarea maxlength="250" class="disabled">Page '+page+'</textarea>'+
            '<div class="opt-ic">'+
            '<i class="fas fa-ic fa-minus-circle"></i>'+
            '</div>'+
            '<div class="cps-ic">'+
            '<i class="fas fa-ic fa-caret-up"></i>'+
            '</div>'+
            '</div>'+
            '<div class="blank-space"></div>'+
            '</div>'+
            '<ul class="tree-children">'+ sub_pages
        '</ul>'+
        '</li>';

        current_page.find("> .tree-children").html(subpage_html);

        hideIndicator();
        domTrigger();
    });

    $same_level_page_selector.on("click", function () {
        page++;
        var same_level_page_template = '<li class="tree-leaf">'+
            '<div class="tree-node">'+
            '<div class="blank-space"></div>'+
            '<div class="area-block nochilds">'+
            '<textarea maxlength="250" class="disabled">Page '+page+'</textarea>'+
            '<div class="opt-ic">'+
            '<i class="fas fa-ic fa-minus-circle"></i>'+
            '</div>'+
            '<div class="cps-ic">'+
            '<i class="fas fa-ic fa-caret-up"></i>'+
            '</div>'+
            '</div>'+
            '<div class="blank-space"></div>'+
            '</div>'+
            '<ul class="tree-children">'
        '</ul>'+
        '</li>';
        current_page.after(same_level_page_template);
        hideIndicator();
        domTrigger();
    });

    domTrigger();




    function hideIndicator() {
        $sub_page_selector.hide();
        $same_level_page_selector.hide();
    }

    function domTrigger() {

        $(".area-block").dblclick(function () {
            var _self = $(this);
            _self.find("textarea").removeClass("disabled");
        });

        $(".area-block").on("click", function (event) {
            var _self = $(this);
            _self.addClass('sel');
            _self.find(".opt-ic").show();
            hideIndicator();
        });

        $(".opt-ic").on("click", function () {
            var _self = $(this);

            var removeEl = _self.closest(".tree-leaf");
            if(removeEl.siblings().length == 0){
                removeEl.parent().closest(".tree-leaf").find('> .tree-node').find(".area-block").addClass("nochilds");
            }

            _self.closest(".tree-leaf").remove();
            hideIndicator();
        });


        $(".tree-leaf").draggable({
            //cancel: '',
            //cursor: "crosshair",
            //distance: 10,
            //helper: 'clone',
            revert: 'invalid',
            //snap: true,
            opacity: 0.9, // Opacity for the helper while being dragged.
            zIndex: 100, // Z-index for the helper while being dragged.
            helper: function () {
                var _self = $(this);
                var helperText =  _self.find("> .tree-node").find(".area-block").text();
                var html = '<div class="drag-box">'+helperText+'</div>';
                return html;
            },
            stop: function( event, ui ) {
                // console.log('stop');
                // console.log('event',event);
                // console.log('ui',ui);
            }

        });

        $(".area-block").droppable({
            //snap: true,
            hoverClass: "highlight",
            tolerance: "intersect", //default: intersect, touch, pointer
            drop: function (event, ui) {

                //From Drag: add nochilds class if has no sibling
                if($(ui.draggable).siblings().not(".drag-box").length == 0) {
                    $(ui.draggable).parent().closest(".tree-leaf").find('> .tree-node').find(".area-block").addClass('nochilds');
                }

                // Insert element
                $(this).closest(".tree-leaf").find("> .tree-children").append(ui.draggable);

                //In drag: Child class management
                var current_node = $(this).closest(".tree-leaf");
                if(current_node.length > 0){
                    current_node.find('> .tree-node').find(".area-block").removeClass('nochilds');
                }else{
                    current_node.find('> .tree-node').find(".area-block").addClass('nochilds');
                }
                current_node.find(".tree-leaf").each(function () {
                    var inner = $(this);
                    if(inner.find(".tree-leaf").length > 0){
                        inner.find(".tree-leaf").find('> .tree-node').find(".area-block").removeClass('nochilds');
                    }else{
                        inner.find(".tree-leaf").find('> .tree-node').find(".area-block").addClass('nochilds');
                    }
                });
            }
        });

        $(".area-block textarea").on("keyup", function () {
            $(this).html($(this).val());
        });
    }

    $(document).click(function(e) {
        if($(e.target).closest('.area-block').length){
            var element = $(e.target).closest('.area-block');
            $(".area-block").not(element).removeClass("sel");
            $(".area-block").not(element).find('.opt-ic').hide();
        }else{
            unSelectDeleteElement();
        }

        if($(e.target).closest('.area-block').find("textarea").length){
            var element = $(e.target).closest('.area-block').find("textarea");
            $(".area-block").find("textarea").not(element).addClass("disabled");
        }else{
            $(".area-block").find("textarea").addClass("disabled");
        }
    });

    function unSelectDeleteElement() {
        $(".opt-ic").hide();
        $(".area-block").removeClass('sel');
    }
});
