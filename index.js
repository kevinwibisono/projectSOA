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

<<<<<<< HEAD
app.listen(3000, function(){
    console.log(`listening port 3000...`);
=======
app.listen(process.env.PORT, function(){
    console.log(`listening port ${process.env.PORT}...`);
>>>>>>> 42f7c123fa6246923e3565ffa45be1f8fe4f7ff4
});