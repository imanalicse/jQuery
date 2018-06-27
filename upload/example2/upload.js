$(document).ready(function (e) {
    
    $('.uploadField').on('change', function(ev) {
        uploader(this, ev);
    });

    function uploader(self, event) {
        var file = event.target.files;
        var uploadContainer = $(self).parents(".upload-container");
        var data = new FormData();
        // data.append("action", "webalive_logo_upload");
        $.each(file, function(key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: "upload.php",
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                if(data.status == 'success') {
                    var appender = uploadContainer.find(".preview");
                    var img = '<p><img src="' + data.url+ '" height="100"><p>';
                    appender.append(img);
                }
                console.log(data);
            }
        });

    }
});