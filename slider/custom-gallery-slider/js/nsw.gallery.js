
/**
 * Initial Slide Index
 */
var slideIndex = 1;

/**
 * On Click Add A New Slide 
 */
function plusSlides(n) {    
    showSlides(slideIndex += n);
}

/**
 * Detect Current Slide 
 */
function currentSlide(n) {
    showSlides(slideIndex = n);
}

/**
 * Slider Init
 */
function showSlides(n) {
    var i;
    var slides      = document.getElementsByClassName('js-slide-item'); //Slides images
    var dots        = document.getElementsByClassName("js-thumbnail-item"); // thumbnail images
    var captionText = document.getElementById("caption");

    if (n > slides.length){
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
    }
    for (i = 0; i < dots.length; i++) {
        slides[i].classList.remove('active');
        dots[i].classList.remove('active');
    }
    
    slides[slideIndex-1].style.opacity = "1";
    slides[slideIndex-1].classList.add("active");
    dots[slideIndex-1].classList.add("active");
    captionText.innerHTML = dots[slideIndex-1].alt;
}

(function($) {
    'use strict';
    /**
     * On Gallery Image Click
     */
    $('.js-gallery-grid img').on('click', function(e) {
        // Displaying Popup Gallery
        $('.js-popup-gallery').removeClass('hide');
        // Getting clicked image data-item value
        var clickedImage = $(this).data('item');
        // Cloning all images inside gallery
        var images = $('.js-gallery-grid *').clone().get();
        // Appending image in gallery appender
        $('.js-gallery-grid-appender').append(images);

        // Cloning thumbnails
        var thumbnails = $('.js-gallery-grid *').clone().get();
        $('.js-gallery-thumbnails').append(thumbnails);
        $('.js-gallery-thumbnails img').each(function(index, item) {
            $(this).removeClass('js-slide-item')
            .addClass('js-thumbnail-item cursor')
            .attr('onclick', 'currentSlide('+(index+1)+')')
            .attr('alt', 'Caption of image '+(index+1));
        });        
        // Init Slider
        slideIndex = clickedImage;
        showSlides(slideIndex);

        // Removing the .js-slide-item class
        $('.js-gallery-grid img').removeClass('js-slide-item');
        // Active the slide Item
        $('.js-gallery-grid-appender img').each(function(index, item) {
            if( $(this).data('item') == clickedImage ) {
                $(this).css('opacity', '1')
                .addClass('active');
            }
        })

        // Active the thumbanil
        $('.js-gallery-thumbnails img').each(function(index, item) {
            if( $(this).data('item') == clickedImage ) {
                $(this).addClass('active');
            }
        });        
    });

    /**
     * On Closing the gallery popup
     */
    $('.js-close-gallery').on('click', function(e) {
        e.preventDefault();
        $('.js-popup-gallery').addClass('hide');
        $('.js-gallery-grid img').css('opacity', '1').addClass('js-slide-item');
        $('.js-gallery-grid-appender').empty();
        $('.js-gallery-thumbnails').empty();
    })

    /**
     * Sync active slide with active thumbnail
     */
    $(document.body).on('click', '.js-gallery-thumbnails img', function(e) {
        $('.js-gallery-grid-appender img').removeClass('active');
        $(this).addClass('active');
        var thumbItem = $(this).data('item');
        $('.js-gallery-grid-appender img').each(function(index, item) {
            var slideItem = $(this).data('item');
            if( thumbItem == slideItem ) {
                $(this).addClass('active');
            }
        })
    })

    /**
     * ZoomIn
     */
    $(document.body).on('click', '.js-gallery-zoomIn', function(e) {
        e.preventDefault();
        $('.js-gallery-grid-appender .js-slide-item.active').removeClass('zoomOut rotate').addClass('zoomIn');
    })

    /**
     * ZoomOut
     */
    $(document.body).on('click', '.js-gallery-zoomOut', function(e) {
        e.preventDefault();
        $('.js-gallery-grid-appender .js-slide-item.active').removeClass('zoomIn rotate').addClass('zoomOut');
    })

    /**
     * Rotate 90deg
     */
    $(document.body).on('click', '.js-gallery-rotate', function(e) {
        e.preventDefault();
        $('.js-gallery-grid-appender .js-slide-item.active').removeClass('zoomIn').removeClass('zoomOut').toggleClass('rotate');
    })
    
    /**
     * Expand
     */
    $(document.body).on('click', '.js-gallery-expand', function(e) {
        e.preventDefault();
        var imageSource = $('.js-gallery-grid-appender .js-slide-item.active').attr('src');
        $('.js-expand-gallery').removeClass('hide').css('background-image', 'url("'+imageSource+'")');
    })

    /**
     * Expand Close
     */
    $(document.body).on('click', '.js-expand-close', function(e) {
        e.preventDefault();
        $('.js-expand-gallery').addClass('hide');
    })

    /**
     * Close Expand on esc button press
     */
    $(document).on('keydown', function(event) {
        if (event.key == "Escape") {
            // Close Expand Image
            $('.js-expand-gallery').addClass('hide');
        }
    });

    

})(jQuery);