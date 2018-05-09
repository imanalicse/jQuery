
<span class="drag_value"></span>
<div class="bar_area" id="parcel_weight">
	<div class="color_indicator"></div>
	<div class="draggable">
		<img src="circle_small_indicator.png"/>
	</div>
</div>
<input type="hidden" name="weight" class="parcel_weight" value="">

<script>
jQuery(document).ready(function($) {
	draggableFunc();
	
	/*
	$.ajax({
		type:"POST",
		url: ajax_url,
		data: data,
		success: function(response){
			$('.form_area').html(response);
			draggableFunc();
		}
	});
	*/
	
 });
 
 function draggableFunc(){
    $( ".draggable" ).draggable({
        containment: 'parent',
        scroll: true,
        scrollSensitivity: 100,
        drag: function( event, ui ) {
            var total_w = $(this).parent().width();
            var total_slice = 50;
            var per_slice_w = parseInt(total_w / total_slice);
            var bar_area_left = $(this).parent().offset().left;
            var pixel_difference = $(this).offset().left - bar_area_left;
            var current_slice = Math.ceil(pixel_difference / per_slice_w);
            $('.drag_value').html(current_slice);
            $('.color_indicator').width(pixel_difference);
            $('.drag_value').css({
                left:pixel_difference
            });
        },
        stop: function( event, ui ) {
            $('.parcel_weight').val($('.drag_value').html());
            //calculator();
        }
    });
} 
</script>

<style>
.bar_area {
    width: 125px; position:relative;
    border-radius: 10px 10px 10px 10px;
    margin-top: 10px;
    background: #ccc;
    height: 10px;
}
.draggable {
    width: 25px;
    position: absolute;
    top: -8px !important;
}
.color_indicator{
    background: #BD4967;
    border-radius: 10px 10px 10px 10px;
    height: 10px;
    width:0;
}
.drag_value{
    position: relative;
    left: 10px;
}
</style>

