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
                var appender = uploadContainer.find(".preview");
                if(data.length > 0) {
                    $.each(data, function (key, value) {
                        if(value.status == 'success') {
                            var img = '<p><img src="' + value.url + '" height="100"> <span data-url=' + value.url + ' class="delete">X</span><p>';
                            appender.append(img);
                        }
                    });
                    console.log(data);
                }
            }
        });
    }

    $(document).on('click', '.delete', function () {
         var self = $(this);
         var file_url = self.attr("data-url");
        var data = { file_url: file_url};
        $.ajax({
            url: "delete.php",
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                console.log(data)
                if( data.response == "SUCCESS" ) {
                    self.parent('p').remove();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });
    });
});