const express = require('express');
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));
require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false},
});

client.connect();

client.query('SELECT * FROM usertable', (err, res) => {
  if (err) throw err;
  else console.log(res.rows);
  client.end();
});

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}`);
});