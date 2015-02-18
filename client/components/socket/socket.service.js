/* global io */
'use strict';

angular.module('knoxdevApp')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on('statusupdate', function (status) {
          var oldStatus = _.find(array, {name: status.name});
          var index = array.indexOf(oldStatus);
          var event = 'created';

          // replace oldStatus if it exists
          // otherwise just add status to the collection
          if (oldStatus) {
            array.splice(index, 1, status);
            event = 'updated';
          } else {
            array.push(status);
          }

          cb(event, status, array);
        });

      },

      /**
       * Removes listeners for a models updates on the socket
       */
      unsyncUpdates: function () {
        socket.removeAllListeners('statusupdate');
      }
    };
  });
