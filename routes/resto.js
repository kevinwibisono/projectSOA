const express = require("express");
const router = express.Router();
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

function getResto(id){
  return new Promise(function(resolve, reject){
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': `https://developers.zomato.com/api/v2.1/restaurant?apikey=f5f3e074609c32c34acee3f23da47fe0&res_id=${id}`
    };
    request(options, function (error, response) { 
      if (error) reject(error);
      else resolve(response.body);
    });
  });
}


router.get('/getResto', async function(req, res) {
    if(req.query.apiKey == null) res.status(400).send("Field API Key harus terisi");
    else{
      let cek = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
      if(cek.length > 0){
        if(cek[0].apihit > 0) {
          let hasil = await getResto(req.body.resto_id);
          let api_hit = cek[0].apihit - 1;
          let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
          res.status(200).send(hasil);
        }
        else res.status(401).send("API Hit tidak cukup!");
      }
      else res.status(404).send("API key tidak ditemukan");
    }
  });

module.exports = router;