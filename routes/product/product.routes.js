var express = require('express');
var router = express.Router();
const Product = require('../../controllers/product.controller');

/* To get all record  */
router.get('/findAllProducts', ((req, res)=> {
    Product.findAllProducts(req, res);
}));

module.exports = router;
