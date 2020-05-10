const express = require('express');
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));
require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}`);
});