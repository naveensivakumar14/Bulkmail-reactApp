//backend

const express=require("express");
const cors=require("cors")
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")

const app=express()

//middleware
app.use(cors())
app.use(express.json())

//mongoDB database connectivity
mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function(){
    console.log("Connected to MongoDB")
}).catch(function(){
    console.log("Failed to connect")
})

//model
const credential =mongoose.model("credential",{},"bulkmail")


//API
app.post("/sendemail",function(req,res){

    var msg=req.body.msg
    var emailList=req.body.emailList

    credential.find().then(function(data){
        // console.log(data[0].toJSON())
        const transporter = nodemailer.createTransport({
            service:"gmail",
          
            //user mail id and pass from mongodb 
            auth: {
              user: data[0].toJSON().user,
              pass: data[0].toJSON().pass,
            },
          });
    
        //waiting period
        new Promise(async function(resolve,reject){
                 
            //try catch for waiting for email should send to all email from sheet
                 try{
                    for(var i=0;i<emailList.length;i++){
                        await transporter.sendMail(
                        {
                            from:"ersnaveenkumar@gmail.com",
                            to:emailList[i],
                            subject:"A message from Bulk Mail App",
                            text:msg
                        })
                            console.log("Email send to:"+emailList[i])
                        }
                        resolve("Success")
                    }
                    //if failed to send msg to any one of the mail
                    catch(error){
                    reject("Failed")
                    }
    
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
          
    }).catch(function(error){
        console.log(error)
    })
    
    


    
    
})

//server
app.listen(5000,function(){
    console.log("Server Started....")
})

