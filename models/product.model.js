var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var collectionName = 'products';
//number 1  translated description.
//number 2 image
//number 3 video
var productModel = new Schema({
    title: {type: String},
    code: {type: String},
    width: {type: Number},
    height: {type: Number}
});

module.exports= mongoose.model('Product', productModel, collectionName);
