var mysql = require("mysql");
var inquirer = require("inquirer");
var tablefy = require("tablefy");
let table = new tablefy();




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
    var myQuery = "select * from bamazon.products"
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        let table = new tablefy();
        table.draw(res);
        managerOptions()
    });
}

function displayLowItems() {
    var myQuery = "select item_id, product_name, price, stock_quantity from bamazon.products where 1 and stock_quantity<5"
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        if (res.length <1) {
            console.log("We're all stocked!");
            
        } else {
            let table = new tablefy();
            table.draw(res);
        };
        // for i 
        // console.log(res[i].item_id+" - "+res[i].product_name+" - only "+res[i].stock_quantity+" left!")
        managerOptions()
    });
}


function chooseInventoryToAdd() {
    // item_id, product_name, price, stock_quantity
    var myQuery = "select * from bamazon.products";
    connection.query(myQuery, function(err, res) {
        if (err) throw err;
        // console.log(res);
        let table = new tablefy();
        table.draw(res);
        // for (var i = 0; i < res.length; i++) {
        //     console.log(
        //         "Item ID: " + res[i].item_id +
        //         " || Name: " + res[i].product_name +
        //         " || Price: $" + res[i].price +
        //         " || Quantity: $" + res[i].stock_quantity
        //     );

        // };
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
                            stock_quantity: 
                            // res[itemToIncrease].stockQuantity+=
                            answer.howManyToAdd
                        },
                        {
                            item_id: answer.itemToIncrease
                        }
                    ],
                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " products updated!\n");
                        managerOptions();
                    }
                );
            });

    });

}

function addNewItem() {
inquirer.prompt([
    {
        name: "new_prod_name",
        message: "What is the name of the new product?"
    },
    {
        name: "new_prod_department",
        message: "In which department will the new product live?"
    },
    {
        name: "new_prod_price",
        message: "How much will the new product cost?"
    },
    {
        name: "new_prod_quantity",
        message: "How many are we stocking?"
    }    
    ]).then(function(answer){
        var myQuery=connection.query("INSERT INTO bamazon.products SET ?",
        {
            product_name: answer.new_prod_name ,
            department_name: answer.new_prod_department,
            price: answer.new_prod_price, 
            stock_quantity: answer.new_prod_quantity 
        },
        function(err,res){
            if (err) throw err;
            console.log("New product added!");
            managerOptions();
        }
            );
        
        
    })
}
