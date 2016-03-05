var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var collectionName = 'exhibits';

var exhibitModel = new Schema({
    title: {type: String},
    content:[{
      title: {type: String},
      language: {type: String},
      description: {type: String},
      url: {type: String}
    }]
});

module.exports= mongoose.model('Exhibit', exhibitModel, collectionName);
