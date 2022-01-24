document.addEventListener("DOMContentLoaded", function(event) {
    var data = [];
    for (var i = 0; i < 100000; i++) {
        var tmp = [];
        for (var i = 0; i < 100000; i++) {
            tmp[i] = 'hue';
        }
        data[i] = tmp;
    };
    console.log(data);
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            console.log("xhr")
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    console.log(percentComplete);
                    $('.progress').css({
                        width: percentComplete * 100 + '%'
                    });
                    if (percentComplete === 1) {
                        $('.progress').addClass('hide');
                    }
                }
            }, false);
            xhr.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    console.log(percentComplete);
                    $('.progress').css({
                        width: percentComplete * 100 + '%'
                    });
                }
            }, false);
            return xhr;
        },
        type: 'POST',
        url: "http://localhost/codehub/jQuery/progress_bar/progress_bar.php",
        data: data,
        success: function (resp) {
            console.log("Success");
        }
    });
});
