const mysql = require('mysql');

var connection = mysql.createConnection({
  host: "msaleazure.mysql.database.azure.com", 
  user: "azureadmin@msaleazure", 
  password: "azsql@123", 
  database: "msale", port: 3306, 
});
// Checking the database connection
connection.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established successfully');
});
module.exports.connection = connection;