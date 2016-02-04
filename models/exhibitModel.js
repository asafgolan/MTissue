var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var exhibitModel = new Schema({
    title: {type: String},
    language: {type: String},
    content: {type: String}
});

module.exports= mongoose.model('Exhibit', exhibitModel);
