var mysql = require("mysql");
var inquirer = require("inquirer");
var wantedID;
var currStock;



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


function displayItems(){
	console.log("Here are the items we have in stock: \n");
	var myQuery="select * from bamazon.products where 1 and stock_quantity>0"
	connection.query(myQuery, function(err,res){
		if (err) throw err;
		for (var i=0; i< res.length; i++){
			console.log(
				"Item ID: "+ res[i].item_id +
				" || Name: " + res[i].product_name +
				" || Price: $" + res[i].price
				);
		}
		// custIDPrompt();
	});
}

function custIDPrompt() {
  inquirer
    .prompt({
      name: "prod_id",
      type: "input",
      message: "What is the ID of the product you'd like to buy?",
    })
    .then(function(answer) {
    	// answer.prod_id
    	

    	// store id as a variable, then new inq promt asking how many
    	// then run sql query to see if we have that many
//----------------
    	//or run sql query when they give us id to store quantity as a variable
    	// then use the second inq prompt answer to compare against that num
    	// then if or case such that if false, return insuff quant
    });
}