var mysql = require("mysql");
var inquirer = require("inquirer");
var tablefy=require("tablefy");
var table = new tablefy();
var wantedID;
var wantedItem;
var currStock;
var wantedAmt;
var item_price;
var totalCost;



var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    // console.log("Welcome to Bamazon, a service similar to, but for legal reasons, distinct from Amazon.");
    console.log("┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻|\n┻┳|\n┳┻| _\n┻┳| •.•)  Psst! Wanna buy some stuff?\n┳┻|⊂ﾉ   \n┻┳|\n");
    enterExit();
});


    // displayItems();

function displayItems() {
    var myQuery = "select item_id as 'Item ID', product_name Item, concat('$',price) Price from bamazon.products where 1 and stock_quantity>0"
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        table.draw(res);
        custIDPrompt();
    });
}

//run sql query when they give us id to store quantity as a variable
// then use the second inq prompt answer to compare against that num
// then if or case such that if false, return insuff quant

function custIDPrompt() {
	console.log(" (•_•) \n <)   )╯ What \n /    \\ \n  \n \\(•_•) \n (   (> Chu \n /    \\ \n  \n  (•_•) \n <)   )>  Want? \n /    \\ \n ")
    inquirer
        .prompt({
            name: "prod_id",
            type: "input",
            message: "Item ID: ",
            validate: function(value) {
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                return false;
            }
        })
        .then(function(answer) {
                wantedID = answer.prod_id;
                console.log(wantedID);
                var myQuery = "select * from bamazon.products where 1 and item_id=?";
                connection.query(myQuery, [wantedID], function(err, res) {
                    if (err) throw err;
                    currStock = res[0].stock_quantity;
                    item_price=res[0].price;
                    wantedItem=res[0].product_name;
                    howMany();
                })
            }

        );
}

function howMany() {
	console.log("\n      ლ(ಠ益ಠ)ლ  \nSo how many you want?!?!\n");
    inquirer
        .prompt({
            name: "amount_wanted",
            type: "input",
            message: " ",
            validate: function(value) {
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                return false;
            }
        })
        .then(function(answer) {
            wantedAmt = answer.amount_wanted;
            if (wantedAmt > currStock) {
                console.log("\n ¯\\_(ツ)_/¯ Oops! We only have " + currStock + "! ¯\\_(ツ)_/¯ \n");
                howMany();
            } else {
                sellIt();
            }


        })
}


function sellIt() {
    // console.log("sellin stuff, man!");
    var newAmt = (currStock - wantedAmt);
    totalCost=wantedAmt*item_price;
    var myQuery = connection.query("UPDATE bamazon.products SET ? WHERE ?", [{
                stock_quantity: newAmt
            },
            {
                item_id: wantedID
            }
        ],
        function(err, res) {
            if (err) throw err;
            // console.log(res.affectedRows + " products updated!\n");
            console.log("\n+++++++  ᕕ( ՞ ᗜ ՞ )ᕗ  +++++++ \n \n Congratulations on your purchase of "+wantedAmt+" "+ wantedItem+"(s)! \n It cost you $"+totalCost+"! \n Shall we keep shopping? \n \n+++++++  ┗(＾0＾)┓  +++++++\n");
            enterExit();
        }
    );
    // console.log(myQuery.sql);
}

function enterExit(){

    inquirer
    .prompt({
    	name: "enter",
    	type: "confirm",
    	message: " ",
    	default: true
    })
    .then(function(answer){
    	if (answer.enter){
    		displayItems();
    	} else{
	console.log("☆。★。☆。★ \n  。☆ 。☆。☆ \n ★。＼｜／。★ \n  Fine! See \n  ya later, \n  jerk-bag! \n ★。／｜＼。★ \n    。☆。。☆    \n ☆。★。 ☆  ★ \n");
	connection.end();
    	}
    })


}