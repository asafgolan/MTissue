var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var db = mongoose.connect('mongodb://admin:admin@ds055525.mongolab.com:55525/museo');

var Exhibit = require('./models/exhibitModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


 exhibitRouter = require('./Routes/exhibitRoutes')(Exhibit);



/**
  var exhibitRouter = express.Router();
    exhibitRouter.route('/Exhibits')
    .post(function(req,res){

      var exhibit = new Exhibit(req.body);
      exhibit.save();
      console.log(exhibit);
      res.status(201).send(exhibit);

    })
    .get(function(req,res){
        var query = {};
        if(req.query.title){
          query.title = req.query.title;
        }

        Exhibit.find(query,function(err,exhibits){
          if (err)
          res.status(500).send(err);
          else
            res.json(exhibits);
        });
    });

exhibitRouter.route('/Exhibits/:exhibitId')
.get(function(req,res){
    Exhibit.findById(req.params.exhibitId,function(err,exhibits){
      if (err)
      res.status(500).send(err);
      else
        res.json(exhibits);
    });
});**/

app.use('/api/exhibits', exhibitRouter);

app.get('/', function(req, res){
    res.send('welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});
