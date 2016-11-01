var express = require('express'),
    multer  =   require('multer');


var routes = function(upload){
  console.log("watson router ....");
  var uploadRouter = express.Router();
var uploadController = require('../controllers/uploads.watson.server.controller.js')(upload);


  uploadRouter.route('/')
  .get(uploadController.get)
  .post(uploadController.post);

    return uploadRouter;
}



module.exports = routes;
