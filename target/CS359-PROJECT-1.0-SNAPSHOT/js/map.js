function show_map() {
    if(map_showed == 1) return;
    map_showed = 1;

    $("#map").width(600);
    $("#map").height(500);

    map = new OpenLayers.Map("map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    //Orismos Thesis
    function setPosition(lat, lon){
            var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
            var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
            var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
            return position;
    }

    //Orismos Handler
    function handler(position){
            var popup = new OpenLayers.Popup.FramedCloud("Popup", 
                    position, null,
                    message, null,
                    true // <-- true if we want a close (X) button, false otherwise
            );
            map.addPopup(popup);
    }

    //Markers
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    //Protos Marker
    var position=setPosition(lat, lon);
    var mar=new OpenLayers.Marker(position);
    markers.addMarker(mar);	
    mar.events.register('mousedown', mar, function(evt) { 
            handler(position);}
    );

    //Orismos zoom
    const zoom = 10;
    map.setCenter(position, zoom);
}

function handle_check_position(){
    if(submitted == 1) {
        var city = $("#city").val();
        if(city != previous_city) {
                $("#map").empty();
                $("#map").width(0);
                $("#map-event-div").empty();
                $("#map").height(0);
                map_showed = 0;
        } else {
                return;
        }
    }
    submitted = 1;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const obj = JSON.parse(xhr.responseText);
            addressDetails = obj[0];
            if(obj[0] == null) {
                    $("#map-event-div").append("<label>I dont know about this address</label><br><br>");
                    return;
            }
            lat = addressDetails.lat;
            lon = addressDetails.lon;

            var displayName = addressDetails.display_name;

            if(!(displayName.includes("Heraklion"))) {
                    $("#map-event-div").append("<label>Only in Heraklion!</label><br>");
                    $("#submit-button").prop("disabled", true);
                    return;
            }

            $("#submit-button").prop("disabled", false);

            $("#map-event-div").append("<label>You can view the pin on the map by clicking this button</label>");
            $("#map-event-div").append("<br><br><input type='button' id='show-map-button' onclick='show_map()' value='Show on map'><br><br>");
        }
    });

    var country = $("#country").val();
    var city = $("#city").val();
    var addressName = $("#address").val();
    var address = addressName + " " + city + " " + country; 

    previous_city = city;

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + "&accept-language=en&polygon_threshold=0.0");

    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    var key = "99c3177e69msh6be027f7207e99ap113b23jsn69def02f9486";
    xhr.setRequestHeader("x-rapidapi-key", key);

    xhr.send();
}