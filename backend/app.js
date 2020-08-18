const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const postRoutes = require('./routes/postsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const path = require('path');

mongoose.connect('mongodb+srv://admin:userAdmin@cluster0.1szjd.mongodb.net/Posts?retryWrites=true&w=majority')
    .then(() => {
        console.log('------------------------------------');
        console.log('Connected to DB');
        console.log('------------------------------------');
    })
    .catch(() => {
        console.log('------------------------------------');
        console.log('Error in the connection to the DB');
        console.log('------------------------------------');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH,PUT, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization,Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    
    next();
});
app.use((req,res,next)=>{
    console.log(req); 
    next();
})
app.use('/api/posts/', postRoutes);
app.use('/api/users/', usersRoutes);

module.exports = app; 