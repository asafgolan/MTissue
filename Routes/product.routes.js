var express = require('express');
var passport = require('passport');
jwt = require('jsonwebtoken');

var routes = function(Product) {
  var productRouter = express.Router();
  require('../controllers/passport')(passport);
  var productController = require('../controllers/product.server.controller.js')(Product);


  productRouter.route('/')
    .post(passport.authenticate('jwt', {
      session: false
    }), productController.post)
    .get(productController.get);

  productRouter.use('/:id', function(req, res, next) {
    Product.findOne({
      _id: req.params.id
    }, function(err, product) {
      if (err)
        res.status(500).send(err);
      else if (product) {
        req.product = product;
        next();
      } else {
        res.status(404).send('no exhibit found')
      }
    });
  });

  productRouter.route('/:id')
    //exhibitRouter.route('/:exhibitId')
    .get(function(req, res) {
      res.json(req.product);
    })
    //put changes qrUrl and Content
    /**
    .put(passport.authenticate('jwt', {
      session: false
    }), function(req, res) {
      //req.exhibit= req.body;
      req.exhibit.title = req.body.title;
      req.exhibit.content = req.body.content;
      req.exhibit.save(function(err) {
        if (err)
          res.status(500).send(err);
        else {
          res.json(req.exhibit)
        }
      });
    })
    //maybe dont have to use the Patch
    .patch(passport.authenticate('jwt', {
      session: false
    }), function(req, res) {

      if (req.body._id)
        delete req.body._id
      for (var p in req.body) {
        req.exhibit[p] = req.body[p];
      }
      req.exhibit.save(function(err) {
        if (err)
          res.status(500).send(err);
        else {
          res.json(req.exhibit);
        }
      });
    })
    .delete(passport.authenticate('jwt', {
      session: false
    }), function(req, res) {
      req.exhibit.remove(function(err) {
        if (err)
          res.status(500).send(err);
        else {
          res.status(204).send('Removed');
        }
      });
    })**/
  return productRouter;
};

module.exports = routes;
