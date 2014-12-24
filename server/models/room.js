var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
var roomSchema = new Schema({
    id:  String,
    name: String
});

module.exports = mongoose.model('Room', roomSchema);