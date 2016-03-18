var express = require('express'),
    multer  =   require('multer');


var routes = function(upload){
  var uploadRouter = express.Router();
var uploadController = require('/Users/asafgolan/museoAPI/museoAPI/controllers/uploads.server.controller.js')(upload);


  uploadRouter.route('/')
  .get(uploadController.get)
  .post(uploadController.post);

    return uploadRouter;
}



module.exports = routes;
