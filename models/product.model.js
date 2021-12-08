const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    code:{type: String, required:true},
    name:{type: String, required:true},
    description:{type: String, required:true},
    price:{type: Number, required:true},
    expDate:{type: Date, required:true},
    createdDate:{type: Date, required:true, default: Date.now},
    picUrl:{type:String, required:true},
    location:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Location'},
    category:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Category'}
})


module.exports = mongoose.model('Product', productSchema)