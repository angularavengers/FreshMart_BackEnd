const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    vegetables:[
        {
            titlaText: String,
            image: String,
            price: String,
            unit: String,
            category: String,
            subCategory: String,
            productDetails: String
    }],
    fruits:[
        {
        titlaText: String,
        image: String,
        price: String,
        unit: String,
        category: String,
        subCategory: String,
        productDetails: String
     }]
  })

  module.exports = mongoose.model('products',ProductSchema);