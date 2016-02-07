var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var collectionName = 'qr_exhibit';
var qrModel = new Schema({
    title: {type: String},
    img_url: {type: String}
});

module.exports = mongoose.model('QrExhibit', qrModel ,collectionName);
