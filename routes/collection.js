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
            resolve(JSON.parse(response.body));
        });
    });
}

function getCityName(id){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
        'method': 'GET',
        'url': `https://developers.zomato.com/api/v2.1/cities?apikey=f5f3e074609c32c34acee3f23da47fe0&city_ids=${id}`
        };
        request(options, function (error, response) { 
            if (error) reject(error);
            if(JSON.parse(response.body).location_suggestions[0]){
                resolve(JSON.parse(response.body).location_suggestions[0].name);
            }
            else{
                resolve(undefined);
            }
        });
    });
}

router.post("/addCollection", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        const username = result[0].username;
        const nama = result[0].nama;
        if(result[0].tipe == 1){
            if(req.body.collectionName == "" || req.body.collectionDescription == ""|| req.body.restoIds == "" || req.body.cityId == ""){
                res.status(400).send("Seluruh field harus diisi");
            }
            else{
                let cityname = await getCityName(req.body.cityId);
                if(cityname == undefined){
                    res.status(404).send("Tidak ditemukan resto dengan id tersebut, silahkan kunjungi endpoint /searchResto untuk mengetahui list restoran");
                }
                else{
                    let listresto = req.body.restoIds.toString().split(",");
                    let allRestoValid = true;
                    for (let index = 0; index < listresto.length; index++) {
                        const resto = await getResto(listresto[index]);
                        if(resto.name == undefined){
                            allRestoValid = false;
                        }
                        else{
                            if(resto.location.city_id != req.body.cityId){
                                allRestoValid = false;
                            }
                        }                    
                    }
                    if(allRestoValid){
                        //semua resto ada di dlm zomato api
                        await executeQuery(`INSERT INTO collection(username, collection_name, collection_desc, city_id) VALUES('${username}', '${req.body.collectionName}', '${req.body.collectionDescription}', ${req.body.cityId})`);
                        res.status(200).send(`Pembuatan collection ${req.body.collectionName} oleh user ${nama} berhasil dilakukan`);
                    }
                    else{
                        res.status(404).send("Resto id yang diinputkan invalid, tidak ditemukan atau bukan merupakan resto di kota tersebut");
                    }
                }
            }
        }
        else{
            res.status(400).send("Akun anda bukan merupakan akun premium, anda tidak diijinkan mengakses halaman ini")
        }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }
});


module.exports = router;