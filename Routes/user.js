
var express = require('express');
var passport = require('passport');


var routes = function(User){

  var userRouter = express.Router();
  var isLogged = require('../controllers/isLogged.js');
  var userController = require('../controllers/user')(User);
  var authController = require('../controllers/auth');


console.log("FUCK U DOLPHIN");
  userRouter.route('/')
    .post(authController.isAuthenticated, userController.post)
    .get(authController.isAuthenticated, userController.get);

    return userRouter;
}

module.exports = routes;
