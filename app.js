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

app.use('/api/exhibits', exhibitRouter);

app.get('/', function(req, res){
    res.send('welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});
