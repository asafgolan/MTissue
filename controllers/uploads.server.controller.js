var uploadController = function(upload){

  var get = function(req,res){
      res.sendFile('/Users/asafgolan/museoAPI/museoAPI/index.html');
  }

  var post = function(req,res){
    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading filessssss.");
      }
      res.json(req.files);
    })
  }
}

module.exports = uploadController;
