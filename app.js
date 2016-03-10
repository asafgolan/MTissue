var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    multer  =   require('multer');

//var db;
//if(process.env.ENV == 'Test')
//db = mongoose.connect('mongodb://admin:admin@ds063892.mongolab.com:63892/museo_test');
//else {
var  db = mongoose.connect('mongodb://admin:admin@ds055525.mongolab.com:55525/museo');
//}
var Exhibit = require('./models/exhibit.model');
//var QrExhibit = require('./models/qr_exhibitModel');

var app = express();

var port = process.env.PORT || 3000;
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    //console.log(file.mimetype);

    callback(null, './uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage }).array('userPhoto',2);
/**
app.get('/uploads',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/uploads',function(req,res){
	upload(req,res,function(err) {
	   console.log(req.files);
		//console.log(req);
		if(err) {
			return res.end("Error uploading filessssss.");
		}
    res.json(req.files);
	});
});

**/
uploadRouter = require('./Routes/upload.routes.js')(upload);
exhibitRouter = require('./Routes/exhibit.routes')(Exhibit/** ,QrExhibit**/);


app.use('/uploads', uploadRouter);
app.use('/api/exhibits', exhibitRouter);


app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});

module.exports = app;
