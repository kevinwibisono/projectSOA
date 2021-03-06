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
      let apihit = result[0].apihit;
      if(apihit <= 0){
        res.status(400).send("Apihit tidak mencukupi untuk melakukan request");
      }
      else{
        let nama = result[0].nama;
        let username = result[0].username;
        if(req.body.restoid == "" || req.body.review == ""){
          res.status(400).send("Field resto id dan review harus diisi");
        }
        else{
          let restoname = await getRestoName(req.body.restoId);
          if(restoname == undefined){
            res.status(404).send(`Tidak ditemukan resto dengan id ${req.body.restoId}`);
          }
          else{
            let currapi = apihit -1;
            if(req.body.reviewId == undefined){
              await executeQuery(`INSERT INTO review(username, resto_id, review) VALUES('${username}', ${req.body.restoId}, '${req.body.review}')`);
              await executeQuery(`UPDATE usertable SET apihit = apihit - 1 WHERE username = '${username}'`);
              res.status(200).send(`Review oleh ${nama} terhadap resto ${restoname} berhasil ditambahkan, jumlah api sekarang ${currapi}`);
            }
            else{
              await executeQuery(`INSERT INTO review VALUES(${req.body.reviewId}, '${username}', ${req.body.restoId}, '${req.body.review}')`);
              await executeQuery(`UPDATE usertable SET apihit = apihit - 1 WHERE username = '${username}'`);
              res.status(200).send(`Review oleh ${nama} terhadap resto ${restoname} berhasil ditambahkan, jumlah api sekarang ${currapi}`);
            }
          }
        }
      }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }
});

router.get('/getReview', async function(req, res) {
  if(req.query.apiKey == null) res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
  else{
    let cek = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(cek.length > 0){
      if(cek[0].apihit > 0){
        let hasil = await executeQuery(`SELECT * from review`);
        res.status(200).send(hasil);
        let api_hit = cek[0].apihit - 1;
        let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
      }else{
        res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
      }
    }
    else res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
  }
});

router.delete("/deleteReview", async function(req, res){
  if(req.query.apiKey == null) res.status(400).send("Field API Key harus terisi");
  else{
    let cek = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(cek.length > 0){
      if(req.query.reviewId == null) res.status(400).send("ReviewId harus terisi");
      else{
        var tesRev = `select * from review where id = '${req.query.reviewId}'`;
        let cekRev = await executeQuery(tesRev);
        if(cekRev > 0){
          await executeQuery(`delete from review where id = '${req.query.reviewId}'`);
          res.status(200).send(`Review dengan id -> ${req.query.reviewId} telah terhapus`);
        }
        else res.status(404).send("Review tidak ditemukan");
      }
    }
    else res.status(404).send("API key tidak ditemukan");
  }
});

process.on("exit", function(){
    client.end();
});

module.exports = router;