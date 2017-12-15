var mysql = require("mysql");
var inquirer = require("inquirer");
var tablefy=require("tablefy");
var table = new tablefy();




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
    console.log("Welcome, Manager!");
    managerOptions();
});


function managerOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          displayAllItems();
          break;

        case "View Low Inventory":
          displayLowItems();
          break;

        case "Add to Inventory":
          rangeSearch();
          break;

        case "Add New Product":
          songSearch();
          break;

      }
    });
}



function displayAllItems() {
    var myQuery = "select item_id, product_name, price, stock_quantity from bamazon.products"
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        table.draw(res);
        managerOptions()
    });
}

function displayLowItems() {
    var myQuery = "select item_id, product_name, price, stock_quantity from bamazon.products where 1 and stock_quantity<5"
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        if (res.length>0){
            table.draw(res);
        } else {
            console.log("We're all stocked!")
        }
    });
}