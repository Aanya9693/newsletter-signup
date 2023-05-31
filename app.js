//jshint esversion: 6

//all the require module that we installed 
const express = require("express");
const bodyParser=require("body-parser");
const request = require("request");
const https =require("https");

//app constant and this is equal to a new instance of express

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    //whenever someone landed on home page send the directory name /signup.html
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    //our data object
    var data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };
    //for flat pack json //this is we gonna send to mailchimp
    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/07159661a7";

    const options={
        method: "POST",
        auth: "aanya1:0ba382fb58ea280e21ddac2d0b68fbd3-us21"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        request.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();  
    
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

// set up our server to listen on port 3000
app.listen(3000, function(){
    //once that port is setup and ready to go, we are going to log that server is running on port 3000
    console.log("Server is running on port 3000");
})


//Api keys
// 0ba382fb58ea280e21ddac2d0b68fbd3-us21

// List id
// 07159661a7