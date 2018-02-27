
var geocoder;
var map;
var marker;
var infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150,50)});
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object') return obj;
    var temp = new obj.constructor();
    for(var key in obj) temp[key] = clone(obj[key]);
    return temp;
}


function geocodePosition(pos) {
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            marker.formatted_address = responses[0].formatted_address;
        } else {
            marker.formatted_address = 'Cannot determine address at this location.';
        }
        infowindow.setContent(marker.formatted_address+"<br>coordinates: "+marker.getPosition().toUrlValue(6));
        infowindow.open(map, marker);
    });
}

function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            // if (marker) {
            //     marker.setMap(null);
            //     if (infowindow) infowindow.close();
            // }
            marker = new google.maps.Marker({
                map: map,
                draggable: true,
                position: results[0].geometry.location
            });
            google.maps.event.addListener(marker, 'dragend', function() {
                // updateMarkerStatus('Drag ended');
                geocodePosition(marker.getPosition());
            });
            google.maps.event.addListener(marker, 'click', function() {
                if (marker.formatted_address) {
                    infowindow.setContent(marker.formatted_address+"<br>coordinates: "+marker.getPosition().toUrlValue(6));
                } else  {
                    infowindow.setContent(address+"<br>coordinates: "+marker.getPosition().toUrlValue(6));
                }
                infowindow.open(map, marker);
            });
            google.maps.event.trigger(marker, 'click');
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
