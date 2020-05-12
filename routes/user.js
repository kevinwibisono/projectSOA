const express = require("express");
const router = express.Router();

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
    if(req.query.apiKey == undefined){
        res.status(401).send("APIKey not found. You are not authorized");
    }
    else{
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
                    res.status(404).send("No user found");
                }
            }
            else{
                res.status(401).send("Only admin has access to this page");
            }
        }
        else{
            res.status(401).send("APIKey not registered in any user. You are not authorized");
        }
    }
    
});

process.on("exit", function(){
    client.end();
});

module.exports = router;