const express = require("express");
const router = express.Router();
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


function getLocation(query){
  return new Promise(function(resolve, reject){
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': `https://developers.zomato.com/api/v2.1/locations?apikey=f5f3e074609c32c34acee3f23da47fe0&query=${query}`
    };
    request(options, function (error, response) { 
      if (error) reject(error);
      else resolve(response.body);
    });
  });
}

router.get('/getLocation', async function(req,res){
  if(req.query.apiKey == null) res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
  else{
    let cek = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(cek.length > 0){
      if(cek[0].apihit > 0) {
        let api_hit = cek[0].apihit - 1;
        let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
        let hasil = await getLocation(req.body.query);
        res.status(200).send(hasil);
      }
      else res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
    }
    else res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
  }
});


router.get('/getResto', async function(req, res) {
  if(req.query.apiKey == null) res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
  else{
    let cek = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(cek.length > 0){
      if(cek[0].apihit > 0) {
        let api_hit = cek[0].apihit - 1;
        let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
        let hasil = await getResto(req.body.resto_id);
        res.status(200).send(hasil);
      }
      else res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
    }
    else res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
  }
});

module.exports = router;