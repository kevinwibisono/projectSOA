const express = require("express");
const router = express.Router();
require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  //connectionString : "postgres://lfpnnieeczkxuy:1f05bb5f73a4030094852c9a3b7f7b793ad51e88eda77a648598bfc58e4de0a0@ec2-54-81-37-115.compute-1.amazonaws.com:5432/de1fta97koh1rk",
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

function getRestoFree(q){
  var query;
  if(q != ""){
    query = q;
  }
  else{
    query = "cafe";
  }
  if(req.body.city_id != undefined || req.body.cuisine != undefined){
    res.status(400).json({"status":400, "message" : "Free user tidak bisa mengakses fitur ini!"});
  }
  return new Promise(function(resolve, reject){
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': `https://developers.zomato.com/api/v2.1/search?apikey=f5f3e074609c32c34acee3f23da47fe0&q=${query}`
    };
    request(options, function (error, response) { 
      if (error) reject(error);
      else resolve(response.body);
    });
  });
}

function getRestoPremium(id,q,cuisine){
  return new Promise(function(resolve, reject){
    var url = "";
    var request = require('request');
    if(id != "")
      url = `entity_id=${id}&entity_type=city`;
    if(q != ""){
      if(url != "") url = url + `&q=${q}`;
      else url = `q=${q}`;
    }
    if(cuisine != ""){
      if(url != "") url = url + `&cuisines=${cuisine}`;
      else url = `cuisines=${cuisine}`;
    }
    else{
      url = `cuisines=25`
    }
    var options = {
      'method': 'GET',
      'url': `https://developers.zomato.com/api/v2.1/search?${url}&apikey=f5f3e074609c32c34acee3f23da47fe0`
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
        if(cek[0].tipe == 0){
          let api_hit = cek[0].apihit - 1;
          let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
          let hasil = await getRestoFree(req.body.query);
          res.status(200).send(hasil);
        }
        if(cek[0].tipe == 1){
          let api_hit = cek[0].apihit - 1;
          let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
          let hasil = await getRestoPremium(req.body.city_id, req.body.query, req.body.cuisine);
          res.status(200).send(hasil);
        }
      }
      else res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
    }
    else res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
  }
});

module.exports = router;