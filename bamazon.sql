drop database if exists bamazon;
create database bamazon;
use bamazon;

drop table if exists bamazon.products;

CREATE TABLE bamazon.products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10 , 2 ) NULL,
    stock_quantity INT(10) NOT NULL DEFAULT 0,
    PRIMARY KEY (item_id)
)
;
