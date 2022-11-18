const express= require("express");
const app = express();
const bodyparser = require('body-parser')
//const mysql = require("./DbConnect").connection;
const port = process.env.port || process.env.PORT || 3001;

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.post("/login", (req, res) => {

    let user  = req.param('user',null);
    let password = req.param('password',null);
    //res.send(phone + "Hello");
    let qry = "select * from user where username ='" + user + "' AND password='" + password + "'";
    
    mysql.query(qry, (err, results) => {

        if (err)
            res.status(500).send("DB is not available!")
        else {
            if (results.length > 0) {
                res.status(200).send(results);
            }else{
                res.status(404).send("Email Or Password InCorrect")
            }
        }
    });

});

app.get("/addstudent", (req, res) => {

    const { name, phone, email } = req.query
    let qry = "select * from student where email=? or phnumber=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if (err)
            throw err
        else {
            if (results.length > 0) {
                res.send("Data Already Present");
            } else {

                // insert query
                let qry2 = "insert into student values(?,?,?)";
                mysql.query(qry2, [phone, name,email], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.send("Data Addded Successfully")
                    }
                })
            }
        }
    })
});

app.post("/searchstudent", (req, res) => {

    let phone  = req.param('phone',null);
    //res.send(phone + "Hello");
    let qry = "select * from student where phnumber = ?";
    
    mysql.query(qry, [phone], (err, results) => {
        //res.send(results);
        //res.send(phone)
        if (err)
            throw err
        else {
            if (results.length > 0) {
                //console.log(results);
                res.status(200).send(results);
            }else{
                res.status(404).send("No data Found")
            }
        }
    });

});

app.listen(port , (err) =>{
    if (err){
        console.log ("throwing at you now$#&$#")
        throw err;
    }
    else 
        console.log ("Server is running at port " ,port);
});

