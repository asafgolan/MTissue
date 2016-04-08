

//init frontpage
var pms = angular.module('qrms', ['ui.router'])

.config(["$urlRouterProvider", "$stateProvider", "$locationProvider",
  function($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('login', {

      url: '/',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'

    }).state('list', {

      url: '/list',
      templateUrl: 'views/list.html',
      controller: 'ListCtrl'

    }).state('edit', {

      url: '/edit/:id',
      templateUrl: 'views/edit.html',
      controller: 'EditCtrl'

    }).state('print', {

      url: '/print/:id',
      templateUrl: 'views/print.html',
      controller: 'PrintCtrl'

    }).state('view', {

      url: '/view/:id',
      templateUrl: 'views/view.html',
      controller: 'ViewCtrl'

    });
    
    $locationProvider.html5Mode(false);

}])

.controller('RootCtrl', ['$scope', '$rootScope', '$state', 'restcli', '$http', function($scope, $rootScope, $state, restcli, $http){ //base controller

  $scope = $rootScope;
  $rootScope.contentTypes = {1: "Text", 2: "File", 3: "URL"};
  $rootScope.loggedIn = false;
  $rootScope.currentUser;
  
  $rootScope.auth = function(){
    if(!$http.defaults.headers.common.Authorization){
      $state.go("login");
    }
  }

}])

.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$http', 'restcli', function($scope, $rootScope, $state, $http, restcli) {

  $scope.username = "";
  $scope.password = "";

  $scope.authenticate = function(){
    restcli.auth($scope.username, $scope.password).success(function(data, status){
      $http.defaults.headers.common.Authorization = data.token;
      $scope.authMessage = "Logged in as "+$scope.username;
      $rootScope.loggedIn = true;
      $rootScope.currentUser = $scope.username;
      $state.go("list");
    }).error(function(data, status){
      $scope.authMessage = "Invalid credentials.";
    });
  }


}])


.controller('ListCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();

  $rootScope.exhibits;
  
  restcli.getExhibits().success(function(data, status){
    console.log(data);
    $rootScope.exhibits = data;
  });

}])

.controller('EditCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();

  $scope.exhibit;
  
  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
  });

}])

.controller('ViewCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {

  $scope.exhibit;
  
  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
  });
  

}])

.controller('PrintCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();

  $scope.exhibit;
  
  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
    /* global jQuery (comment for c9 IDE) */
    jQuery('#qrcode').qrcode("https://museoapi-vwnb.c9users.io/#/view/"+$state.params.id);
  });
  

}])

.factory('restcli', ['$http', '$q', function($http, $q){
  return {
  	  auth: function(username, password) {
  		    return $http.post('/api/authenticate', {username: username, password: password});
  	  },
      getUsers: function() {
  		    return $http.get('/api/users');
  	  },
  	  getExhibits: function(){
  	      return $http.get('/api/exhibits')
  	  },
  	  getExhibit: function(id){
  	      return $http.get('/api/exhibits/'+id)
  	  }
    }

}]);
