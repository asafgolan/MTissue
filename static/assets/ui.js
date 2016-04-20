

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

    }).state('new', {

      url: '/new',
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

    }).state('single', {

      url: '/view/:id/:cid',
      templateUrl: 'views/single.html',
      controller: 'ViewCtrl'

    });
    
    $locationProvider.html5Mode(false);

}])

  /* ROOTSCOPE = MAIN SCOPE */
.controller('RootCtrl', ['$scope', '$rootScope', '$state', 'restcli', '$http', function($scope, $rootScope, $state, restcli, $http){ //base controller

  // initialize variables that are useful everywhere
  $scope = $rootScope; // irrelevant magic
  $rootScope.contentTypes = {1: "Text", 2: "File", 3: "URL", 4:"ResourceApi"};
  $rootScope.loggedIn = false; // login flag
  $rootScope.currentUserName; // the user string? id or object could be in some other variable

  $rootScope.auth = function(){
    if(!$http.defaults.headers.common.Authorization){
      $state.go("login");
    }
  }

}])

//LOGIN
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

//LIST ALL STUFFS
.controller('ListCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();
  
  $scope.getExhibits = function(){
    restcli.getExhibits().success(function(data, status){
      console.log(data);
      $scope.exhibits = data;
    });
  }
  
  $scope.getExhibits();
  
  $scope.delete = function(id){
    restcli.deleteExhibit(id).success(function(data, status){
      $scope.getExhibits();
    });
  }

}])


//EDIT AND CREATE NEW
.controller('EditCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();
  
  $scope.exhibit;
  $scope.statusMessage;
  
  //making a new one or editing old?
  $scope.new = $state.params.id ? false : true;
  
  if(!$scope.new){
    restcli.getExhibit($state.params.id).success(function(data, status){
      //set main object
      $scope.exhibit = data;
      for(var piece in $scope.exhibit.content){
        $scope.exhibit.content[piece].temp_id = $scope.exhibit.content[piece]._id; //give everyone temp ids because unsaved pieces of the content array dont have real ones
      }
    });
  }else{
    $scope.exhibit = {title: "", content: []}; //create fresh main object
  }
  
  //save and re-init
  $scope.saveExhibit = function(){
    $scope.statusMessage = "Saving...";
    restcli.setExhibit($scope.exhibit).success(function(data, status){
      $scope.statusMessage = "Save successful";
      $scope.exhibit = data;
    });
  }
  
  //save new and redirect to edit view
  $scope.newExhibit = function(){
    $scope.statusMessage = "Saving...";
    restcli.addExhibit($scope.exhibit).success(function(data, status){
      $state.go("edit", {id:data._id});
    });
  }
  
  //a container upload piece id that will be used in the following two functions
  $scope.uploadTarget;
  
  $scope.upload = function(id) {
      $scope.uploadTarget = id;
      var fd = new FormData();
      var targetIdx = _.findLastIndex($scope.exhibit.content, {temp_id: $scope.uploadTarget});
      var newFile = $scope.exhibit.content[targetIdx].newFile;
      fd.append("userPhoto", newFile);
      restcli.upload(fd).then(uploadHandler, uploadHandler);
  }

  var uploadHandler = function(data, status) {

      if (data["error"]) {
        alert(data["error"]);
      } else {
        var targetIdx = _.findLastIndex($scope.exhibit.content, {temp_id: $scope.uploadTarget});
        $scope.exhibit.content[targetIdx].url = "uploads/"+data[0].filename;
      }

  }
  
  $scope.addPiece = function(){
    $scope.exhibit.content.push({language: "", description: "", type: 1, url: "", temp_id: Date.now()});
  }
  
  $scope.deletePiece = function(id){
    var deleteIndex = _.findIndex($scope.exhibit.content, function(piece) { return piece.temp_id == id })
    $scope.exhibit.content.splice(deleteIndex, 1);
  }
  
  $scope.audioResources;
  restcli.getAudioResources().success(function(data, status){
    console.log($scope.audioResources);
    $scope.audioResources = data;
  });
 getAudioResources();
 

}])

//PUBLIC VIEW
.controller('ViewCtrl', ['$scope', '$rootScope', '$state', 'restcli', '$sce', function($scope, $rootScope, $state, restcli, $sce) {

  $scope.exhibit;
  $scope.child;
  

  $scope.fileTypes = {
    html : "link",
    php : "link",
    jpg : "pic",
    jpeg : "pic",
    png : "pic",
    gif : "pic",
    mp4 : "vid",
    wav : "noiz",
    mp3 : "noiz"
  }
  
  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
    for(var piece in $scope.exhibit.content){
      
      //create SRC attributes from urls on load
      $scope.exhibit.content[piece].src = $sce.trustAsResourceUrl($scope.exhibit.content[piece].url);
      $scope.exhibit.content[piece].resourceSpaceUrl = $sce.trustAsResourceUrl($scope.exhibit.content[piece].resourceSpaceUrl);

      if($scope.exhibit.content[piece].url){
        $scope.exhibit.content[piece].medium = $scope.fileTypes[$scope.exhibit.content[piece].url.split('.').pop()];
      }
      if(typeof $scope.exhibit.content[piece].medium == "undefined"){
        $scope.exhibit.content[piece].medium = "link";
      }
      
    }
    //spaghetti exception for the child view
    if($state.params.cid){
      $scope.child = _.where($scope.exhibit.content, {_id: $state.params.cid})[0];
    }
  });
  

}])

//PRINT
.controller('PrintCtrl', ['$scope', '$rootScope', '$state', 'restcli', function($scope, $rootScope, $state, restcli) {
  
  $rootScope.auth();

  $scope.exhibit;
  
  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
    /* global jQuery (comment for c9 IDE) */
    jQuery('#qrcode').qrcode({width: 500, height:500, text: "http://museoapi-vwnb.c9users.io/#/view/"+$state.params.id});
  });
  

}])

//factory with API helpers
.factory('restcli', ['$http', '$q', function($http, $q){
  return {
      getAudioResources: function() {
          var queryLink = "https://json2jsonp.com/?url=http://resourcespace.tekniikanmuseo.fi/plugins/api_audio_search/index.php/?key=GpDVpyeWgjz_vSOWSmYWQfKWKmR5QKIRvHfvJlfaSI2e0PO40NpqXEbFe2tktiCnTatqpuo5zpNt9xBjYbExULC98NBpWWbSXw-Fkp9TP2UffogX3B018h--LMwbnkgB&format=mp3&link=true&callback=JSON_CALLBACK";
          return $http.jsonp(queryLink);
      },
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
  	  addExhibit: function(data){
  	      return $http.post('/api/exhibits/', data)
  	  },
  	  deleteExhibit: function(id){
  	      return $http.delete('/api/exhibits/'+id);
  	  },
  	  upload: function(data){

            var deferred = $q.defer();
            var getProgressListener = function(deferred) {
                return function(event) {
                    //this can be used to show an upload bar
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

//model for sending files as FormData
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
