(function(angular) {

  'use strict';

  // http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
  angular.module('socketioService', []).factory('socket', ['$rootScope', function ($rootScope) {
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
