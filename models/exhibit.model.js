var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var collectionName = 'exhibits';

var exhibitModel = new Schema({
    title: {type: String},
    qrUrl:{type: String},
    content:[{
      language: {type: String},
      description: {type: String}
    }]
});

module.exports= mongoose.model('Exhibit', exhibitModel, collectionName);
