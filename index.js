const express = require('express');
const app = express();
const user = require('./routes/user');
const review = require('./routes/review');
const collection = require('./routes/collection');
const resto = require('./routes/resto');

app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));
app.use('/api/user', user);
app.use('/api/review', review);
app.use('/api/collec', collection);
app.use('/api/resto', resto);

require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false},
});

client.connect();

function executeQuery(query){
  return new Promise(function(resolve, reject){
    client.query(query, (err, res) => {
      if(err) reject(err);
      else resolve(res.rows);
    });
  });
}

app.get("/", async function(req, res){
  var result = await executeQuery('SELECT * FROM usertable');
  res.send(result);
});

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}`);
});