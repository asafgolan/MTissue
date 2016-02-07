var express = require('express');

var routes = function(Exhibit/**,QrExhibit**/){

  var exhibitRouter = express.Router();

  var exhibitController = require('../controllers/exhibit.server.controller.js')(Exhibit);
  /**
upload files
  api/exhibits/qr_exhibits
  **/



 /**
 API URL
api/exhibits/qr_exhibits

  exhibitRouter.route('/qr_exhibits')
    .get(function(req,res){
      var query = {};
      if(req.query.title){
        query.title = req.query.title;
      }
      QrExhibit.find(query ,function(err, qrs){
        if(err){
        res.status(500).send(err);
        }else{
          res.json(qrs);
        }
      });
    });

  exhibitRouter.route('/qr_exhibits/:title')
  .get(function(req,res){
    QrExhibit.findOne({
      title: req.params.title,
    },function(err, qrs){
      if(err){
        res.status(500).send(err);
      }else{
        res.json(qrs);
      }
    });
  });
**/
  /**
  API URL
  api/exhibits/
  **/

  exhibitRouter.route('/')
      .post(exhibitController.post)
      .get(exhibitController.get);

  exhibitRouter.use('/:title', function(req,res,next){
      Exhibit.findOne({
        title: req.params.title
      },function(err,exhibit){
        if (err)
          res.status(500).send(err);
        else if(exhibit) {
          req.exhibit = exhibit;
          next();
        }
        else {
          res.status(404).send('no exhibit found')
        }
      });
  });

  exhibitRouter.route('/:title')
  //exhibitRouter.route('/:exhibitId')
  .get(function(req,res){
      res.json(req.exhibit);
  })
  //put changes qrUrl and Content
  .put(function(req,res){
        req.exhibit.qrUrl = req.body.qrUrl;
        req.exhibit.content = req.body.content;
        req.exhibit.save(function(err){
          if (err)
            res.status(500).send(err);
          else {
            res.json(req.exhibit)
        }
    });
  })
  //maybe dont have to use the Patch
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
