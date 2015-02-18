'use strict';

angular.module('knoxdevApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.monitoredServices = [
      {name: 'service1', status: 'on'},
      {name: 'service2', status: 'on'},
      {name: 'service3', status: 'on'},
      {name: 'service4', status: 'on'},
      {name: 'service5', status: 'on'},
      {name: 'service6', status: 'on'},
    ];

    socket.syncUpdates($scope.monitoredServices);

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates();
    });
  });
