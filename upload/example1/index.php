<html>
<head>
    <title>AJAX Multi Images Upload in PHP </title>

    <script src="https://code.jquery.com/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(document).ready(function (e) {
            $("#imguploadform").on('submit',(function(e) {
                e.preventDefault();
                $.ajax({
                    url: "upload.php",
                    type: "POST",
                    data:  new FormData(this),
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(data){
                        $("#gallery").html(data);
                    },
                    error: function(){}
                });
            }));
        });
    </script>
</head>
<body>
<div class="gallery-bg">
    <form id="imguploadform" action="upload.php" method="post">
        <div id="gallery"></div>
        <div id="uploadFormLayer">
            <p class="txt-subtitle">Select Multiple Files:</p>
            <p><input name="userImage[]" type="file" multiple/><p><!--
<p><input name="userImage[]" type="file"/><p>
<p><input name="userImage[]" type="file"/><p> -->
            <p><input type="submit" value="Submit" class="btnUpload" /><p>
        </div>
    </form>
</div>
</body>
</html>