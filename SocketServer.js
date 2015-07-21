/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * initialize app to be a function handler
 * =======================================
 */

var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);

/*
 * initialize socket.io server integration
 * =======================================
 */

var io = require('socket.io')(http);

app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css'));
app.use('/normalize', express.static(__dirname + '/node_modules/normalize.css'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log("user coming in");
});

/*
 * http server listen to port 2000
 * ===============================
 */

http.listen(2000, function() {
    console.log('socket io is starting');
});