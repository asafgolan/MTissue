var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  config = require('./config.json');
//var client = redis.createClient(6379, '127.0.0.1');
//var jwt  = require('jwt-simple');
//client.on('error', function(error) {
//  console.log("Error While creating the Socket Connection");
//});

//var db;
//if(process.env.ENV == 'Test')
//db = mongoose.connect(config.TestDBPath);
//else {
var db = mongoose.connect(config.DBPath);
//}
var Product = require('./models/product.model');
var User = require('./models/user');
require('./controllers/passport')(passport);

var app = express();
app.set('superSecret', config.secret);

var port = process.env.PORT || 3000;
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //console.log("I HAVE FILE WAITING -->>>>>");
    //console.log(file);
    callback(null, './static/assets/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
}).array('userPhoto', 2);

uploadRouter = require('./Routes/upload.routes.js')(upload);
uploadsWatsonRouter = require('./Routes/uploadToWatson.js')(upload);
//exhibitRouter = require('./Routes/exhibit.routes')(Exhibit);
productRouter = require('./Routes/product.routes')(Product);
userRouter = require('./Routes/user')(User);
app.use(express.static(__dirname + '/static'));

app.use('/static', express.static(__dirname + '/static'));
app.use('/api/uploads', passport.authenticate('jwt', {
  session: false
}), uploadRouter);

app.use('/api/uploads_n_query_watson', passport.authenticate('jwt', {
  session: false
}), uploadsWatsonRouter);

app.use('/api/products', productRouter);
app.use('/api/users', passport.authenticate('jwt', {
  session: false
}), userRouter);

app.post('/api/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({

        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else {
      // Check if password matches
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user, config.secret, {
            expiresIn: 10080 // in seconds
          });

          res.json({
            success: true,
            token: 'JWT ' + token
          });
        } else {
          res.status(401).send({
            success: false,
            message: 'Authentication failed. Passwords did not match.'
          });
        }
      });
    }
  });
});



app.listen(port, function() {
  console.log('Gulp is running my app on  PORT: ' + port);
});

module.exports = app;
