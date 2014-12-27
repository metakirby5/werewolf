(function(angular) {

  'use strict';

  var socketService = angular.module('socketioService', []);

  // http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
  socketService.factory('socket', ['$rootScope', function ($rootScope) {
    var socket = null;
    return {
      set: function(newSocket) {
        socket = newSocket;
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  }]);

})(window.angular);
