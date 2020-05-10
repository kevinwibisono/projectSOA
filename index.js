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
    return new Promise(function(resolve, reject){
        client.connect();

        client.query(query, (err, res) => {
            if (err){
                client.end();
                reject(err);
            } 
            else{
                client.end();
                console.log(res);
                resolve(res);
            }        
        });
    })
}

app.get("/", async function(req, res){
    var result = await executeQuery("SELECT table_schema,table_name FROM information_schema.tables;");
    res.send(result);
});

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}`);
});