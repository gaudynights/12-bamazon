var mysql = require("mysql");
var inquirer = require("inquirer");
var tablefy = require("tablefy");
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
                    chooseInventoryToAdd();
                    break;

                case "Add New Product":
                    addNewItem();
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
        if (res.length > 0) {
            table.draw(res);
        } else {
            console.log("We're all stocked!")
        };
        managerOptions()
    });
}


function chooseInventoryToAdd() {

    var myQuery = "select item_id, product_name, price, stock_quantity from bamazon.products";
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        // console.log(res);
        table.draw(res);
        inquirer
            .prompt([{
                    name: "itemToIncrease",
                    type: "input",
                    message: "Enter the item number of which you'd like to add more: ",
                    validate: function(value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "howManyToAdd",
                    type: "input",
                    message: "How many total will there be now? ",
                    validate: function(value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function(answer) {
                var myQuery2 = connection.query("UPDATE bamazon.products SET ? WHERE ?", [{
                            stock_quantity: answer.howManyToAdd
                        },
                        {
                            item_id: answer.itemToIncrease
                        }
                    ],
                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " products updated!\n");
                        // console.log("\n+++++++  ᕕ( ՞ ᗜ ՞ )ᕗ  +++++++ \n \n Congratulations on your purchase of "+wantedAmt+" "+ wantedItem+"(s)! \n It cost you $"+totalCost+"! \n Shall we keep shopping? \n \n+++++++  ┗(＾0＾)┓  +++++++\n");
                        // enterExit();
                    }
                );
            });

    });

}