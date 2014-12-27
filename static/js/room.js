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

    this.notifs = [];

    this.dismissNotif = function(notif) {
      var idx = thiz.notifs.indexOf(notif);
      // Did we already dismiss?
      if (idx === -1)
        return;
      thiz.notifs.splice(idx, 1);
    };

    this.addNotif = function(msg, type) {
      var notif = new Notif(msg, type);
      this.notifs.unshift(notif); // TODO: figure out best notif anims
      setTimeout(function() {
        $scope.$apply(function() {
          thiz.dismissNotif(notif);
        });
      }, NOTIF_TIMEOUT);
    };

    // Client messages
    socket.on('connect', function() {
      thiz.addNotif('Connected!', 'success');
    });
    socket.on('disconnect', function() {
      thiz.addNotif('Disconnected!', 'danger');
    });

    // Server messages
    socket.on('notif:success', function(info) {
      thiz.addNotif(info, 'success');
    });
    socket.on('notif:info', function(info) {
      thiz.addNotif(info, 'info');
    });
    socket.on('notif:warning', function(warning) {
      thiz.addNotif(warning, 'warning');
    });
    socket.on('notif:danger', function(err) {
      thiz.addNotif(err, 'danger');
    });
  }]);

  // Tabs
  app.controller('tabsCtrl', ['socket', function(socket) {
    var thiz = this;
    socket.set(ws);

    function Tab(name) {
      this.name = name;
      this.enabled = true;
    }

    this.tabs = [new Tab('Dashboard'), new Tab('Game')];
    this.active = this.tabs[0].name;

    this.setTab = setTab = function(tab) { thiz.active = tab.name; };
    this.isActive  = function(tab) { return tab.name === thiz.active; };
    this.dashActive = function() { return thiz.isActive(this.tabs[0]); };

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