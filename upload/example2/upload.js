$(document).ready(function (e) {
    
    $('#webalive_logo_input').on('change', function(e) {
        websiteLogoUpload(e);
    });

    function websiteLogoUpload(event) {
        var file = event.target.files;
        var parent = $("#" + event.target.id).parent();
        var data = new FormData();
        // data.append("action", "webalive_logo_upload");
        $.each(file, function(key, value) {
            data.append("userImage", value);
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
                    var appender = $("#append-logo-files");
                    var img = '<p><img src="' + data.url+ '" height="100"><p>';
                    appender.append(img);
                }
                console.log(data);
            }
        });

    }
});