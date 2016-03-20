
var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
require('../controllers/passport')(passport);

var routes = function(User){

  var userRouter = express.Router();
  var userController = require('../controllers/user')(User);


console.log("FUCK U DOLPHIN");
  userRouter.route('/')
    .post(passport.authenticate('jwt', { session: false}), userController.post)
    .get(passport.authenticate('jwt', { session: false}), userController.get);

    return userRouter;
}

module.exports = routes;
