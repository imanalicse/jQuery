<!DOCTYPE html>
<html>
<head>
    <title>  </title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>
<style>
    .flex-container {
        display: flex;
        flex-wrap: wrap;
    }
    .flex-container > div {
        background-color: #f1f1f1;
        margin: 10px;
        padding: 20px;
        width: 500px;
        height: 500px;
    }
</style>
<body>
    <div class="loading"><img src="loading.gif"></div>

    <div class="flex-container load-appender">

    </div>

</body>
</html>

<script>

    var item_per_page = 10;
    var offset_value = 0;
    var load_data = true;
    LoadMore();
    jQuery(window).scroll(function($) {
        if(jQuery(window).scrollTop() + jQuery(window).height() == jQuery(document).height() && load_data==true) {
            LoadMore();
        }
    });

    function LoadMore() {
        $(".loading").show();
        load_data = false;

        jQuery.ajax({
            type: 'POST',
            url: 'load-more.php',
            data: {
                item_per_page: item_per_page,
                offset_value: offset_value
            },
            beforeSend: function () {

            },
            success: function(resp){
                if(resp) {
                    $(".load-appender").append(resp);
                    offset_value = offset_value + item_per_page;
                    load_data = true;
                }
                $(".loading").hide();
            }
        });
    }


</script>