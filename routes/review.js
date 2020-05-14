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

function getRestoName(id){
  return new Promise(function(resolve, reject){
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': `https://developers.zomato.com/api/v2.1/restaurant?apikey=f5f3e074609c32c34acee3f23da47fe0&res_id=${id}`
    };
    request(options, function (error, response) { 
      if (error) reject(error);
      resolve(JSON.parse(response.body).name);
    });
  });
}

router.post("/addReview", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        let nama = result[0].nama;
        let username = result[0].username;
        if(req.body.restoid == "" || req.body.review == ""){
          res.status(400).send("Field resto id dan review harus diisi");
        }
        else{
          await executeQuery(`INSERT INTO review(username, resto_id, review) VALUES('${username}', ${req.body.restoid}, '${req.body.review}')`);
          let restoname = await getRestoName(req.body.restoid);
          if(restoname == undefined){
            res.status(400).send(`Tidak ditemukan resto dengan id ${req.body.restoid}`);
          }
          else{
            res.status(200).send(`Review ${nama} terhadap resto ${restoname} berhasil ditambahkan`);
          }
        }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }
});

process.on("exit", function(){
    client.end();
});

module.exports = router;