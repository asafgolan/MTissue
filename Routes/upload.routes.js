var express = require('express'),
    multer  =   require('multer');


var routes = function(upload){
  var uploadRouter = express.Router();
/**var uploadController = require('/Users/asafgolan/museoAPI/museoAPI/controllers/uploads.server.controller.js')(upload);

  uploadRouter.route('/')
  .get(uploadController.get)
  .post(uploadController.post);

    return uploadRouter;
}

module.exports = routes;

**/
  uploadRouter.route('/')
  .get(function(req,res){
      res.sendFile('/Users/asafgolan/museoAPI/museoAPI/index.html');
  })
  .post(function(req,res){
    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading filessssss.");
      }
      res.json(req.files);
    })})
    return uploadRouter;
}

module.exports = routes;
