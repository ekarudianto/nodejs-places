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

/*
 * initialize app to be a function handler
 * =======================================
 */

var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var request = require('request');
var domainHttpRequest = "http://ekarudianto.com/api/";

/*
 * initialize socket.io server integration
 * =======================================
 */

var io = require('socket.io')(http);

/*
 * serve static folders
 * ====================
 */

app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css'));
app.use('/normalize', express.static(__dirname + '/node_modules/normalize.css'));

/*
 * routing collections
 * ===================
 */


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

/*
 * socket io server connection
 * ============================
 */

io.on('connection', function(socket) {

    console.log(socket.id + " has connected");

    /*
     * event emitter when client has closed a connection
     * =================================================
     */

    socket.on('disconnect', function() {
        console.log(socket.id + " has leave");
    });

    /*
     * event emitted from client to do an http post
     * ============================================
     */

    socket.on('post', function(payload) {

        var options = {
            uri: domainHttpRequest + 'places',
            method: 'POST',
            json: payload
        }

        request(options, function(error, response, body) {

            if (!error) {
                io.emit('request response', body, 'POST');
                socket.emit('toast message', body, 'POST');
                console.info('a place has been created', body);
            } else {
                console.error('could not create a place !', error);
            }

        });

    });

    /*
     * event emitted from client to do an http put
     * ===========================================
     */

    socket.on('put', function(payload) {

        var options = {
            uri: domainHttpRequest + 'places/' + payload.id,
            method: 'PUT',
            json: payload
        }

        request(options, function(error, response, body) {
            if (!error) {
                io.emit('request response', body, 'PUT');
                socket.emit('toast message', body, 'PUT');
                console.info('a place has been updated', body);
            } else {
                console.error('could not update a place !', error);
            }
        });

    });

    /*
     * event emitted from GoogleMap client to do an http put
     * for updating a coordinate location of a marker
     * =====================================================
     */

    socket.on('update location', function(payload) {

        var options = {
            uri: domainHttpRequest + 'places/' + payload.id,
            method: 'PUT',
            json: payload
        }

        request(options, function(error, response, body) {
            if (!error) {
                io.emit('request response', body, 'UPDATE LOCATION');
                socket.emit('toast message', body, 'UPDATE LOCATION');
                console.info('a place location has been updated', body);
            } else {
                console.error('could not do a location update !', error);
            }
        });

    });

    /*
     * event emitted from GoogleMap client to do an http delete
     * ========================================================
     */

    socket.on('delete', function(id) {

        var options = {
            uri: domainHttpRequest + 'places/' + id,
            method: 'DELETE',
            json: true
        }

        request(options, function(error, response, body) {
            if (!error) {
                io.emit('request response', body, 'DELETE');
                socket.emit('toast message', body, 'DELETE');
                console.info('a place has been deleted', body);
            } else {
                console.error('could not delete a place !', error);
            }
        });

    });

});

/*
 * http server listen to port 2000
 * ===============================
 */

http.listen(2000, function() {
    console.log('socket io is starting');
});