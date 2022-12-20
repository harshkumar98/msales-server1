const express= require("express");
const fs = require('fs');
const app = express();
const bodyparser = require('body-parser')
const mysql = require("./DbConnect").connection;
const port = process.env.port || process.env.PORT || 3001;

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.post("/login", (req, res) => {
    res.status(200).json({response:200, message:"Login Successful"})
    // let user  = req.param('user',null);
    // let password = req.param('password',null);
    
    // let qry = "select * from user where username ='" + user + "' AND password='" + password + "'";
    
    // mysql.query(qry, (err, results) => {

    //     if (err)
    //         res.status(500).send("DB is not available!")
    //     else {
    //         if (results.length > 0) {
    //             res.status(200).send(results);
    //         }else{
    //             res.status(404).send("Email Or Password InCorrect")
    //         }
    //     }
    // });

});

//change password api

const allowOnlyPost = (req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).json({response:"405",status:'Failed',message:"Method Not Allowed"});
    }
    next()
}

app.use("/changePassword",(req, res) => {
    
    let user  = req.param('user',null);
    let password = req.param('password',null);
    let newPassword = req.param('newPassword',null);
    let cnf_newPassword = req.param('cnf_newPassword',null);

    if(password == newPassword){
        console.log("heloo");
        res.status(201).json({response:"201",status:'Failed',message:"Old and New Password cannot be same"});
    }
    else if(newPassword != cnf_newPassword){
        res.status(201).json({response:"202",status:'Failed',message:"New Password and confirm new Password does not match"});
    }
    else{
    let qry = "select * from user where username ='" + user + "' AND password = '" + password + "'";
    mysql.query(qry, (err, results) => {
        
        if (err)
            res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});
        else {
            if (results.length > 0) {
                let qry1 = "UPDATE user SET password ='" + newPassword + "'" + "where username =" + "'" + user + "'";
                mysql.query(qry1, (err, results) => {
                    if (err)
                        res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});
                    else {
                        res.status(200).json({response:"200",status:'success',message:"Password Updated Successfully"});
                    }
                })
            }else{
                res.status(404).json({response:"404",status:'Failed',message:"Invalid Credential"});
            }
        }
    });
    }
});

//api for menu
app.post("/dashboard",(req, res) => {
    let rawdata = fs.readFileSync('menu.json');
    let menuData = JSON.parse(rawdata);
    res.status(200).json({response:"200",status:'success',data:menuData});
    // let userId  = req.param('userId',null);
    // let qry = "select * from user where userId = '" + userId + "'";
    // mysql.query(qry, (err, results) => {
    //     if (err)
    //         res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});
    //     else {
    //         if (results.length>0) {
    //             qry1="select userId,userName from user where userId ='" + userId + "'";
    //             mysql.query(qry1, (err, result) => {
    //                 //res.status(200).json({response:"200",status:'success',message:"login Successful",user:result});
    //                 if(result.length>0){
    //                 qry2 = "SELECT role.roleId ,role.roleName from user , role, user_role where user.userId = user_role.userId and role.roleId = user_role.roleId and user.userId = '" + userId + "'" ;
    //                 mysql.query(qry2, (err, result2) => {
    //                     if (err)
    //                     res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});   
    //                     else {
    //                     if (result2.length>0) {
    //                     qry3 = "select m.menuId,m.menuName from menu m join role_menu rm on rm.menuId = m.menuId;"
    //                     mysql.query(qry3, (err, result3) => {
    //                         if (err)
    //                     res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});   
    //                     else {
    //                     if (result3.length>0) {
    //                         res.status(200).json({response:"200",status:'success',message:"login Successful",data:{userdata:result,roledata:result2,menudata:result3}});
    //                     }
    //                 }
    //                     })
    //                 }
    //                 }})
    //         }})
    //         }else{
    //             res.status(404).json({response:"404",status:'Failed',message:"Invalid Credential"});
    //         }
    //     }
    // });
});
//user_details api

app.use("/userDetails",allowOnlyPost,(req, res) => {
    let rawdata = fs.readFileSync('role.json');
    let userDetails = JSON.parse(rawdata);
    res.status(200).json({response:"200",status:'success',data:userDetails});
    // let userId  = req.param('userId',null);
    // qry = "SELECT user.username ,role.roleName from user , role, user_role where user.userId = user_role.userId and role.roleId = user_role.roleId and user.userId = '" + userId + "'" ;

    // mysql.query(qry, (err, results) => {
    //     if (err)
    //         res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});
    //     else {
    //         if (results.length > 0) {
    //             res.status(200).json({response:"200",status:'success',data:results});
    //         }else{
    //             res.status(404).json({response:"404",status:'Failed',message:"Invalid Credential"});
    //         }
    //     }
    // });
});

//packageInfo API
app.use("/packageInfo", (req, res) => {
    let rawdata = fs.readFileSync('packageInfo.json');
    let packageInfo = JSON.parse(rawdata);
    res.status(200).json({response:"200",status:'success',data:packageInfo});
    // let qry = "select * from package_info "; 
    // mysql.query(qry, (err, results) => { 
    // if (err)
    //     res.status(500).json({response:"500",status:'Error',message:"Internal Server Error"});
    // else {
    //         if (results.length > 0) {
    //              res.status(200).json({response:"200",status:'success',data:results});
    //         }else{
    //              res.status(404).json({response:"404",status:'Failed',message:"Invalid Credential"});
    //         }
    //      }
    // })
     });















app.listen(port , (err) =>{
    if (err){
        throw err;
    }
    else 
    console.log ("Server is running at port " ,port);
});

