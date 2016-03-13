var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    multer  =   require('multer'),
    logger = require('morgan'),
    jsonwebtoken = require('jsonwebtoken'),
    passport = require('passport'),
    config = require('./config.json');
//var db;
//if(process.env.ENV == 'Test')
//db = mongoose.connect(config.TestDBPath);
//else {
var  db = mongoose.connect(config.DBPath);
//}
var Exhibit = require('./models/exhibit.model');
var User = require('./models/user');
var authController = require('./controllers/auth');

var app = express();
app.set('superSecret', config.secret);

var port = process.env.PORT || 3000;
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());

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
userRouter = require('./Routes/user')(User);

app.use('/uploads', authController.isAuthenticated ,uploadRouter);
app.use('/api/exhibits', exhibitRouter);
app.use('/api/users', userRouter);

app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});

module.exports = app;
