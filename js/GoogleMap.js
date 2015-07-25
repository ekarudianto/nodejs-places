/*
 
 The MIT License (MIT)
 
 Copyright (c) <2015> <Eka Rudianto>
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 
 Created on : Jul 17, 2015, 12:02:31 AM
 Author     : Eka Rudianto
 Website    : http://ekarudianto.com
 Github     : https://github.com/ekarudianto
 
 */

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
        url: "http://ekarudianto.com/api/places",
        dataType: 'json',
        contentType: 'application/json',
    }).done(function(results) {
        console.info("markers has been fetched", results.data);
        if (results.httpCode == 200) {
            var data = results.data;

            for (var i = 0, markers = me.markers.length; i < markers; i++) {
                me.markers[i].setMap(null);
            }

            me.markers = [];
            for (var i = 0, datas = data.length; i < datas; i++) {
                var newLatLng = new google.maps.LatLng(data[i].lat, data[i].lng);
                var marker = new google.maps.Marker({
                    draggable: true,
                    map: map,
                    position: newLatLng,
                    animation: google.maps.Animation.DROP,
                    properties: data[i]
                });

                me.addInfoBox(marker, "info", "initCall");
                me.rightClickForMarker(marker);
                me.dragEndListenerForMarker(marker);
                me.markers.push(marker);
            }

        }

    }).fail(function(data) {
        console.error("fetching data was failed", data);
    });

}

/*
 * Drag end listener method, used when user dragged a marker
 * ==========================================================
 */

GoogleMap.prototype.dragEndListenerForMarker = function(marker) {

    google.maps.event.addListener(marker, 'dragend', function(e) {
        var payload = {
            id: marker.properties.id,
            name: marker.properties.name,
            description: marker.properties.description,
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }

        socket.emit('update location', payload);

    });

}

/*
 * Install Marker method, used when new marker has been created
 * =============================================================
 */

GoogleMap.prototype.installMarker = function(newMarker) {

    var map = this.map;
    var newLatLng = new google.maps.LatLng(newMarker.lat, newMarker.lng);
    var marker = new google.maps.Marker({
        draggable: true,
        map: map,
        position: newLatLng,
        animation: google.maps.Animation.DROP,
        properties: newMarker
    });

    this.addInfoBox(marker, "info", "initCall");
    this.rightClickForMarker(marker);
    this.dragEndListenerForMarker(marker);
    this.markers.push(marker);

    if ($('#setOrigin').val() == "clickMarker") {
        this.clearClickMarkers();
    } else if ($('#setOrigin').val() == "searchMarker") {
        this.clearSearchMarkers();
        document.getElementById(this.searchBoxSelector).value = "";
    }

}

/*
 * Update infoWindow method, used when users do an update on marker
 * Then update the infoWindow content
 * =================================================================
 */

GoogleMap.prototype.updateInfoWindowContent = function(marker) {
    var me = this;

    for (var i = 0, installedMarkers = this.markers.length; i < installedMarkers; i++) {

        if (this.markers[i].properties.id == marker.id) {

            var div = document.createElement("div");
            var p1 = document.createElement("span");
            p1.style.textTransform = "capitalize";
            var p2 = document.createElement("p");
            var actionFooter = document.createElement("a");

            p1.innerHTML = "<strong>" + marker.name + "</strong>";
            p2.innerHTML = marker.description;
            actionFooter.innerHTML = "Edit";

            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(actionFooter);

            this.markers[i].infoWindow.setContent(div);
            this.markers[i].properties = marker;

            /*
             * dom listener when users click on 'Edit' anchor
             * ==============================================
             */

            google.maps.event.addDomListener(actionFooter, 'click', function(e) {
                me.thirdParty.MaterializeMethods.openModal("#modal1");

                document.getElementById('idForm').value = marker.id;
                document.getElementById('nameForm').value = marker.name;
                document.getElementById('descriptionForm').value = marker.description;
                document.getElementById('latForm').value = marker.lat;
                document.getElementById('lngForm').value = marker.lng;
                document.getElementById('submitBtn').innerHTML = "UPDATE";

                /*
                 * function to adjust the input and textarea value placeholders
                 * this is a materialize fix 
                 * =============================================================
                 */

                $('input, textarea').each(function(i, e) {
                    if ($(e).val().length > 0) {
                        $(this).siblings('label, i').addClass('active');
                    } else {
                        $(this).siblings('label, i').removeClass('active');
                    }
                });

            });

        }
    }
}


/*
 * Update Marker location method, used when users do a dragged on a marker
 * Then this method update the marker location
 * =======================================================================
 */

