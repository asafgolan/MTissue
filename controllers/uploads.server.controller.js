
var uploadController = function(upload){

  var get = function(req,res){
      res.json({error: "cant get api uploadsssss"});
  }

  var post = function(req,res){
    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading filessssss.");
      }
      res.json(req.files);
    })
  }

     return {
       post: post,
       get: get
     }
}


module.exports = uploadController;
