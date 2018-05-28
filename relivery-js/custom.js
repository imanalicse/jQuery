jQuery(document).ready(function ($) {

    var pageBody = $("body");

    jQuery('.go-to').click(function (ev) {
        ev.preventDefault();
        var scroll_top = $($(this).attr('data-go-to')).offset().top;
        var traveling_distance = $(this).offset().top - scroll_top;
        var speed = parseInt(traveling_distance / 3);
        customScrollTo(scroll_top, speed);
    });

    var contactUsPopupEl = pageBody.find(".contact-us-popup");
    $(".contact-us").on("click", function (ev) {
        ev.preventDefault();
        contactUsPopupEl.fadeIn();
        contactUsPopupEl.find(".wpcf7-not-valid-tip").hide();
        contactUsPopupEl.find(".wpcf7-validation-errors").hide();
    });

    contactUsPopupEl.find(".cancel").on("click", function (ev) {
        ev.preventDefault();
        contactUsPopupEl.fadeOut();
    });

    //var isiOS = (navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1);
    var isiOS = (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1);
    if(isiOS){
        var contactForm = contactUsPopupEl.find("form");
        var validator =  contactForm.validate({
            rules: {
                fullname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true
                }
            },
            messages: {
                fullname: "Full Name is required",
                email: {
                    required: "Email is required",
                    email: "Please enter a valid email address"
                },
                message: "Message is required"
            }
        });
    }

    var newsletterForm = $(".newsletter-subscriber").find("form");
    newsletterForm.submit(function (event) {
        var email = newsletterForm.find('#mce-EMAIL').val();
        if (!IsEmail(email)) {
            $('.newsletter_mail_error').html('Please enter valid email');
            event.preventDefault();
        } else {
            $('.newsletter_mail_error').html('');
        }
    });

    /*var video_code = $(".video-code").val();
    var video_type = $(".video-type").val();
    if(video_code) {
        if(video_type =='vimeo') {
            $.ajax({
                type: 'GET',
                url: '//vimeo.com/api/v2/video/' + video_code + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    var thumbnail_src = data[0].thumbnail_large;
                    if (thumbnail_src) {
                        pageBody.find('.thumb-container img').attr("src", thumbnail_src);
                    }
                }
            });
        }
    }*/

    $(".play-video").colorbox({iframe:true, innerWidth:'80%', innerHeight:'70%'});

});

function customScrollTo(topValue, time) {
    jQuery("html, body").animate({
        scrollTop: topValue
    }, time);
}

/*function showVideo(code, type) {

    if (code) {
        if (type == 'youtube') {
            var iframe = '<iframe width="496" height="296" src="https://www.youtube.com/embed/' + code + '?rel=0&autoplay=true" frameborder="0" allowfullscreen></iframe>';
        } else if (type == 'vimeo') {
            var iframe = '<iframe width="496" height="296" src="https://player.vimeo.com/video/' + code + '?autoplay=1&byline=0&rel=0" frameborder="0" allowFullScreen webkitAllowFullScreen></iframe>';
        }

        var videoContainer = jQuery('.video-container');
        var thumbContainer = jQuery('.thumb-container');
        videoContainer.html(iframe);
        thumbContainer.animate({
            opacity: 0,
        }, 1000, function () {
        });

        videoContainer.animate({
            opacity: 1,
        }, 2000, function () {
        });
    }
}*/

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}