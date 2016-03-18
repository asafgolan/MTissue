var jwt  = require('jwt-simple');
var passport = require('passport');
var auth = require('./auth.js');
var config = require('../config.json');
var User = require('../models/user');

var uploadController = function(upload) {
  getToken = function(headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };


  var get = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, config.secret);
      User.findOne({
        name: decoded.name
      }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({
            success: false,
            msg: 'Authentication failed. User not found.'
          });
        } else {
          res.json({
            success: true,
            msg: 'you cannot get upload route, ' + user.name + '!'
          });
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        msg: 'No token provided.'
      });
    }

    //res.sendFile('static' + );

  }

  var post = function(req, res) {


    upload(req, res, function(err) {
      if (err) {
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
