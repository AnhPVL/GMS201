const mongoose = require('mongoose');
const Product = require('./product.model')

const categorySchema = new mongoose.Schema({
    name:{type: String, required:true},
    description:{type: String, required:true}
})
categorySchema.pre('remove', function(next) {
    // Find products by id
    Product.find({category: this.id}, (err, products) => {
        if (err) {
            next (err)
        } else if (products.length > 0) { 
            products.forEach(product => product.remove())
            next()
        } else {
            next()
        }
    })
})
module.exports = mongoose.model('Category', categorySchema)