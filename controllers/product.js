var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = require('../models/product');
var uploadp = require('../controllers/upload')


var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, xcallback) {
        xcallback(null, 'public/images');
    },
    filename: function (req, file, xcallback) {
        xcallback(null, file.originalname);
    }
});
var uploadStore = multer({ storage: storage, fileFilter: checkimage });
function checkimage(req, file, cb) {

    if (file.originalname.match(/(\.jpg)$/)) {
        cb(new Error('Allow upload only image.jpg'))
    }
    else {
        cb(null, true)
    }
}
const dbname = 'shopPavo';
const uri = 'mongodb+srv://dbadmin:5CxELGKdc688hCFK@cluster0.pzupp.mongodb.net/shopPavo?retryWrites=true&w=majority';

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
        var dbo = db.db("shopPavo");
        dbo.collection("product").find({}).toArray(function (err, productlist) {
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

/// ..................................................
router.post('/', uploadStore.array('img', 12), createProductPage);
router.get('/create', uploadStore.array('img', 12), createProductPage); 
function createProductPage(req, res, next) {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, dbconnection) {
            if (err) throw handleError(err);
            ///
            console.log('\n\t insert Product: Successfully connected');

            id = req.body.id,
            name = req.body.name,
            description = req.body.description,
            category = req.body.category,
            location = req.body.location,
            price= req.body.price
            ///
            const newproduct = new Product({
                _id: new mongoose.Types.ObjectId,
                "id": id,
                "name": name,
                "description":description,
                "category":category,
                "location": location,
                "price": price    
            });
            var addnew = uploadStore(newproduct);
           addnew.save(function (err) {
                if (err) throw err;
                ///
                console.log('\n\t insert - Product model - Successfully insert');
            });
        });

    res.render("pages/product_create", { title: "GMS create PRODUCT page", Notify: "", configHeader: router.params.configHeader, currpage: "create Product" });
}


/// --- EXports
module.exports = router;


