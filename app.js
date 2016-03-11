var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    multer  =   require('multer'),
    config = require('./config.json');
//var db;
//if(process.env.ENV == 'Test')
//db = mongoose.connect(config.TestDBPath);
//else {

var  db = mongoose.connect(config.DBPath);
//}
var Exhibit = require('./models/exhibit.model');

var app = express();

var port = process.env.PORT || 3000;
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage }).array('userPhoto',2);

uploadRouter = require('./Routes/upload.routes.js')(upload);
exhibitRouter = require('./Routes/exhibit.routes')(Exhibit);

app.use('/uploads', uploadRouter);
app.use('/api/exhibits', exhibitRouter);


app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});

module.exports = app;
