const express = require('express');
const app = express();

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("uploads"));
require('dotenv').config();

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/docs", function(req, res){
    res.render("docs");
});

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}`);
});