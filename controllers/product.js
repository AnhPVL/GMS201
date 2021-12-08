var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = require('../models/product.model');

const dbname = 'GMS200';
const urldb = 'mongodb+srv://dbadmin:5CxELGKdc688hCFK@cluster0.pzupp.mongodb.net/GMS200?retryWrites=true&w=majority';
const dbcollection = "products"
/// --- Code CONTROLLERs
router.use(function timeLog(req, res, next) {
    console.log('\n\t Product controller - Time: ', Date.now());
    next();
})

/// ..................................................
router.get('/product', productPage);
function productPage(req, res) {
    MongoClient.connect(urldb, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.collection(dbcollection).find({}).toArray(function (err, productlist) {
            if (err) throw err;

            res.render("pages/product-list", {
                title: "GMS PRODUCT page",
                products: productlist
                , configHeader: configHeader, currpage: "Product"
            });
            console.log('Found:', productlist);

            db.close();
        });
    });

    console.log("\n\t ... connect PRODUCT from ", req.connection.remoteAddress, req.headers.host);
}

/// ..................................................
router.get('/list', listProductPage);
function listProductPage(req, res) {
    res.send('PRODUCT: list PRODUCT page');
}

/// --- EXports
module.exports = router;


