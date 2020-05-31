const express = require("express");
const router = express.Router();
const randomstring = require("randomstring");
const multer = require("multer");
const path=require('path');
const fs = require('fs');
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

router.get("/getUser", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        if(result[0].tipe == 2){
            let query = "";
            if(req.query.username == undefined){
                query = "SELECT * FROM usertable";
            }
            else{
                query = `SELECT * FROM usertable where username = '${req.query.username}'`;
            }
            let result = await executeQuery(query);
            if(result.length > 0){
                res.status(200).send(result);
            }
            else{
                res.status(404).send("Data user tidak ditemukan");
            }
        }
        else{
            res.status(401).send("Akun anda bukan merupakan akun administrator, anda tidak diijinkan mengakses halaman ini");
        }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }    
});

router.put("/updateProfile", async function(req, res){
    if(req.query.apiKey == null) res.status(400).send("API key harus ada");
    else{
        if(req.query.username == null) res.status(400).send("username harus ada");
        else{
            var query = `select * from usertable where apiKey = '${req.query.apiKey}' and username = '${req.query.username}'`;
            let profile = await executeQuery(query);
            if(profile.length > 0){
                var nama = (req.body.nama == null) ? profile[0].nama : req.body.nama;
                var password = (req.body.password == null) ? profile[0].password : req.body.password;
                var foto = req.query.username + ".jpg";
                upload(req,res,(err)=>{
                    if(err){
                        console.log(err);
                        res.send(err);
                    }else{
                        if(req.file == undefined){
                            console.log("Tidak ada file");
                            foto = 'default.jpg';
                        } 
                        else{
                            console.log(req.file);
                            logic = true;
                            fs.rename(`./uploads/${req.file.filename}`, `./uploads/${foto}`, function(err) {
                                if ( err ) console.log('ERROR: ' + err);
                            }); 
                        }
                    }
                });
                var query = `update usertable set nama = '${nama}', password = '${password}', picture = '${foto}' where apiKey = '${req.query.apiKey}' and username = '${req.query.username}'`;
                await executeQuery(query);
                res.status(200).send(`Update ${req.query.username} berhasil`);
            }
            else res.status(404).send("User tidak ditemukan");
        }
    }
});

router.delete('/deleteUser', async function(req, res) {
    if(req.query.apiKey == undefined || req.query.apiKey == "") res.status(400).json({"status":400,"message":"Field API Key harus terisi"});
    let cari = await executeQuery(`SELECT * FROM usertable WHERE apikey = '${req.query.apiKey}'`);
    if(cari.length > 0){
        if(cari[0].tipe == 2){
            let hapus = await executeQuery(`DELETE FROM usertable WHERE username = '${req.body.username}'`);
            res.status(200).json({"status" : 200, "message":"Berhasil hapus user!"});
        }
        else{
            let carilagi = await executeQuery(`SELECT * FROM usertable WHERE apikey = '${req.query.apiKey}' and username = '${req.body.username}'`);
            if(carilagi.length > 0){
                let hapus = await executeQuery(`DELETE FROM usertable WHERE username = '${req.body.username}'`);
                res.status(200).json({"status" : 200, "message":"Berhasil hapus user!"});
            }
            else res.status(401).json({"status":401, "message" : "User tidak memiliki hak akses untuk menghapus user lain!"});
        }
    }else res.status(404).json({"status":404, "message":"User tidak ditemukan!"});
});

router.put("/getPremium", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(result.length > 0){
            if(result[0].tipe == 0){
                //free user
                var nama = result[0].nama;
                var saldo = result[0].saldo;
                if(result[0].saldo >= 100000){
                    saldo = saldo - 100000;
                    let result = await executeQuery(`UPDATE usertable SET tipe = 1, apihit = 10000, saldo = saldo-100000 where apiKey = '${req.query.apiKey}'`);
                    res.status(200).send(`Akun user ${nama} telah diupgrade menjadi premium dan penggunaan api telah ditambahkan. Saldo anda sekarang ${saldo}`);
                }
                else{
                    res.status(400).send("Saldo anda belum mencapai harga upgrade akun (Rp 100.000), silahkan akses halaman /api/user/topupSaldo untuk pengisian");
                }
            }
            else{
                res.status(401).send("Akun bukan merupakan akun free, mengakses halaman ini tidak akan memberikan efek pada akun anda");
            }
        }
        else{
            res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
        }
});

router.put("/topupSaldo", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        var nama = result[0].nama;
        if(req.body.nominal && req.body.nominal > 0){
            var nominal = req.body.nominal;
            var saldobaru = parseInt(result[0].saldo)+parseInt(nominal);
            await executeQuery(`UPDATE usertable SET saldo = saldo+${nominal} WHERE apiKey = '${req.query.apiKey}'`);
            res.status(200).send(`Saldo user ${nama} telah sukses ditambahkan! Saldo sekarang ${saldobaru}`);
        }
        else{
            res.status(400).send("Nominal pengisian saldo tidak boleh kosong");
        }
    }
    else{
        res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
    }
});

router.post("/registerUser", async function(req, res){
    if(req.body.nama == null) res.status(400).send("field nama harus terisi");
    else{
        if(req.body.username == null) res.status(400).send("field usernama harus terisi");
        else{
            if(req.body.password == null) res.status(400).send("field password harus terisi");
            else{
                let tes = await executeQuery(`SELECT * FROM usertable where username = '${req.body.username}'`);
                if(tes.length == 0){
                    var query = `insert into usertable(username,password,nama,picture,apiKey,tipe,saldo,apihit) values('${req.body.username}','${req.body.password}','${req.body.nama}','default.jpg','${randomstring.generate(30)}',0,0,100)`;
                    await executeQuery(query);
                    res.status(201).send(`User dengan username ${req.body.username} berhasil daftar`);
                }
                else res.status(403).send("Username telah digunakan");
            }
        }
    }
});

