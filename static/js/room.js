(function($ww, $, _, angular, io) {

  'use strict';

  // TODO: tighter integration between angularjs and socket.io (http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/)
  // TODO: let mod set room name

  // Angular variables
  var setTab, toggleTab;

  // Socket variables
  var socket = io.connect();
  var user;

  // Angular stuff
  var app = angular.module('gameRoomApp', []);

  // Tabs
  app.controller('tabsCtrl', function() {
    var thiz = this;

    thiz.tabs = [{name: 'Dashboard', enabled: true}, {name: 'Game', enabled: true}];
    thiz.active = thiz.tabs[0].name;

    thiz.setTab = setTab = function(tab) { thiz.active = tab.name; };
    thiz.isActive  = function(tab) { return tab.name === thiz.active; };
    thiz.dashActive = function() { return thiz.isActive({name: 'Dashboard'}); };

    toggleTab = function(tab, enable) { thiz.tabs[tab].enabled = enable; };
  });

  // Dashboard
  app.controller('dashCtrl', function() {
    this.username = '';
  });

  socket.on('connect', function() {
    console.log('connected - joining ' + $ww.id);
    socket.emit('room:join', $ww.id);
  });

  socket.on('errMsg', function(e) {
    alert('ERROR: ' + e); // TODO: turn this into a bootstrap modal
  });

  socket.on('room:joined', function() {
    console.log('joined room - adding user ' + $.cookie('userId'));
    socket.emit('user:get', $.cookie('userId'));
  });

  socket.on('room:notFound', function() {
    console.log('room closed');
  });

  socket.on('user:notFound', function() {
    console.log('user not found, prompting for info...');
    var name = 'NAME'; // TODO: get this from frontend
    socket.emit('user:add', {userId: $.cookie('userId'), name: name});
  });

  socket.on('user:found', function(iUser) {
    console.log('found user');
    console.log(iUser);
    user = iUser;
  });

  socket.on('room:full', function() {
    console.log('room full')
  });

})(window.$ww, window.jQuery, window._, window.angular, window.io);