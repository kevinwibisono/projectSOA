const express = require('express');
const app = express();
const user = require('./routes/user');
// const review = require('./routes/review');
// const collection = require('./routes/collection');
// const resto = require('./routes/resto');

app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));
app.use('/api/user', user);
// app.use('/api/review', review);
// app.use('/api/collec', collection);
// app.use('/api/resto', resto);

require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://lfpnnieeczkxuy:1f05bb5f73a4030094852c9a3b7f7b793ad51e88eda77a648598bfc58e4de0a0@ec2-54-81-37-115.compute-1.amazonaws.com:5432/de1fta97koh1rk",
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

app.listen(3000, function(){
    console.log(`listening port 3000`);
});