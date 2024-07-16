const express = require("express");
const mongoose = require("mongoose");

const PORT=8000;

//initialize app
const app=express();

//connectiong to db
const connectionUrl = "mongodb://localhost:27017/todoDb";
mongoose.connect(connectionUrl).then(() => console.log("database connected successfully")).catch((error) => console.log(error.message));

//view engine
app.set("view engine","ejs");
app.get("/",(req,res,next)=>{
    try{
        res.render("index");
    } catch(error){
        res.status(500).json({message: error.message});
    }
});

//listen server
app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
});