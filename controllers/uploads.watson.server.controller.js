
//var PythonShell = require('python-shell');
console.log("watson controller");
var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
    api_key: ,

    version: 'v3',
    version_date: '2016-05-20'
});

var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();

var fs = require('fs');

var uploadController = function(upload){
  console.log("watson controller ...");
  //var stockObject;
  var get = function(req,res){
      res.json({error: "cant get api uploadsssss"});
  }

  var post = function(req,res){

    upload(req,res,function(err) {
      if(err) {
        return res.end("Error uploading filessssss.");
      }

      //var myFile = blobToFile(req.files, "my-image.png");
      //console.log(myFile);

      console.log("LOGGING FILES");
      console.log(req.files[0].path);
      //res.json(req.files);
    /**  fs.rename(req.files[0].path, req.files[0].path +'.png', function(err) {
        if ( err ) console.log('ERROR: ' + err);
      });**/

      ffmpeg(req.files[0].path).output('outputfile.png').on('end', function() {
        console.log("now querying watson ...");
        var params = {
          images_file: fs.createReadStream('/Users/asafgolan/Documents/MT-API/outputfile.png'),
          classifier_ids : ["lambi12pack_1802763017"/*, "default"*/]
          //demi account --> 26.10.16
          //classifier_ids : ["lambi12pack_1350739330"/**, "default"**/]
        };

        visual_recognition.classify(params, function(err, res) {
          if (err)
          console.log(err);
          else
          console.log("reults from watson ...");
          //console.log(JSON.stringify(res, null, 2));
          console.log(res.images[0].classifiers);
          console.log("name of the product ...");
          var productName = res.images[0].classifiers[0].classes[0].class;
          console.log(res.images[0].classifiers[0].classes[0].class);
          console.log("the probability (the highest from all classifiers)");
          console.log(res.images[0].classifiers[0].classes[0].score);

          fs.rename('/Users/asafgolan/Documents/MT-API/outputfile.png', '/Users/asafgolan/Documents/MT-API/static/assets/imgs/models/' + productName + '.png', function(err) {
              if ( err ) console.log('ERROR: ' + err);
              else console.log("FILE HAS TRANSFERED ...");
            });

        });
      }).run();



      //rename outputfile.png to var productName + '.png' and transfer it to static/imgs/models/




      //var pyshell = new PythonShell('./pattern.py');
      //pyshell.send( './' + req.files[0].path);
      //pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        //stockObject = eval('(' + message + ')');
        //res.json(stockObject);
        //console.log(stockObject[0].title);
      //});

      //pyshell.end(function (err) {
        //if (err) console.log('finished');

      //});
    })
  }

     return {
       post: post,
       get: get
     }
}


module.exports = uploadController;
