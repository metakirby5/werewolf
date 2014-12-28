(function($ww, $, _, angular, io) {

  'use strict';

  var NOTIF_TIMEOUT = 5000;

  // TODO: turn elements into directives
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
  app.controller('tabsCtrl', ['$scope', 'socket', function($scope, socket) {
    var thiz = this;
    socket.set(ws);

    function Tab(name) {
      this.name = name;
      this.enabled = true;
    }

    this.tabs = [new Tab('Dashboard'), new Tab('Game')];
    this.active = this.tabs[0].name;

    this.setTab = setTab = function(tabName) { thiz.active = tabName; };
    this.isActive  = function(tabName) { return tabName === thiz.active; };
    this.dashActive = function() { return thiz.isActive('Dashboard'); };

    toggleTab = function(tabName, enable) {
      thiz.tabs.forEach(function(t) {
        if (t.name === tabName)
          t.enabled = enable;
      });
    };

    ws.on('user:notFound', function() {
      $scope.$apply(function() {
        setTab('Dashboard');
        toggleTab('Game', false);
      });
    });

    ws.on('user:found', function() {
      $scope.$apply(function() {
        setTab('Game');
        toggleTab('Game', true);
      });
    })
  }]);

  // Dashboard
  app.controller('dashCtrl', ['socket', function(socket) {
    var thiz = this;
    socket.set(ws);

    this.hasUser = false;
    this.username = '';

    this.submitUsername = function() {
      // TODO: validate username is not empty
      // TODO: add setName event
      socket.emit(thiz.hasUser ? 'user:setName' : 'user:add', {userId: $.cookie('userId'), name: thiz.username});
    };

    ws.on('user:notFound', function() {
      thiz.hasUser = false;
    });

    ws.on('user:found', function() {
      thiz.hasUser = true;
    });
  }]);

  ws.on('connect', function() {
    ws.emit('room:join', $ww.id);
  });

  ws.on('room:joined', function() {
    ws.emit('user:get', $.cookie('userId'));
  });

  ws.on('user:found', function(foundUser) {
    console.log('found user');
    console.log(foundUser);
    user = foundUser;
  });

})(window.$ww, window.jQuery, window._, window.angular, window.io);