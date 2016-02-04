var express = require('express');

var routes = function(Exhibit){

  var exhibitRouter = express.Router();

  var exhibitController = require('../controllers/exhibit.server.controller.js')(Exhibit);
  exhibitRouter.route('/')
      .post(exhibitController.post)
      .get(exhibitController.get);

  exhibitRouter.use('/:title/:language', function(req,res,next){
      Exhibit.findOne({
        title: req.params.title,
        language: req.params.language
      },function(err,exhibit){
        if (err)
          res.status(500).send(err);
        else if(exhibit) {
          req.exhibit = exhibit;
          next();
        }
        else {
          res.status(404).send('no book found')
        }
      });
  });

  exhibitRouter.route('/:title/:language')
  //exhibitRouter.route('/:exhibitId')
  .get(function(req,res){
      res.json(req.exhibit);
  })
  //put update only the content
  .put(function(req,res){
        req.exhibit.content = req.body.content;
        req.exhibit.save(function(err){
          if (err)
            res.status(500).send(err);
          else {
            res.json(req.exhibit)
        }
    });
  })
  .patch(function(req,res){
    if(req.body._id)
      delete req.body._id
    for(var p in req.body){
      req.exhibit[p] = req.body[p];
    }
    req.exhibit.save(function(err){
      if (err)
        res.status(500).send(err);
      else {
        res.json(req.exhibit);
      }
    });
  })
  .delete(function(req, res){
    req.exhibit.remove(function(err){
      if(err)
        res.status(500).send(err);
      else{
        res.status(204).send('Removed');
      }
    });
  })
  return exhibitRouter;
};

module.exports = routes;
