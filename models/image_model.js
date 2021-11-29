var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    image_path: String,
    created_at: {
        type: Date,
        default: Date.now
    }
})

var Image = mongoose.model('Image', imageSchema, "image");
  
module.exports = Image;