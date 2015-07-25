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

var socket = io();
var Materialize = new MaterializeMethods();

/*
 * received event collections from socket server
 * =============================================
 */

socket.on('request response', function(res, status) {

    if (res.httpCode == 200) {

        if (status == "POST") {
            Google.installMarker(res.data);
        } else if (status == "PUT") {
            Google.updateInfoWindowContent(res.data);
        } else if (status == "UPDATE LOCATION") {
            Google.updateMarkerLocation(res.data);
        } else if (status == "DELETE") {
            Google.removeMarkerOnDelete(res.data);
        }

    }

});

/*
 * received event toast message from sender socket
 * ===============================================
 */

socket.on('toast message', function(res, status) {

    if (res.httpCode == 200) {

        Materialize.closeModal('#modal1');

        if (status == "POST") {
            Materialize.simpleToast('a place has been created !');
            console.info('created place', res.data);
        } else if (status == "PUT") {
            Materialize.simpleToast('a place has been updated !');
            console.info('updated place', res.data);
        } else if (status == "UPDATE LOCATION") {
            Materialize.simpleToast('a place location has been updated !');
            console.info('updated place location', res.data);
        } else if (status == "DELETE") {
            Materialize.simpleToast('a place has been deleted !');
            console.info('deleted place', res.data);
        }

    } else {

        if (status == "POST") {
            Materialize.simpleToast('Could not create a place !');
        } else if (status == "PUT") {
            Materialize.simpleToast('Could not update a place !');
        } else if (status == "UPDATE LOCATION") {
            Materialize.simpleToast('Could not update a location !');
        } else if (status == "DELETE") {
            Materialize.simpleToast('Could not delete a place !');
        }

    }

});

/*
 * Form submit event
 * =================
 */

$("#formValidate").submit(function(e) {

    var id = $("#idForm").val();
    var name = $('#nameForm').val();
    var description = $('#descriptionForm').val();
    var lat = $('#latForm').val();
    var lng = $('#lngForm').val();

    var payload = {
        'id': id,
        'name': name,
        'description': description,
        'lat': lat,
        'lng': lng
    }

    if (!id) {
        socket.emit('post', payload);
    } else {
        socket.emit('put', payload);
    }

    return false; //so that the page would not be refreshed

});