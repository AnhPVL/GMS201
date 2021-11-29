/// INSTALL
/// npm install express  body-parser  cookie-parser multer ejs mongodb mongoose  express-session cookie-session qrcode  qrcode-svg  --save

/// ------------------ Khai bao LIB de su dung
var express = require('express');
var session = require('express-session');
//var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var router = express.Router();

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
const PORT = process.env.PORT || 8081;
var urldb = configDB.clouddb.urldb;


/// ------------------ Khai bao LIB tự viết
var libDB = require("./libs/libDB_Query");

/// ------------------ Khai bao cac Folder Tĩnh, Session, Cookies
app.use(express.static('public'));
app.use(cookieParser());
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
// ------ Connect controller 


var uploadControl = require('./controllers/upload');
app.use('/upload', uploadControl);
uploadControl.params = { configHeader: configHeader, configDB: configDB };

var productControl = require('./controllers/product');
app.use('/product', productControl);
productControl.params = { configHeader: configHeader, configDB: configDB };

/// ------------------ Functions 
/// ..................................................
app.get('/', homePage);
function homePage(req, res) {
    if (session.user) {
        res.render("pages/home", { title: "ATN-Shop Home page", username: session.user.username, configHeader: configHeader, currpage: "Home" });
    } else {
        res.render("pages/home", { title: "ATN-Shop Home page", username: null, configHeader: configHeader, currpage: "Home" });
    }
    console.log("\n\t ... connect from ", req.connection.remoteAddress, req.headers.host);
}

/// ..................................................
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
        title: "ATN-Shop ORDER page",
        content: xcontent, itemlist: itemlist,  // Object.values(itemlist)
        configHeader: configHeader, currpage: "Order"
    });

}


///.........................................................

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

///...................................................



///...................................................
app.get('/quit', quitPage);
function quitPage(req, res) {
    res.send(' shutdown SERVER !!! ... ');
    console.log('\t shutdown SERVER !!! ... ');
    process.exit(0);
}

/// ..................................................
app.get('/infor', inforPage);
function inforPage(req, res) {
    var inter = os.networkInterfaces();
    res.send(JSON.stringify(inter));
    console.log('\t ... get INF ! ');
    for (var key in inter) {
        if (key.indexOf("Wi-Fi") >= 0) {
            console.log(inter[key][1]["address"]);
        }
    }
}

/// ..................................................
app.get('/qr', qrPage);
function qrPage(req, res) {
    var inter = os.networkInterfaces();
    var xcontent = "";

    console.log('\t ... get QR INF ! ');
    for (var key in inter) {

        str = "https://shop-001.herokuapp.com/";
        sv = new QRCode({
            content: str,
            padding: 4,
            width: 512,
            height: 512,
            color: "#000000",
            background: "#ffffff",
            ecl: "M",
        }).svg();
        xcontent += "<br>" + sv;

        res.render("pages/qr", { title: "GMS QR-Code page", content: xcontent, configHeader: configHeader, currpage: "QR code - link" });

    }
}

/// ------------------ Call Server


var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("SERVER http://%s:%s", host, port)
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });
  ///--------------------- EROR 
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // error handlers
   
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
  });