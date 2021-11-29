var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = require('../models/product');


var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, xcallback) {
        xcallback(null, 'public/image');
    },
    filename: function (req, file, xcallback) {
        xcallback(null, file.originalname);
    }
});



const dbname = 'shopPavo';
const uri = 'mongodb+srv://dbadmin:5CxELGKdc688hCFK@cluster0.pzupp.mongodb.net/shopPavo?retryWrites=true&w=majority';


router.get('/', (req, res) => {
    res.render("product/product_create", {
        viewTitle: "Insert Product"
    });
});

/*router.post('/', (req, res) => {
    if (req.body._id == '')
        insertProduct(req, res);
        else
        updateProduct(req, res);
});*/
var uploadStore = multer({ storage: storage, fileFilter: checkimage });
function checkimage(req, file, cb) {

    if (file.originalname.match(/(\.jpg)$/)) {
        cb(new Error('Allow upload only image.jpg'))
    }
    else {
        cb(null, true)
    }
}

router.post('/', uploadStore.array('upfiles', 12), (req, res, next) => {
    if (req.body._id == '') {
        insertProduct(req, res);
        const files = req.files
        if (!files) {
            const error = new Error('Please choose files');
            error.httpStatusCode = 400;
            return next(error);
        }

        res.send(files);
    }

    else {
        updateProduct(req, res);

        const files = req.files
        if (!files) {
            const error = new Error('Please choose files');
            error.httpStatusCode = 400;
            return next(error);
        }

        res.send(files);
    }
})


function insertProduct(req, res) {
    var product = new Product();
    product.id = req.body.id;
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.location = req.body.location;
    product.price = req.body.price;
    product.save((err, doc) => {
            if (!err)
                res.redirect('product/list');
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("product/createAndUpdate", {
                        viewTitle: "Insert Product",
                        product: req.body
                    });
                }
                else
                    console.log('Error during record insertion : ' + err);
            }
        });
}

function updateProduct(req, res) {
    Product.findOneAndUpdate({ id: req.body.id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('product/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("product/addOrEdit", {
                    viewTitle: 'Update Product',
                    product: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Product.find((err, docs) => {
        if (!err) {
            res.render("product/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving product list :' + err);
        }
    });
});
module.exports = router;
