<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<body>

<div style="display: flex; justify-content: center">
    <div id="googleMap" style="width:100%;height:400px;"></div>
</div>

<!--<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>-->
<script type="text/javascript">
    //    var geocoder = new google.maps.Geocoder();
    //    var address = "new york";
    //    var addresses = [];
    //    addresses.push('new york');
    //    addresses.push('WebAlive, 910 Yarra Street, South Yarra VIC, Australia');
    //    geocoder.geocode( { 'address': address}, function(results, status) {
    //        if (status == google.maps.GeocoderStatus.OK) {
    //            var latitude = results[0].geometry.location.lat();
    //            var longitude = results[0].geometry.location.lng();
    //        }
    //    });
</script>

<?php

function getLatituteLongituteByAddress($addresss)
{
    $address = urlencode($addresss);
    $jsonurl = "http://maps.google.com/maps/api/geocode/json?address=" . $address;
    $json = file_get_contents($jsonurl);
    $response = json_decode($json, true);
    if (!empty($response)) {
        if ($response['status'] == 'OK') {
            return $response['results'][0]['geometry']['location'];
        }
    }
    return '';
}

$address = 'WebAlive, 910 Yarra Street, South Yarra VIC, Australia';
//$lat_lng = getLatituteLongituteByAddress($address);
//echo '<pre>';
//echo print_r($lat_lng);
//echo '</pre>';
?>

<script>
    function initMap() {


        //-37.838260, 144.993674
//        var geocoder = new google.maps.Geocoder();
//        var address = "WebAlive, 910 Yarra Street, South Yarra VIC, Australia";
//        geocoder.geocode( { 'address': address}, function(results, status) {
//            if (status == google.maps.GeocoderStatus.OK) {
//                var latitude = results[0].geometry.location.lat();
//                var longitude = results[0].geometry.location.lng();
//            }
//        });


        var mapSetting = {
            center: new google.maps.LatLng(-37.837544, 144.992918),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            //scrollwheel: false,
        };

        var map = new google.maps.Map(document.getElementById("googleMap"), mapSetting);

        var makerData = [
            {
                location: {lat: -37.837544, lng: 144.992918},
                content: 'WebAlive, 910 Yarra Street, <br/> South Yarra VIC, Australia'
            },
            {
                location: {lat: -37.838260, lng: 144.993674},
                content: 'South Yarra VIC 3141, Australia'
            }
        ];

        makerData.forEach(function (element) {

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(element.location.lat, element.location.lng),
            });
            marker.setMap(map);

            var infowindow = new google.maps.InfoWindow({
                content: element.content
            });
            google.maps.event.addListener(marker, 'click', function (event) {
                infowindow.open(map, marker);
                map.setZoom(16);
            });
        });
    }
</script>

<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAy0AhMvIGk9skz_hhVTeJ1m0CMwaywLGs&callback=initMap"></script>

</body>
</html>