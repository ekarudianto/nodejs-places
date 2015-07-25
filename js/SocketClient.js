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