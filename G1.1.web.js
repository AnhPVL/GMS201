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
const cors = require('cors');


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
//var configCloudinary = require("./configs/cloudinary.config")
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

/// ------------------ ROUTer - ROUTing

var productControl = require('./controllers/product');
app.use('/product', productControl);
productControl.params = { configHeader: configHeader, configDB: configDB };
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
        var dbo = db.db("GMS200");
        dbo.collection("products").find({}).toArray(function (err, productlist) {
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
app.listen(process.env.PORT)
///-------------------- Find UnhandledPromise

