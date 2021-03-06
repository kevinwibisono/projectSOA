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

function getCuisine(id){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
        'method': 'GET',
        'url': `https://developers.zomato.com/api/v2.1/cuisines?apikey=f5f3e074609c32c34acee3f23da47fe0&city_id=${id}`
        };
        request(options, function (error, response) { 
            if (error) reject(error);
            resolve(JSON.parse(response.body));
        });
    });
}

router.get('/getAllCuisineinCity', async function(req, res) {
    if(req.query.apiKey == null) res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
    else{
      let cek = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
      if(cek.length > 0){
        if(cek[0].apihit > 0){
            let api_hit = cek[0].apihit - 1;
            let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
            let hasil = await getCuisine(req.body.city_id);
            res.status(200).send(hasil);
        }
        else{
            res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
        }
      }
      res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
    }
});

router.post("/likeCollection", async function(req, res) {
    if(req.query.apiKey == null) res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
    else{
        let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(result.length > 0){
            let id = req.body.id_collection;
            let username = result[0].username;
            let api_hit = result[0].apihit;
            let cari = await executeQuery(`SELECT * FROM collection WHERE id = '${id}'`);
            if(api_hit > 0){
                if(cari.length > 0){
                    let hasil = await executeQuery(`SELECT * FROM favorite WHERE collection_id = '${id}' and username = '${username}'`);
                    if(hasil.length > 0){
                        res.status(200).json({"status" : 200, "message" :"User telah memfavorite kan collection!"});
                    }
                    else{
                        let tambah = await executeQuery(`INSERT INTO favorite (collection_id, username) VALUES ('${id}','${username}')`);
                        api_hit = api_hit - 1;
                        let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
                        res.status(200).json({"status" : 200, "message" :"Berhasil like collection!"});
                    }
                }
                else{
                    res.status(404).json({"status" : 404, "message" :"Collection tidak ada"});
                }
            } res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
            
        }else{
            res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
        }
    }
});

router.delete('/deleteCollection', async function(req, res) {
    if(req.query.apikey) {
        apikey = req.query.apikey;
    }
    if(req.query.apikey == undefined){
        //res.status(401).send("APIKey not found. You are not authorized");
        res.status(400).json({"status" : 400, "message":"APIKey not found. You are not authorized"});
    }else{
        var id = req.body.id;

        let result = await executeQuery(`SELECT * FROM usertable where apikey = '${apikey}'`);
        if(result.length > 0) {
            if(result[0].tipe == 2){
                var usertab = result[0].username;
                let result1 = await executeQuery(`SELECT * FROM collection where id = '${id}'`);
                if(result1.length > 0){
                    var query = `DELETE FROM collection WHERE id = '${id}'`
                    let res = await executeQuery(query);
                    //res.status(200).json("Berhasil menghapus Collection!");
                    res.status(200).json({"status" : 200, "message":"Berhasil menghapus Collection!"});

                    let hasil = await executeQuery(`SELECT * FROM favorite WHERE collection_id = '${id}''`);
                    if(hasil.length > 0){
                        let tambah = await executeQuery(`DELETE FROM favorite WHERE collection_id = '${id}'`);
                    }
                }else{
                    //res.status(400).json("Tidak dapat menemukan Collection!");
                    res.status(400).json({"status" : 400, "message":"Tidak dapat menemukan Collection!"});
                }
            }else{
                var usertab = result[0].username;
                let result1 = await executeQuery(`SELECT * FROM collection where username = '${usertab}'`);
                if(result1.length > 0){
                    var query = `DELETE FROM collection WHERE id = '${id}'`
                    let res = await executeQuery(query);
                    var query1 = `update usertable set apihit = -1 where username = '${usertab}'`                    
                    let res1 = await executeQuery(query1);
                    
                    let hasil = await executeQuery(`SELECT * FROM favorite WHERE collection_id = '${id}''`);
                    if(hasil.length > 0){
                        let tambah = await executeQuery(`DELETE FROM favorite WHERE collection_id = '${id}'`);
                    }
                    //res.status(200).json("Berhasil menghapus Collection!");
                    res.status(200).json({"status" : 200, "message":"Berhasil menghapus Collection!"});
                }else{
                    //res.status(400).json("Tidak dapat menemukan Collection!");
                    res.status(400).json({"status" : 400, "message":"Tidak dapat menemukan Collection!"});
                }
            }            
        }else{            
            //res.status(400).json("Tidak dapat menemukan USER!");
            res.status(400).json({"status" : 400, "message":"Tidak dapat menemukan USER!"});
        }
    }
});

