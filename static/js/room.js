(function($ww, $, _, angular, io) {

  'use strict';

  var NOTIF_TIMEOUT = 5000;

  // TODO: tighter integration between angularjs and socket.io (http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/)
  // TODO: let mod set room name

  // Angular variables
  var setTab, toggleTab;

  // Socket variables
  var ws = io.connect();
  var user;

  // Angular stuff
  var app = angular.module('gameRoomApp', ['ngAnimate', 'socketioService']);

  // Notification messages
  app.controller('notifsCtrl', ['$scope', 'socket', function($scope, socket) {
    var thiz = this;
    socket.set(ws);

    function Notif(msg, type) {
      this.msg = msg;
      this.type = type;
    }

    Notif.prototype.dismiss = function() {
      thiz.notifs.splice(thiz.notifs.indexOf(this), 1);
      $scope.$apply();
    };

    this.notifs = [];

    function addNotif(msg, type) {
      var notif = new Notif(msg, type);
      thiz.notifs.unshift(notif); // TODO: figure out best notif anims
      setTimeout(notif.dismiss, NOTIF_TIMEOUT);
    }

    // Client messages
    socket.on('connect', function() {
      addNotif('Connected!', 'success');
    });
    socket.on('disconnect', function() {
      addNotif('Disconnected!', 'danger');
    });

    // Server messages
    socket.on('notif:success', function(info) {
      addNotif(info, 'success');
    });
    socket.on('notif:info', function(info) {
      addNotif(info, 'info');
    });
    socket.on('notif:warning', function(warning) {
      addNotif(warning, 'warning');
    });
    socket.on('notif:err', function(err) {
      addNotif(err, 'danger');
    });
  }]);

  // Tabs
  app.controller('tabsCtrl', ['socket', function(socket) {
    var thiz = this;
    socket.set(ws);

    // TODO: make tabs objects
    this.tabs = [{name: 'Dashboard', enabled: true}, {name: 'Game', enabled: true}];
    this.active = this.tabs[0].name;

    this.setTab = setTab = function(tab) { thiz.active = tab.name; };
    this.isActive  = function(tab) { return tab.name === thiz.active; };
    this.dashActive = function() { return thiz.isActive({name: 'Dashboard'}); };

    toggleTab = function(tab, enable) { thiz.tabs[tab].enabled = enable; };
  }]);

  // Dashboard
  app.controller('dashCtrl', ['socket', function(socket) {
    socket.set(ws);

    this.username = '';
  }]);

  ws.on('connect', function() {
    ws.emit('room:join', $ww.id);
  });

  ws.on('room:joined', function() {
    ws.emit('user:get', $.cookie('userId'));
  });

  ws.on('user:notFound', function() {
    var name = 'NAME'; // TODO: get this from frontend
    ws.emit('user:add', {userId: $.cookie('userId'), name: name});
  });

  ws.on('user:found', function(foundUser) {
    console.log('found user');
    console.log(foundUser);
    user = foundUser;
  });

})(window.$ww, window.jQuery, window._, window.angular, window.io);