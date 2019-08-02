<!DOCTYPE html>
<html>
<head>
    <title>  </title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<link rel="stylesheet" href="jquery.bxslider.css">
	<script src="jquery.bxslider.js"></script>
	<style>
		.slider-wrapper{
			width: 500px;
			margin: 0 auto;
		}
		.home_slider img{
			width: 500px;
			height: 500px;
		}
		.custom-pager {
			overflow: auto;
			display: flex;
			position: relative;
		}
		.custom-pager img{
			width: 100px;
			height: 100px;
		}
		.custom-pager .active img{
			border: 1px solid red;
		}
	</style>
</head>

<body>
<?php
	$total_image = 12;
	$images = array();
	for($i = 1; $i <= $total_image; $i++){
		$images[] = '../images/'.$i.'.jpg';
	}
?>
<div class="slider-wrapper">
	<ul class="home_slider">
		<?php foreach ($images as $image){ ?>
			<li><img src="<?php echo $image; ?>" /></li>
		<?php } ?>
	</ul>

	<div class="custom-pager">
		<?php foreach ($images as $index=> $image){ ?>
			<a href="" data-slide-index="<?php echo $index; ?>"><img src="<?php echo $image; ?>"></a>
		<?php } ?>
	</div>
	<div class="custom-pager-counter">
		<span class="current-counter">1</span>/<span class="total-counter"></span>
	</div>
</div>

</body>

</html>

<script>
	$(document).ready(function(){

		var pagerSelector = '.custom-pager';
		var $pagerSelector = $(pagerSelector);
		var customPagerCounterSelector = $('.custom-pager-counter'); 

		var slider = $(".home_slider").bxSlider({
			pagerCustom: pagerSelector,
			onSliderLoad: function (currentIndex) {
				setTimeout(function () {
					sliderCounter();
				}, 200);
			},
			onSlideAfter: function (currentElement, oldIndex, newIndex) {
				sliderCounter(slider);
				var activePager = $pagerSelector.find("a.active");
				var activePagerLeftPosition = activePager.position().left;
				var currScroll = $pagerSelector.scrollLeft();
				var pagerWidth = $pagerSelector.width();
				var activeOuterWidth = activePager.outerWidth();
				var newLeft = activePagerLeftPosition + currScroll - pagerWidth + activeOuterWidth;
				$pagerSelector.animate({ scrollLeft: newLeft}, 200);
				console.log('=======================');
			}
		});

		function sliderCounter() {
			var totalSlides = slider.getSlideCount();
			var currentSlideNumber = slider.getCurrentSlide() + 1;
			customPagerCounterSelector.find('.current-counter').text(currentSlideNumber);
			customPagerCounterSelector.find('.total-counter').text(totalSlides);
		}
	});
</script>

