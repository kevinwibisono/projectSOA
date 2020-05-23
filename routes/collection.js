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
                    res.status(404).send("Tidak ditemukan kota dengan id tersebut, silahkan kunjungi endpoint /getLocations untuk mengetahui list kota");
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
                        await executeQuery(`INSERT INTO collection(username, collection_name, collection_desc, city_id, resto_ids) VALUES('${username}', '${req.body.collectionName}', '${req.body.collectionDescription}', ${req.body.cityId}, '${req.body.restoIds}')`);
                        res.status(200).send(`Pembuatan collection ${req.body.collectionName} oleh user ${nama} berhasil dilakukan`);
                    }
                    else{
                        res.status(404).send("Resto id yang diinputkan invalid, tidak ditemukan atau bukan merupakan resto di kota tersebut");
                    }
                }
            }
        }
        else{
            res.status(401).send("Akun anda bukan merupakan akun premium, anda tidak diijinkan mengakses halaman ini")
        }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }
});

router.put("/updateCollection", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        const username = result[0].username;
        if(req.query.collectionId){
            let idresult = await executeQuery(`SELECT * FROM collection where id = ${req.query.collectionId}`);
            if(idresult.length > 0){
                let userresult = await executeQuery(`SELECT * FROM collection where id = ${req.query.collectionId} and username = '${username}'`);
                if(userresult.length > 0){
                    var collectionName = userresult[0].collection_name;
                    if(req.body.collectionName == "" || req.body.collectionDescription == ""|| req.body.restoIds == "" || req.body.cityId == ""){
                        res.status(400).send("Seluruh field harus diisi");
                    }
                    else{
                        let cityname = await getCityName(req.body.cityId);
                        if(cityname == undefined){
                            res.status(404).send("Tidak ditemukan kota dengan id tersebut, silahkan kunjungi endpoint /getLocations untuk mengetahui list kota");
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
                                await executeQuery(`UPDATE collection set collection_name = '${req.body.collectionName}' , collection_desc = '${req.body.collectionDescription}', city_id = ${req.body.cityId}, resto_ids = '${req.body.restoIds}' where id = ${req.query.collectionId}`);
                                res.status(200).send(`Collection ${collectionName} berhasil diubah menjadi ${req.body.collectionName}`);
                            }
                            else{
                                res.status(404).send("Resto id yang diinputkan invalid, tidak ditemukan atau bukan merupakan resto di kota tersebut");
                            }
                        }
                    }
                }
                else{
                    res.status(401).send(`Collection hanya boleh diedit oleh pemilik collection`);
                }
            }
            else{
                res.status(404).send(`Tidak ditemukan collection dengan id ${req.query.collectionId}`);
            }
        }
        else{
            res.status(401).send("Pada halaman ini harus disertakan id dari collection yang ingin di-edit");
        }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }
});

router.get("/getCollection", async function(req, res){
    if(req.query.apiKey == null) res.status(400).send("API key harus ada");
    else{
        let cekKey = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(cekKey.length > 0){
            var city_id = (req.query.location == null) ? '' : req.query.location;
            var name = (req.query.collectorname == null) ? '' : req.query.collectorname;
            var keyword = (req.query.keyword == null) ? '' : req.query.keyword;
            var query = `select * from collection where city_id::text like '${city_id}%' and username like '%${name}%' and (LOWER(collection_name) like LOWER('%${keyword}%') OR LOWER(collection_desc) like LOWER('%${keyword}%'))`;
            let hasil = await executeQuery(query);
            if(hasil.length > 0) res.status(200).send(hasil);
            else res.status(200).send("Tidak hasil yang sesuai dengan permintaan");
        }
        else res.status(404).send("API key tidak ditemukan");
    }
});

router.get("/favoriteCollection", async function(req, res){
    if(req.query.apiKey == null) res.status(400).send("API key harus disediakan");
    else{
        let cekKey = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(cekKey.length > 0){
            if(req.query.username == null) res.status(400).send("username harus disediakan");
            else {
                let hasil = await executeQuery(`select * from collection where id in (select collection_id from favorite where username = '${req.query.username}')`);
                res.status(200).send(hasil);
            }
        }
        else res.status(404).send("API key tidak ditemukan");
    }
});
module.exports = router;