router.post("/unlikeCollection", async function(req, res) {
    if(req.query.apiKey == null) res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
    else{
        let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(result.length > 0){
            let id = req.body.id_collection;
            let username = result[0].username;
            let api_hit = result[0].apihit;
            if(api_hit > 0){
                let hasil = await executeQuery(`SELECT * FROM favorite WHERE collection_id = '${id}' and username = '${username}'`);
                if(hasil.length > 0){
                    let tambah = await executeQuery(`DELETE FROM favorite WHERE collection_id = '${id}' and username = '${username}'`);
                    api_hit = api_hit - 1;
                    let kurang = await executeQuery(`UPDATE usertable SET apihit = ${api_hit} WHERE apiKey = '${req.query.apiKey}'`);
                    res.status(200).json({"status" : 200, "message" :"Berhasil unlike collection!"});
                }
                else{
                    res.status(400).json({"status" : 400, "message" :"User tidak memfavorite kan collection!"});
                }
            }
            else res.status(401).json({"status" : 401, "message" :"API hit tidak cukup"});
            
        }else{
            res.status(404).json({"status" : 404, "message" :"API key tidak ditemukan"});
        }
    }
});

router.post("/addCollection", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        const apihit = result[0].apihit;
        const username = result[0].username;
        const nama = result[0].nama;
        if(result[0].tipe == 1){
            if(apihit <= 0){
                res.status(400).send("Apihit tidak mencukupi untuk melakukan request");
            }
            else{
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
                            let currapi = apihit -1;
                            await executeQuery(`INSERT INTO collection(username, collection_name, collection_desc, city_id, resto_ids) VALUES('${username}', '${req.body.collectionName}', '${req.body.collectionDescription}', ${req.body.cityId}, '${req.body.restoIds}')`);
                            await executeQuery(`UPDATE usertable SET apihit = apihit - 1 WHERE username = '${username}'`);
                            res.status(200).send(`Pembuatan collection ${req.body.collectionName} oleh user ${nama} berhasil dilakukan, jumlah api sekarang ${currapi}`);
                        }
                        else{
                            res.status(404).send("Resto id yang diinputkan invalid, tidak ditemukan atau bukan merupakan resto di kota tersebut");
                        }
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
        const apihit = result[0].apihit;
        const username = result[0].username;
        if(req.query.collectionId){
            let idresult = await executeQuery(`SELECT * FROM collection where id = ${req.query.collectionId}`);
            if(idresult.length > 0){
                let userresult = await executeQuery(`SELECT * FROM collection where id = ${req.query.collectionId} and username = '${username}'`);
                if(userresult.length > 0){
                    if(apihit <= 0){
                        res.status(400).send("Apihit tidak mencukupi untuk melakukan request");
                    }
                    else{
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
                                    let currapi = apihit -1;
                                    await executeQuery(`UPDATE collection set collection_name = '${req.body.collectionName}' , collection_desc = '${req.body.collectionDescription}', city_id = ${req.body.cityId}, resto_ids = '${req.body.restoIds}' where id = ${req.query.collectionId}`);
                                    await executeQuery(`UPDATE usertable SET apihit = apihit - 1 WHERE username = '${username}'`);
                                    res.status(200).send(`Collection ${collectionName} berhasil diubah menjadi ${req.body.collectionName}, jumlah api sekarang ${currapi}`);
                                }
                                else{
                                    res.status(404).send("Resto id yang diinputkan invalid, tidak ditemukan atau bukan merupakan resto di kota tersebut");
                                }
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
            if(cekKey[0].apihit > 0){
                var city_id = (req.query.location == null) ? '' : req.query.location;
                var name = (req.query.collectorname == null) ? '' : req.query.collectorname;
                var keyword = (req.query.keyword == null) ? '' : req.query.keyword;
                var query = `select * from collection where city_id::text like '${city_id}%' and username like '%${name}%' and (LOWER(collection_name) like LOWER('%${keyword}%') OR LOWER(collection_desc) like LOWER('%${keyword}%'))`;
                let hasil = await executeQuery(query);
                if(hasil.length > 0){
                    var apdet = `update usertable set apiHit = apiHit - 1 where apiKey = '${req.query.apiKey}'`;
                    await executeQuery(apdet);
                    res.status(200).send({"hasil" : hasil});
                    
                } 
                else res.status(200).send({"hasil":"Tidak ada hasil yang sesuai dengan permintaan"});
            }
            else{
                res.status(401).send("API Hit tidak mencukupi");
            }
        }
        else res.status(404).send("API key tidak ditemukan");
    }
});

router.get("/favoriteCollection", async function(req, res){
    if(req.query.apiKey == null) res.status(400).send("API key harus disediakan");
    else{
        let cekKey = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(cekKey.length > 0){
            if(cekKey[0].apihit > 0){
                if(req.query.username == null) res.status(400).send("username harus disediakan");
                else {
                    let teasAkhir = await executeQuery(`SELECT * FROM usertable where username = '${req.query.username}'`);
                    if(teasAkhir.length > 0){
                        var apdet = `update usertable set apiHit = apiHit - 1 where apiKey = '${req.query.apiKey}'`;
                        await executeQuery(apdet);
                        let hasil = await executeQuery(`select * from collection where id in (select collection_id from favorite where username = '${req.query.username}')`);
                        res.status(200).send({"hasil" : hasil, "Dari daftar favorit" : req.query.username});
                    }
                    else res.status(404).send("Username tidak ditemukan");
                }
            }
            else res.status(401).send("API Hit tidak mencukupi");
        }
        else res.status(400).send("API key tidak ditemukan");
    }
});
module.exports = router;