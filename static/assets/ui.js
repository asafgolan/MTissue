
//var config = require('../.../config');
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
  $rootScope.products;
  $rootScope.countDataObj ;
  $rootScope.contentTypes = {1: "Only text", 2: "File", 3: "URL", 4: "Youtube"};
  $rootScope.loggedIn = false; // login flag
  $rootScope.currentUserName; // the user string? id or object could be in some other variable

  console.log();

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
      $state.go("edit");
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

  $scope.imageArray =[];

  $scope.file;
  $scope.myValue = true;
  $scope.myValue2 = true;


  $scope.doSomething = function(ev) {
    var element = ev.srcElement ? ev.srcElement : ev.target;
    console.log(element, angular.element(element))
    if(!$scope.myValue){
      $scope.myValue = true;
    }else{
      $scope.myValue = false;
    }
  }

  $scope.doSomething2= function(ev) {
    var element = ev.srcElement ? ev.srcElement : ev.target;
    console.log(element, angular.element(element))
    if(!$scope.myValue2){
      $scope.myValue2 = true;
    }else{
      $scope.myValue2 = false;
    }
  }


  $scope.statusMessage;
  console.log("IM HEREEEEEEE AND IM NNOT THERE");
  var video = document.getElementById('video');


// Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
  }

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');

// Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
	   context.drawImage(video, 0, 0, 640, 480);

     dataURL = canvas.toDataURL();
     var blobBin = atob(dataURL.split(',')[1]);
     var array = [];
     for(var i = 0; i < blobBin.length; i++) {
       array.push(blobBin.charCodeAt(i));
     }
     var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
     function blobToFile(theBlob, fileName){

     //A Blob() is almost a File() - it's just missing the two properties below which we will add
     theBlob.lastModifiedDate = new Date();
     theBlob.name = fileName;
     console.log(theBlob);
     return theBlob;
   }

   file = blobToFile(file ,'my-image.png');
     //var imageUrl = canvas.toDataURL("image/jpeg", 1.0);
     //$scope.imageArray.push(image);
     //console.log($scope.imageArray);
     console.log("hey hoe -->");
     //console.log($scope.imageArray);
     var fd = new FormData();
     //var newFile = $scope.imageArray[0];
     fd.append("userPhoto", file);
     restcli.upload(fd).then(uploadHandler, uploadHandler);

   });

  document.getElementById("submit").addEventListener("click", function() {
    console.log("submiting -------<<<<<");
    var fd = new FormData();

    fd.append("userPhoto", $("#file")[0].files[0]);
    //fd.append("userPhoto", $scope.file);
    restcli.upload(fd).then(uploadHandler, uploadHandler);
  });

  document.getElementById("cropModel").addEventListener("click", function() {
    console.log('need to crop model ... ');
    $('#image').cropper('getCroppedCanvas').toBlob(function (blob) {


      //var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
      function blobToFile(theBlob, fileName){
          //A Blob() is almost a File() - it's just missing the two properties below which we will add
          theBlob.lastModifiedDate = new Date();
          theBlob.name = fileName;
          console.log(theBlob);
          return theBlob;
        }
        url = URL.createObjectURL(blob);
        file = blobToFile(blob ,'my-image.png');
        var fd = new FormData();
        //var newFile = $scope.imageArray[0];
        fd.append("userPhoto", file);
        restcli.uploadNWatson(fd).then(function(data, status) {

            if (data["error"]) {
              alert(data["error"]);
            } else {
              console.log("FILE UPLOADED SUCCSESFULLY ...");

            }

        })
        //url send to watson retrive a product;
        //set as model if product retrive
        //upload with name model + productName;
        console.log(url);
      });
  });



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

  $scope.upload = function(data) {
      console.log("from upload function -->");
      console.log(data);
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
        //var targetIdx = _.findLastIndex($scope.exhibit.content, {temp_id: $scope.uploadTarget});
        //$scope.exhibit.content[targetIdx].url = "uploads/"+data[0].filename;
        $rootScope.countDataObj = data;
        if($rootScope.countDataObj){
          restcli.getProducts().success(function(data, status){
            $rootScope.products = data;
            for(i = 0; i < $rootScope.countDataObj.length ; i++){
              //console.log("sucssess -->");
              //console.log($rootScope.countDataObj[i]);
              //console.log($rootScope.products);
                for( j=0 ; j < $rootScope.products.length ; j++){

                  if($rootScope.products[j].nick == $rootScope.countDataObj[i].title){
                    //alert("mofo --- mofo -- mofo ");
                     console.log($rootScope.products[j]);
                     $rootScope.countDataObj[i]["countedAsOne"] = $rootScope.products[j].unitsCountedAsOne;
                     $rootScope.countDataObj[i]["code"] = $rootScope.products[j].code;
                    //console.log($rootScope.countDataObj[i]);
                  }
                }
              }
          })

        }


        $state.go("single");
        //console.log(data);
        //console.log(status);
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
/**  restcli.getAudioResources().success(function(data, status){
    console.log(data);
    $scope.audioResources = data;
  });**/



  $scope.newAudioPiece = function(fileIdx){
    $scope.exhibit.content.push({
      language: "",
      title: $scope.audioResources[fileIdx][0]['Title'],
      description: $scope.parseDescription($scope.audioResources[fileIdx][0]),
      type: 3,
      createdFromDropDown: 1,
      url: $scope.audioResources[fileIdx][0]['Download link'],
      temp_id: Date.now()
    });
  }

  $scope.youtubeVideos = [];

  /**restcli.getYoutubeVideos().success(function(data, status){
    console.log(data);
    $scope.youtubeVideos = data.items;

  });**/

  $scope.newYoutubePiece = function(videoIdx){
    $scope.exhibit.content.push({
      language: "",
      title: $scope.youtubeVideos[videoIdx]["snippet"]["title"],
      description: $scope.youtubeVideos[videoIdx]["snippet"]["description"],
      createdFromDropDown: 1,
      type: 4,
      url: $scope.youtubeVideos[videoIdx]["id"]["videoId"],
      temp_id: Date.now()
    });
  }

  $scope.parseDescription = function(o){
    return o["Category"]+"/"+o["Original filename"];
  }

}])

