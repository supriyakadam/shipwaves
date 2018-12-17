var app = angular.module('myApp', ['ui.router']);
var url = "http://localhost:3000";
app
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '../index.html',
          controller: 'ShipmentCtrl'
        }).
      state('viewContainer', {
        url: '/viewContainer',
        templateUrl: './container.html',
        controller: 'ContainerCtrl'
      })
      $urlRouterProvider.otherwise('home');
    }
  ]);

app.controller('ShipmentCtrl', function ($scope, $http) {
  var refresh = function () {
    $scope.shipmentRecords = [];
    $http.get(url + '/shipment/getShipments').success(function (response) {
      if (response.data) {
        $scope.shipmentRecords = response.data;
      }
    });
  };
  refresh();
  $scope.addShipment = function (data) {
    $scope.shipment = {};
    $http.post(url + '/shipment/addShipments', data).success(function (response) {
      refresh();
    });
  };

  $scope.deleteShipment = function (id) {;
    $http.delete(url + '/shipment/deleteShipments' + id).success(function (response) {
      if (response.err) {
        alert(response.err);
      } else {
        refresh();
      }
    });
  };


});
app.controller('ContainerCtrl', function ($scope, $http) {
  var refresh = function () {
    $scope.containerRecords = [];
    $http.get(url + '/container/getContainers').success(function (response) {
      console.log("response", response);
      if (response.data) {
        $scope.containerRecords = response.data;
      }
    });
  };
  refresh();

  $scope.updateContainerStatus = function (container) {
    $scope.form = {};
    $scope.form.updateFormId = container._id;
    $scope.containerStatus = ["transit", "draft", "completed"];
    $scope.form.statusNow = container.status;
    $scope.updateForm = true;
  };
  $scope.saveUpdatedContainer = function (container) {
    $http.put(url + '/container/updateContainerStatus', container).success(function (response) {
      console.log(response);
      $scope.updateForm = false;
      refresh();
    });
  }
  $scope.updateForm = false;

});