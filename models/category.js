var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

var Category = mongoose.model('Category', categorySchema, "category");
  
module.exports = Category;