router.delete('/editReview', async function(req, res) {
    if(req.query.apikey) {
        apikey = req.query.apikey;
    }
    if(req.query.apiKey == undefined){
        res.status(401).send("APIKey not found. You are not authorized");
    }else{
        var id = req.body.id;
        var username = req.body.username;
        var password = req.body.password;
        var review = req.body.review;

        let result = await executeQuery(`SELECT * FROM usertable where username = '${username}' and password = '${password}'`);
        if(result.length > 0) {
            if(result[0].tipe == 2){
                if(result[0].apikey != apikey){    
                    res.status(400).json("api key invalid"); 
                }else{
                    var usertab = result[0].username;
                    let result1 = await executeQuery(`SELECT * FROM review where username = '${usertab}'`);
                    if(result1.length > 0){
                        var query = `update review set review = '${review}' where id = '${id}'`
                        let res = await executeQuery(query);
                    }else{
                        res.status(400).json("Tidak dapat menemukan Review / Comment!");
                    }
                }
            }else{
                if(result[0].apikey != apikey){    
                    res.status(400).json("api key invalid"); 
                }else{
                    var usertab = result[0].username;
                    let result1 = await executeQuery(`SELECT * FROM review where username = '${usertab}'`);
                    if(result1.length > 0){
                        var query = `update review set review = '${review}' where id = '${id}'`
                        let res = await executeQuery(query);
                        var query1 = `update usertable set apihit = -1 where username = '${usertab}'`                    
                        let res1 = await executeQuery(query1);
                    }else{
                        res.status(400).json("Tidak dapat menemukan Review / Comment!");
                    }
                }
            }
        }else{
            res.status(400).json("Tidak dapat menemukan USER!");
        }
    }
});

router.post('/loginUser', async function(req, res) {
    let cari = await executeQuery(`SELECT * FROM usertable WHERE username = '${req.body.username}' and password ='${req.body.password}'`);
    if(cari.length > 0){
        res.status(400).send("User tidak ditemukan!");
    }else {
        var apikey = cari[0].apiKey;
        res.status(200).send("Berhasil Login, API anda = " + apikey);
    }   
});

router.post('/buySubscription', async function(req, res) {
    if(req.query.apikey) {
        apikey = req.query.apikey;
    }
    if(req.query.apiKey == undefined){
        res.status(401).send("APIKey not found. You are not authorized");
    }else{
        let result = await executeQuery(`SELECT * FROM usertable where username = '${req.query.username}' and password = '${req.query.password}'`);   
        if(result[0].apikey != apikey) {
            res.status(400).json("api key invalid"); 
        }else if( result.length > 0){    
            if(result[0].tipe == 2){
                res.status(400).send("Anda sebagai Admin");
            }else{
                var saldo_user = result[0].saldo;
                var jumlah     = req.body.jumlahsubscription;
                let query = "";
                if(saldo_user >= 75){
                    var total      = jumlah * 75;
                    var sisa_saldo = saldo_user - total;
                    query = `update usertable set apihit = apihit + '${total}' , saldo  = saldo + '${sisa_saldo}' where username = '${req.query.username}'`                    
                    let res = await executeQuery(query);
                }else{
                    res.status(400).json("Saldo user tidak mencukupi"); 
                }
            }
        }
    }
});

router.post('/deleteCollection', async function(req, res) {
    if(req.query.apikey) {
        apikey = req.query.apikey;
    }
    if(req.query.apiKey == undefined){
        res.status(401).send("APIKey not found. You are not authorized");
    }else{
        var id = req.body.id;
        var username = req.body.username;
        var password = req.body.password;

        let result = await executeQuery(`SELECT * FROM usertable where username = '${username}' and password = '${password}'`);
        if(result.length > 0) {
            if(result[0].tipe == 2){
                if(result[0].apikey != apikey){    
                    res.status(400).json("api key invalid"); 
                }else{
                    var usertab = result[0].username;
                    let result1 = await executeQuery(`SELECT * FROM collection where username = '${usertab}'`);
                    if(result1.length > 0){
                        var query = `DELETE FROM collection WHERE id = '${id}'`
                        let res = await executeQuery(query);
                    }else{
                        res.status(400).json("Tidak dapat menemukan Review / Comment!");
                    }
                }
            }else{
                if(result[0].apikey != apikey){    
                    res.status(400).json("api key invalid"); 
                }else{
                    var usertab = result[0].username;
                    let result1 = await executeQuery(`SELECT * FROM collection where username = '${usertab}'`);
                    if(result1.length > 0){
                        var query = `DELETE FROM collection WHERE id = '${id}'`
                        let res = await executeQuery(query);
                        var query1 = `update usertable set apihit = -1 where username = '${usertab}'`                    
                        let res1 = await executeQuery(query1);
                    }else{
                        res.status(400).json("Tidak dapat menemukan Review / Comment!");
                    }
                }
            }            
        }else{            
            res.status(400).json("Tidak dapat menemukan USER!");
        }
    }
});


process.on("exit", function(){
    client.end();
});

module.exports = router;