GoogleMap.prototype.updateMarkerLocation = function(markerProp) {
    for (var i = 0, installedMarkers = this.markers.length; i < installedMarkers; i++) {
        if (this.markers[i].properties.id == markerProp.id) {
            var latLng = new google.maps.LatLng(markerProp.lat, markerProp.lng);
            this.markers[i].setPosition(latLng);
            break;
        }
    }
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
                draggable: true,
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
        draggable: true,
        map: map,
        position: e.latLng,
        animation: google.maps.Animation.DROP
    });

    this.addInfoBox(marker, "add", "clickListener");
    this.clickMarker.push(marker);
}

/*
 * right click listener, used when user do a right click on the marker
 * ===================================================================
 */

GoogleMap.prototype.rightClickForMarker = function(marker) {

    google.maps.event.addListener(marker, 'rightclick', function(e) {
        if (confirm("Do you want to delete this place ?")) {
            socket.emit('delete', marker.properties.id);
        }
    });
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

        div.innerHTML = "<strong>Add this location to places ?</strong> <br />";
        anchorY.innerHTML = "Yes";
        anchorY.style.marginRight = "10px";
        anchorY.style.fontSize = "11px";
        anchorN.innerHTML = "Cancel";
        anchorN.style.fontSize = "11px";

        div.appendChild(anchorY);
        div.appendChild(anchorN);

        content = div;

        /*
         * domListener when user click on the "Yes" button
         * ===============================================
         */

        google.maps.event.addDomListener(anchorY, 'click', function(e) {

            me.thirdParty.MaterializeMethods.openModal("#modal1");

            document.getElementById('setOrigin').value = (originCall == "clickListener") ? "clickMarker" : "searchMarker";
            document.getElementById('idForm').value = '';
            document.getElementById('nameForm').value = '';
            document.getElementById('descriptionForm').value = '';
            document.getElementById('latForm').value = marker.position.lat();
            document.getElementById('lngForm').value = marker.position.lng();
            document.getElementById('submitBtn').innerHTML = "CREATE";

            /*
             * function to adjust the input and textarea value placeholders
             * this is a materialize fix 
             * =============================================================
             */

            $('input, textarea').each(function(i, e) {
                if ($(e).val().length > 0) {
                    $(this).siblings('label, i').addClass('active');
                } else {
                    $(this).siblings('label, i').removeClass('active');
                }
            });

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
        var p1 = document.createElement("span");
        p1.style.textTransform = "capitalize";
        var p2 = document.createElement("p");
        var actionFooter = document.createElement("a");

        p1.innerHTML = "<strong>" + marker.properties.name + "</strong>";
        p2.innerHTML = marker.properties.description;
        actionFooter.innerHTML = "Edit";

        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(actionFooter);

        content = div;

        /*
         * marker listener when user click on it
         * =====================================
         */

        google.maps.event.addListener(marker, 'click', function(e) {
            infowindow.open(map, marker);
        });

        /*
         * dom listener when users click on 'Edit' anchor
         * ==============================================
         */

        google.maps.event.addDomListener(actionFooter, 'click', function(e) {
            me.thirdParty.MaterializeMethods.openModal("#modal1");

            document.getElementById('idForm').value = marker.properties.id;
            document.getElementById('nameForm').value = marker.properties.name;
            document.getElementById('descriptionForm').value = marker.properties.description;
            document.getElementById('latForm').value = marker.properties.lat;
            document.getElementById('lngForm').value = marker.properties.lng;
            document.getElementById('submitBtn').innerHTML = "UPDATE";

            /*
             * function to adjust the input and textarea value placeholders
             * this is a materialize fix 
             * =============================================================
             */

            $('input, textarea').each(function(i, e) {
                if ($(e).val().length > 0) {
                    $(this).siblings('label, i').addClass('active');
                } else {
                    $(this).siblings('label, i').removeClass('active');
                }
            });

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

    marker.infoWindow = infowindow;

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

/*
 * method to remove all of the markers from clicking the map method
 * ================================================================
 */

GoogleMap.prototype.clearClickMarkers = function() {
    this.emptyMarkers(this.clickMarker);
}

/*
 * method to remove all of the markers from do a search on place box method
 * =========================================================================
 */

GoogleMap.prototype.clearSearchMarkers = function() {
    this.emptyMarkers(this.searchMarkers);
}

/*
 * method to remove a marker from the map upon a delete action from user
 * =====================================================================
 */

GoogleMap.prototype.removeMarkerOnDelete = function(markerProp) {

    for (var i = 0, installedMarkers = this.markers.length; i < installedMarkers; i++) {
        if (this.markers[i].properties.id == markerProp.id) {
            this.markers[i].setMap(null);
            this.markers.splice(i, 1);
            break;
        }
    }

}