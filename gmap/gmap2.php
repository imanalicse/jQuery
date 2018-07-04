<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<body>

<div style="display: flex; justify-content: center">
    <div id="googleMap" style="width:100%;height:400px;"></div>
</div>

<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript">
    var geocoder = new google.maps.Geocoder();
    var address = "new york";
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
        }
    });
</script>

<script>
    function myMap() {

        var mapProp = {
            center: new google.maps.LatLng(-37.837544, 144.992918),
            zoom: 5,
        };

        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(-37.837544, 144.992918),
            //animation: google.maps.Animation.BOUNCE,
            icon: 'images/wa-man.png'
        });

        marker.setMap(map);


        var infowindow = new google.maps.InfoWindow({
            content:"Hello World!"
        });

        google.maps.event.addListener(marker, 'click', function (event) {
            infowindow.open(map, marker);
            //map.setZoom(9);
        });

    }
</script>

<!--<script-->
<!--    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAy0AhMvIGk9skz_hhVTeJ1m0CMwaywLGs&callback=myMap"></script>-->

</body>
</html>