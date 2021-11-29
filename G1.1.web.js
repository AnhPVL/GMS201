/// INSTALL
/// npm install express  body-parser  cookie-parser multer ejs mongodb mongoose  express-session cookie-session qrcode  qrcode-svg atob dbo--save

/// ------------------ LIB Used 
var express = require('express');
var session = require('express-session');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var router = express.Router();
const bodyParser = require('body-parser');
var multer = require('multer');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var app = express();

var os = require('os');
var fs = require('fs');
var path = require('path');
var QRCode = require("qrcode-svg");
var atob = require('atob');



/// ------------------ CONFIG
var configHeader = require("./configs/config_Header");
var configDB = require("./configs/config_DB");
const PORT = 8081;
var urldb = configDB.clouddb.urldb;


/// ------------------ LIB Query 
var libDB = require("./libs/libDB_Query");

/// ------------------ Static Folder , Session, Cookies
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
/// session
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'GMS',
  cookie: {
    maxAge: 600000,
    views: 1,
  }
})
);
/// engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//////////////////////////////////////////////////////////////
/// ------------------ VAR - global
var chattingLog = [];

/// ------------------ ROUTer - ROUTing

var productControl = require('./controllers/product');
app.use('/product', productControl);
productControl.params = { configHeader: configHeader, configDB: configDB };

var categoryControl = require('./controllers/category');
app.use('/category', categoryControl);
categoryControl.params = { configHeader: configHeader, configDB: configDB };

var uploadControl = require('./controllers/upload');
app.use('/upload', uploadControl);
uploadControl.params = { configHeader: configHeader, configDB: configDB };
// uploadControl.uploadStore = uploadStore;

/// ------------------ Controller, Functions , ... 

///..................................................

app.get('/', homePage);
function homePage(req, res) {
  res.render("pages/home", { title: "GMS Home page", username: null, configHeader: configHeader, currpage: "Home" });
  console.log("\n\t ... connect from ", req.connection.remoteAddress, req.headers.host);
}
/// ..................................................
app.get('/product', productPage);
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

app.get('/category', categoryPage);
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

    console.log("\n\t ... connect CATEGORY from ", req.connection.remoteAddress, req.headers.host);
}

app.get('/order', orderPage);
function orderPage(req, res) {
  var xcontent = "";

  console.log('\t ... get ORDER INF ! ');

  var strtext = req.cookies.cart_itemlist;
  xcontent += "<BR><p> " + strtext + "</p>";
  //
  strtext = atob(strtext);
  xcontent += "<BR>atob <p> " + strtext + "</p>";
  //
  strtext = escape(strtext);
  xcontent += "<BR>escape <p> " + strtext + "</p>";
  //
  strtext = decodeURIComponent(strtext);
  xcontent += "<BR>decodeURIComponent <p> " + strtext + "</p>";
  ///
  var itemlist = JSON.parse(strtext);

  console.log("\n\t ", xcontent);

  res.render("pages/order", {
    title: "GMS ORDER page",
    content: xcontent, itemlist: itemlist,  // Object.values(itemlist)
    configHeader: configHeader, currpage: "Order"
  });

}

/// ..................................................
app.get('/quit', quitPage);
function quitPage(req, res) {
  res.send(' shutdown SERVER !!! ... ');
  console.log('\t shutdown SERVER !!! ... ');
  process.exit(0);
}


/// ------------------ Call SERVER


var server = app.listen(PORT, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("SERVER http://%s:%s", host, port)
});
///-------------------- Find UnhandledPromise

