

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

  /* ROOTSCOPE = MAIN SCOPE */

  // initialize variables that are useful everywhere
  $scope = $rootScope; // irrelevant magic
  $rootScope.contentTypes = {1: "Text", 2: "File", 3: "URL"};
  $rootScope.loggedIn = false; // login flag
  $rootScope.currentUserName; // the user string? id or object could be in some other variable
  $rootScope.exhibits;
  
  $rootScope.auth = function(){
    if(!$http.defaults.headers.common.Authorization){
      $state.go("login");
    }
  }

  $rootScope.saveExhibit = function(data){
    restcli.setExhibit(data).success(function(data, status){
      console.log(data);
    });
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
      $rootScope.currentUserName = $scope.username;
      $state.go("list");
    }).error(function(data, status){
      $scope.authMessage = "Invalid credentials.";
    });
  }


}])


.controller('ListCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();
  
  restcli.getExhibits().success(function(data, status){
    console.log(data);
    $scope.exhibits = data;
  });

}])

.controller('EditCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();

  $scope.exhibit;
  
  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
  });
  
  $scope.saveExhibit = function(){
    $rootScope.saveExhibit($scope.exhibit);
  }
  
  $scope.uploadTarget;
  
  $scope.newFile;
  $scope.upload = function(id) {
      $scope.uploadTarget = id;
      var fd = new FormData();
      var targetIdx = _.findLastIndex($scope.exhibit.content, {_id: $scope.uploadTarget});
      var newFile = $scope.exhibit.content[targetIdx].newFile;
      fd.append("userPhoto", newFile);
      restcli.upload(fd).then(uploadHandler, uploadHandler);
  }

  var uploadHandler = function(data, status) {

      if (data["error"]) {
        console.log(data);
      } else {
        var targetIdx = _.findLastIndex($scope.exhibit.content, {_id: $scope.uploadTarget});
        $scope.exhibit.content[targetIdx].url = "uploads/"+data[0].filename;
      }

  }

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
  	  },
  	  setExhibit: function(data){
  	      return $http.put('/api/exhibits/'+data._id, data)
  	  },
  	  upload: function(data){

            var deferred = $q.defer();
            var getProgressListener = function(deferred) {
                return function(event) {
                    //do some magic
                    var progpercent = ((100 * (event.loaded / event.total)).toFixed()) + "%";
                };
            };


            $.ajax({
                type: 'POST',
                url: '/api/uploads',
                data: data,
                cache: false,
                // Force this to be read from FormData
                contentType: false,
                processData: false,
                success: function(response, textStatus, jqXHR) {
                    deferred.resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    deferred.reject(errorThrown);
                },
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener(
                            'progress', getProgressListener(deferred), false);
                    } else {
                        console.log('Upload progress is not supported.');
                    }
                    return myXhr;
                },
                beforeSend: function(xhr){
                  xhr.setRequestHeader("Authorization", $http.defaults.headers.common.Authorization);
                }
            });
            return deferred.promise;

  	  }
    }

}])

.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
