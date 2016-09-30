
var PythonShell = require('python-shell');



var uploadController = function(upload){


  var get = function(req,res){
      res.json({error: "cant get api uploadsssss"});
  }

  var post = function(req,res){
    console.log("HEY YAAAAA!!!!!");
    //console.log(req.files);


    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading filessssss.");
      }

      //var myFile = blobToFile(req.files, "my-image.png");
      //console.log(myFile);

      console.log("LOGGING FILES");
      console.log(req.files[0].path);
      res.json(req.files);

      var pyshell = new PythonShell('./pattern.py');
      pyshell.send( './' + req.files[0].path);
      pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
      });

      pyshell.end(function (err) {
        if (err) console.log('finished');

      });
    })
  }

     return {
       post: post,
       get: get
     }
}


module.exports = uploadController;
