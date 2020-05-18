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

router.delete('/deleteUser', async function(req, res) {
    let cari = await executeQuery(`SELECT * FROM usertable WHERE apikey = '${req.query.apiKey}'`);
    if(cari.length > 0){
        if(cari[0].tipe == 0){
            let hapus = await executeQuery(`DELETE FROM usertable WHERE username = '${req.body.username}'`);
            res.send(hapus);
        }
        else{
            let carilagi = await executeQuery(`SELECT * FROM usertable WHERE apikey = '${req.query.apiKey}' and username = '${req.body.username}'`);
            if(carilagi.length > 0){
                let hapus = await executeQuery(`DELETE FROM usertable WHERE username = '${req.body.username}'`);
                res.send(hapus);
            }
            else res.status(401).send("User tidak memiliki hak akses untuk menghapus user lain!");
        }
    }else res.status(404).send("User tidak ditemukan!");
});

router.put("/getPremium", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
        if(result.length > 0){
            let result = await executeQuery(`SELECT * FROM usertable where username = '${req.query.username}' and apiKey = '${req.query.apiKey}'`);
            if(result.length > 0){
                if(result[0].tipe == 0){
                    //free user
                    var nama = result[0].nama;
                    var saldo = result[0].saldo;
                    if(result[0].saldo >= 100000){
                        saldo = saldo - 100000;
                        let result = await executeQuery(`UPDATE usertable SET tipe = 1, apihit = 10000, saldo = saldo-100000 where username='${req.query.username}' and apiKey = '${req.query.apiKey}'`);
                        res.status(200).send(`Akun user ${nama} telah diupgrade menjadi premium dan penggunaan api telah ditambahkan. Saldo anda sekarang ${saldo}`);
                    }
                    else{
                        res.status(400).send("Saldo anda tidak mencukupi, silahkan akses halaman /api/user/topup untuk pengisian");
                    }
                }
                else{
                    res.status(400).send("Akun bukan merupakan akun free, mengakses halaman ini tidak akan memberikan efek pada akun anda");
                }
            }
            else{
                res.status(400).send("Username tidak sesuai");
            }
        }
        else{
            res.status(401).send("Anda tidak diijinkan mengakses halaman ini. API key tidak diberikan atau invalid");
        }
});

router.put("/topupSaldo", async function(req, res){
    let result = await executeQuery(`SELECT * FROM usertable where apiKey = '${req.query.apiKey}'`);
    if(result.length > 0){
        let result = await executeQuery(`SELECT * FROM usertable where username = '${req.query.username}' and apiKey = '${req.query.apiKey}'`);
        if(result.length > 0){
            var nama = result[0].nama;
            if(req.body.nominal && req.body.nominal > 0){
                var nominal = req.body.nominal;
                var saldobaru = parseInt(result[0].saldo)+parseInt(nominal);
                await executeQuery(`UPDATE usertable SET saldo = saldo+${nominal} WHERE username = '${req.query.username}' and apiKey = '${req.query.apiKey}'`);
                res.status(200).send(`Saldo user ${nama} telah sukses ditambahkan! Saldo sekarang ${saldobaru}`);
            }
            else{
                res.status(400).send("Nominal pengisian saldo tidak boleh kosong");
            }
        }
        else{
            res.status(400).send("Username tidak sesuai");
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
                    res.status(200).send(`User dengan username ${req.body.username} berhasil daftar`);
                }
                else res.status(403).send("Username telah digunakan");
            }
        }
    }
});

process.on("exit", function(){
    client.end();
});

module.exports = router;