const ProductModel = require('../db/db-model/product.model');
var common = require('../common');
var config = common.config();
var ObjectId = require('mongodb').ObjectID;


// Find All Products
findAllProducts = (req, res) => {
    ProductModel.find()
        .then(products => {
            res.send(products);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Product."
            });
        });
};

module.exports = {
    findAllProducts: findAllProducts,
}
