(function($ww, $, _, angular, io) {

  'use strict';

  var NOTIF_TIMEOUT = 5000;

  // TODO: turn elements into directives
  // TODO: let mod set room name
  // TODO: prevent emitting to socket if there is no room (disconnect -> reconnect to nonexistent room) - maybe a modal?

  // Socket variables
  var ws = io('/room');
  var user;

  // Angular stuff
  var app = angular.module('gameRoomApp', ['ngAnimate', 'socketioService']).

    // Monkey patch event listener registration
    // http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs
    config(['$provide', function($provide){
      $provide.decorator('$rootScope', ['$delegate', function($delegate){
        Object.defineProperty($delegate.constructor.prototype, '$onRS', {
          value: function(name, listener){
            var unsubscribe = $delegate.$on(name, listener);
            this.$on('$destroy', unsubscribe);

            return unsubscribe;
          },
          enumerable: false
        });
        return $delegate;
      }]);
    }]);

  // Notification messages
  app.controller('notifsCtrl', ['$scope', 'socket', function($scope, socket) {
    var thiz = this;
    socket.set(ws);

    function Notif(msg, type) {
      this.msg = msg;
      this.type = type;
    }

    this.notifs = [];

    this.addNotif = function(msg, type) {
      var notif = new Notif(msg, type);
      this.notifs.unshift(notif);
      setTimeout(function() {
        $scope.$apply(function() {
          thiz.dismissNotif(notif);
        });
      }, NOTIF_TIMEOUT);
    };
    this.dismissNotif = function(notif) {
      var idx = thiz.notifs.indexOf(notif);
      // Did we already dismiss?
      if (idx === -1)
        return;
      thiz.notifs.splice(idx, 1);
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
  app.controller('tabsCtrl', ['$scope', '$rootScope', 'socket', function($scope, $rootScope, socket) {
    var thiz = this;
    socket.set(ws);

    function Tab(name) {
      this.name = name;
      this.enabled = true;
    }

    this.tabs = [new Tab('Dashboard'), new Tab('Game')];
    this.active = this.tabs[0].name;

    this.setTab = function(tabName) {
      $rootScope.$emit('tabsCtrl:tabChange', this.active, tabName);
      thiz.active = tabName;
    };
    this.isActive  = function(tabName) { return tabName === thiz.active; };
    this.dashActive = function() { return thiz.isActive('Dashboard'); };

    function toggleTab(tabName, enable) {
      thiz.tabs.forEach(function(t) {
        if (t.name === tabName)
          t.enabled = enable;
      });
    }

    ws.on('user:notFound', function() {
      $scope.$apply(function() {
        thiz.setTab('Dashboard');
        toggleTab('Game', false);
      });
    });

    ws.on('user:update', function() {
      $scope.$apply(function() {
        thiz.setTab('Game');
        toggleTab('Game', true);
      });
    })
  }]);

  // Username
  app.controller('uNameCtrl', ['$scope', 'socket', function($scope, socket) {
    var thiz = this;
    socket.set(ws);

    this.socketing = false;
    this.hasUser = false;
    this.username = '';
    this.usernameChanged = function() {
      return !user || thiz.username !== user.name;
    };

    $scope.$onRS('tabsCtrl:tabChange', function(from, to) {
      if (from !== 'Dashboard' && to === 'Dashboard')
        thiz.username = user ? user.name : '';
    });

    this.submitUsername = function(valid) {
      if (!valid)
        return;
      // Did the name change?
      if (!thiz.usernameChanged())
        return;
      socket.emit(thiz.hasUser ? 'user:setName' : 'user:add', {userId: $.cookie('userId'), name: thiz.username});
      thiz.socketing = true;
    };

    ws.on('user:notFound', function() {
      thiz.hasUser = false;
      thiz.socketing = false;
    });

    ws.on('user:update', function() {
      thiz.hasUser = true;
      thiz.socketing = false;
    });
  }]);

  ws.on('connect', function() {
    ws.emit('room:join', $ww.id);
  });

  ws.on('room:joined', function() {
    ws.emit('user:get', $.cookie('userId'));
  });

  ws.on('user:update', function(foundUser) {
    console.log('updating user');
    console.log(foundUser);
    user = foundUser;
  });

})(window.$ww, window.jQuery, window._, window.angular, window.io);