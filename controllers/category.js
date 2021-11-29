var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Category = require('../models/category')

const dbname = 'shopPavo';
const uri = 'mongodb+srv://dbadmin:5CxELGKdc688hCFK@cluster0.pzupp.mongodb.net/shopPavo?retryWrites=true&w=majority';

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

/// --- Code CONTROLLERs
router.use(function timeLog(req, res, next) {
    console.log('\n\t Category controller - Time: ', Date.now());
    next();
})

/// ..................................................
router.get('/category', categoryPage);
function categoryPage(req, res) {
    MongoClient.connect(urldb, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("shopPavo");
        dbo.collection("category").find({}).toArray(function (err, categorylist) {
            if (err) throw err;

            res.render("pages/category-list", {
                title: "GMS category page",
                categories: categorylist
                , configHeader: configHeader, currpage: "Category"
            });
            console.log('Found:', categorylist);

            db.close();
        });
    });

    console.log("\n\t ... connect category from ", req.connection.remoteAddress, req.headers.host);
}

/// ..................................................
router.get('/list', listCategoryPage);
function listCategoryPage(req, res) {
    res.send('Category: list category page');
}

/// ..................................................
router.post('/create', uploadStore.array('img', 12), createCategoryPage);
router.get('/create', uploadStore.array('img', 12), createCategoryPage);
function createCategoryPage(req, res, next) {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, dbconnection) {
            if (err) throw handleError(err);
            ///
            console.log('\n\t insert Category: Successfully connected');

            ///
            const newcategory = new Category({
                _id: new mongoose.Types.ObjectId,
                id: req.body.id,
                name: req.body.name,
                description: req.body.description
            });
            newcategory.save(function (err) {
                if (err) throw err;
                ///
                console.log('\n\t insert - category model - Successfully insert');
            });
        });

    res.render("pages/category_create", { title: "GMS create category page", Notify: "", configHeader: router.params.configHeader, currpage: "create Category" });
}




/// --- EXports
module.exports = router;


