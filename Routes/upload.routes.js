var express = require('express'),
    multer  =   require('multer');


var routes = function(upload){
  var uploadRouter = express.Router();
var uploadController = require('../controllers/uploads.server.controller.js')(upload);


  uploadRouter.route('/')
  .get(uploadController.get)
  .post(uploadController.post);

    return uploadRouter;
}



module.exports = routes;
