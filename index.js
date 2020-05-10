const express = require('express');
const app = express();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));
require('dotenv').config();

function executeQuery(query){
    client.connect();

    client.query(query, (err, res) => {
        if (err){
            client.end();
            throw err;
        } 
        else{
            client.end();
            return res;
        }        
    });
}

app.get("/", function(req, res){
    var result = executeQuery("SELECT table_schema,table_name FROM information_schema.tables;");
    res.send(result);
});

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}`);
});