//PUBLIC VIEW
.controller('ViewCtrl', ['$scope', '$rootScope', '$state', 'restcli', '$sce', '$timeout', function($scope, $rootScope, $state, restcli, $sce, $timeout) {

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

  $scope.fileExtension = function( url ) {
      return url.split('.').pop().split(/\#|\?/)[0];
  }

  restcli.getExhibit($state.params.id).success(function(data, status){
    $scope.exhibit = data;
    for(var piece in $scope.exhibit.content){

      //create SRC attributes from urls on load
      $scope.exhibit.content[piece].src = $sce.trustAsResourceUrl($scope.exhibit.content[piece].url);

      if($scope.exhibit.content[piece].url){
        $scope.exhibit.content[piece].medium = $scope.fileTypes[$scope.fileExtension($scope.exhibit.content[piece].url)];
      }
      if(typeof $scope.exhibit.content[piece].medium == "undefined"){
        $scope.exhibit.content[piece].medium = "link";
      }

    }
    //spaghetti exception for the child view
    if($state.params.cid){
      $scope.child = _.where($scope.exhibit.content, {_id: $state.params.cid})[0];
    }

    $timeout(function () {
      //defined in youtube.js
      loadYoutubePlayers();
    }, 0, false);

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

  	  auth: function(username, password) {
  		    return $http.post('/api/authenticate', {username: username, password: password});
  	  },
      getUsers: function() {
  		    return $http.get('/api/users');
  	  },
      getProducts: function() {
  		    return $http.get('/api/products');
  	  },
  	  /**getExhibits: function(){
  	      return $http.get('/api/exhibits')
  	  },**/
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
          console.log("LINE 388 -->"  + data);
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
                    console.log(response);
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

  	  },
      uploadNWatson: function(data){
          console.log("LINE 388 -->"  + data);
            var deferred = $q.defer();
            var getProgressListener = function(deferred) {
                return function(event) {
                    //this can be used to show an upload bar
                    var progpercent = ((100 * (event.loaded / event.total)).toFixed()) + "%";
                };
            };


            $.ajax({
                type: 'POST',
                url: '/api/uploads_n_query_watson',
                data: data,
                cache: false,
                // Force this to be read from FormData
                contentType: false,
                processData: false,
                success: function(response, textStatus, jqXHR) {
                    console.log(response);
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
