function initialize() {

    var latlng = new google.maps.LatLng(-37.837544, 144.992918);
    var settings = {
        zoom: 15,
        center: latlng,
        mapTypeControl: true,
        scrollwheel: false,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            stylers: [
                { saturation: -100 }
            ]
        }]
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), settings);

    //marker
    // if you want to show custom indicator please omit icon option
    var indicator = new google.maps.MarkerImage('images/wa-man.png',
        new google.maps.Size(26,43),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 43)
    );
    var companyPos = new google.maps.LatLng(-37.837544, 144.992918);
    var companyMarker = new google.maps.Marker({
        position: companyPos,
        map: map,
        icon: indicator,
        title:"Suite 910, 9 Yarra St, South Yarra, VIC 3141, Australia",
        animation: google.maps.Animation.BOUNCE
    });


    // marker 2
    var companyLogo = new google.maps.MarkerImage('images/webalive-address.png',
        new google.maps.Size(429,160),
        new google.maps.Point(0,0),
        new google.maps.Point(213,0)
    );
    var companyMarker = new google.maps.Marker({
        position: companyPos,
        map: map,
        icon: companyLogo,
        draggable:true
    });
}

