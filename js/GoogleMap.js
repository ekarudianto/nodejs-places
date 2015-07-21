var GoogleMap = function(selector, searchBoxSelector) {
    
    /*
     * constructor
     * ===========
     */

    if (!selector) {
        throw new Error("Please define the selector for google maps component !");
    }

    this.selector = selector;
    this.searchBoxSelector = searchBoxSelector;
    this.thirdParty = {
        MaterializeMethods: new MaterializeMethods()
    }

    this.map = null;
    this.markers = []; //collection of places markers
    this.searchMarkers = []; //collection of searched places markers
    this.clickMarker = []; //collection of clicked places marker
}

/*
 * below method returns a string representing the object
 * =====================================================
 */

GoogleMap.prototype.toString = function() {
    return "You're using '" + this.selector + "' as the main selector for using google maps api";
}

/*
 * initialize the google maps instance method
 * ==========================================
 */

GoogleMap.prototype.init = function() {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var me = this;

    $("#" + this.selector).width(windowWidth);
    $("#" + this.selector).height(windowHeight);

    var mapOptions = {
        center: {
            lat: -6.9034494,
            lng: 107.6431576
        },
        zoom: 13,
        draggable: true,
        draggableCursor: "default",
        draggingCursor: "move",
        panControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    }

    this.map = new google.maps.Map(document.getElementById(this.selector), mapOptions);
    this.addSearchBox();
    this.getMarkers();

    google.maps.event.addListener(this.map, 'click', function(event) {
        me.clickListener(event)
    });

}

/*
 * get Markers method
 * ==================
 */

GoogleMap.prototype.getMarkers = function() {
    var me = this;
    var map = this.map;

    $.ajax({
        method: "GET",
        url: "http://localhost/places/api/places",
        dataType: 'json',
        contentType: 'application/json',
    }).done(function(results) {

        if (results.httpCode == 200) {
            var data = results.data;

            for (var i = 0, markers = me.markers.length; i < markers; i++) {
                me.markers[i].setMap(null);
            }

            me.markers = [];
            for (var i = 0, datas = data.length; i < datas; i++) {
                var newLatLng = new google.maps.LatLng(data[i].lat, data[i].lng);
                var marker = new google.maps.Marker({
                    map: map,
                    position: newLatLng,
                    animation: google.maps.Animation.DROP,
                    properties: data[i]
                });

                me.addInfoBox(marker, "info", "initCall");
                me.markers.push(marker);
            }

        }

    }).fail(function(data) {
        console.error("fetching data was failed", data);
    });

}

/*
 * custom search box for google maps instance method
 * =================================================
 */

GoogleMap.prototype.addSearchBox = function() {

    var input = (document.getElementById(this.searchBoxSelector));
    var searchBox = new google.maps.places.SearchBox((input));
    var map = this.map;
    var me = this;

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();

        if (places.length == 0) {
            return;
        }

        for (var i = 0, marker; marker = me.searchMarkers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        me.searchMarkers = [];
        for (var i = 0, place; place = places[i]; i++) {
            var marker = new google.maps.Marker({
                icon: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images/marker-icon.png",
                map: map,
                title: place.name,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP
            });

            me.addInfoBox(marker, "add", "searchBox");
            me.searchMarkers.push(marker);
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);

    });

}

/*
 * click listener, used when user click on the map
 * ===============================================
 */

GoogleMap.prototype.clickListener = function(e) {
    var map = this.map;

    for (var i = 0, markers = this.clickMarker.length; i < markers; i++) {
        this.clickMarker[i].setMap(null);
    }

    this.clickMarker = [];
    var marker = new google.maps.Marker({
        map: map,
        position: e.latLng,
        animation: google.maps.Animation.DROP
    });

    this.addInfoBox(marker, "add", "clickListener");
    this.clickMarker.push(marker);
}

/*
 * infoWindow closure method
 * ===========================
 */

GoogleMap.prototype.addInfoBox = function(marker, status, originCall) {

    var content;
    var me = this;
    var map = this.map;
    var searchMarkers = this.searchMarkers;
    var clickMarker = this.clickMarker;

    if (status == "add" && originCall == "searchBox" || status == "add" && originCall == "clickListener") {
        var div = document.createElement("div");
        var anchorN = document.createElement("a");
        var anchorY = document.createElement("a");

        div.innerHTML = "Do you want to add this location to places ? <br />";
        anchorY.className = "waves-effect waves-teal btn-flat";
        anchorY.innerHTML = "Yes";
        anchorN.className = "waves-effect waves-teal btn-flat";
        anchorN.innerHTML = "Cancel";

        div.appendChild(anchorY);
        div.appendChild(anchorN);

        content = div;

        /*
         * domListener when user click on the "Yes" button
         * ===============================================
         */

        google.maps.event.addDomListener(anchorY, 'click', function(e) {

            me.thirdParty.MaterializeMethods.openModal("#modal1");

            document.getElementById('latForm').value = marker.position.lat();
            document.getElementById('lngForm').value = marker.position.lng();

        });

        /*
         * domListener when user click on the "Cancel" button
         * ===================================================
         */

        google.maps.event.addDomListener(anchorN, 'click', function(e) {
            if (status == "add" && originCall == "searchBox") {

                me.emptyMarkers(searchMarkers);
                document.getElementById(me.searchBoxSelector).value = "";

            } else if (status == "add" && originCall == "clickListener") {

                me.emptyMarkers(clickMarker);

            }
        });

    } else if (status == "info" && originCall == "initCall") {

        var div = document.createElement("div");
        var p1 = document.createElement("p");
        var p2 = document.createElement("p");

        p1.innerHTML = "Name : " + marker.properties.name;
        p2.innerHTML = "Description : " + marker.properties.description;

        div.appendChild(p1);
        div.appendChild(p2);

        content = div;
        
        /*
         * marker listener when user click on it
         * =====================================
         */

        google.maps.event.addListener(marker, 'click', function(e) {
            infowindow.open(map, marker);
        });
        
        /*
         * marker listener when user right click on it
         * ===========================================
         */

        google.maps.event.addListener(marker, 'rightclick', function(e) {
            if (confirm("Do you want to delete this place ?")) {
                alert("deleted !");
            }
        });

    }

    var infowindow = new google.maps.InfoWindow({
        content: content
    });

    /*
     * open conditional info window
     * ============================
     */

    if (status == "add" && originCall == "searchBox" || status == "add" && originCall == "clickListener") {
        infowindow.open(map, marker);
    }

    /*
     * addListener for when user click the close button on info window
     * ===============================================================
     */

    google.maps.event.addListener(infowindow, 'closeclick', function(e) {

        if (status == "add" && originCall == "searchBox") {

            me.emptyMarkers(searchMarkers);
            document.getElementById(me.searchBoxSelector).value = "";

        } else if (status == "add" && originCall == "clickListener") {

            me.emptyMarkers(clickMarker);

        }

    });

}

/*
 * method to remove all of the existing markers on the map
 * =======================================================
 */

GoogleMap.prototype.emptyMarkers = function(collMarkers) {
    for (var i = 0, markers = collMarkers.length; i < markers; i++) {
        collMarkers[i].setMap(null);
    }

    collMarkers = [];
}