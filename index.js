const express = require('express');
const app = express();
const user = require('./routes/user');
const review = require('./routes/review');
const collection = require('./routes/collection');
const resto = require('./routes/resto');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));
app.use('/api/user', user);
app.use('/api/review', review);
app.use('/api/collec', collection);
app.use('/api/resto', resto);

require('dotenv').config();

app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}...`);
});

/*
app.listen(4000, function(){
    console.log(`listening port 4000`);
});
*/