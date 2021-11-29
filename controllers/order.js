var express = require('express');
var router = express.Router();// controll path 

/// --- Code CONTROLLERs
router.use(function timeLog (req, res, next) {
    console.log('\n\t Order controller - Time: ', Date.now());
    next();
})

/// ..................................................
router.get('/order', orderPage);
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
/// --- EXports
module.exports = router;