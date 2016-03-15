var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var collectionName = 'exhibits';
//number 1  translated description.
//number 2 image
//number 3 video
var exhibitModel = new Schema({
    title: {type: String},
    content:[{
      title: {type: String},
      type:{type: Number},
      language: {type: String},
      //check string limitations
      description: {type: String},
      url: {type: String}
    }]
});

module.exports= mongoose.model('Exhibit', exhibitModel, collectionName);
