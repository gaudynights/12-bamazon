var mysql = require("mysql");
var inquirer = require("inquirer");
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
    console.log("Welcome to Bamazon, a service similar to, but for legal reasons, distinct from Amazon.")
    displayItems();
});


function displayItems() {
    console.log("Here are the items we have in stock: \n");
    var myQuery = "select * from bamazon.products where 1 and stock_quantity>0"
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " + res[i].item_id +
                " || Name: " + res[i].product_name +
                " || Price: $" + res[i].price
            );
        }
        custIDPrompt();
    });
}

//run sql query when they give us id to store quantity as a variable
// then use the second inq prompt answer to compare against that num
// then if or case such that if false, return insuff quant

function custIDPrompt() {
    inquirer
        .prompt({
            name: "prod_id",
            type: "input",
            message: "What is the ID of the product you'd like to buy?",
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
    inquirer
        .prompt({
            name: "amount_wanted",
            type: "input",
            message: "How many would you like?",
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
                console.log(" ¯\\_(ツ)_/¯ Oops! We only have " + currStock + "! ¯\\_(ツ)_/¯ ");
                howMany();
            } else {
                sellIt();
            }


        })
}


function sellIt() {
    console.log("sellin stuff, man!");
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
            console.log(res.affectedRows + " products updated!\n");
            console.log("********* Congratulations on your purchase of "+wantedAmt+" "+ wantedItem+"(s)! It cost you $"+totalCost+"! Let's keep shopping!");
            displayItems();
        }
    );
    console.log(myQuery.sql);
}