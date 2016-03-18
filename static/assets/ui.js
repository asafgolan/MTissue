

//init frontpage
var pms = angular.module('qrms', ['ui.router'])

.config(["$urlRouterProvider", "$stateProvider", "$locationProvider",
  function($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('login', {

        url: '/',
        params: {
          error: null,
        },
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'

      });

    //no hashbang
    $locationProvider.html5Mode(true);

}])

.controller('RootCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli){ //base controller

  $scope = $rootScope;

  $rootScope.authHeader = "";


}])

.controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {

  $scope.username = "asaf";
  $scope.password = "golan";

  restcli.auth($scope.username, $scope.password).success(function(data, status){
    $rootScope.authHeader = 'Basic '+ btoa(username+":"+password);
  });

}])

.factory('restcli', ['$http', '$q', function($http, $q){
  return {
  	  login: function(username, password) {
          $http.defaults.headers.common['Authorization'] = 'Basic '+ btoa(username+":"+password);
  		    return $http.get('/api/exhibits', {cache: false});
  	  }
    }

}]);
