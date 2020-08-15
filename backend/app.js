const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Post = require('./models/post');
const mongoose = require('mongoose');

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
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
                'Origin, X-Requested-With, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
}); 

app.post('/api/posts', (req,res,next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({
        status:'success'
    })
});

app.get('/api/posts', async (req, res, next) => {
    const posts = await Post.find();
    return res.status(200).json({
        status: 'success',
        posts
    });
});

app.delete('/api/posts/:id', async (req,res,next)=>{
    await Post.deleteOne({_id:req.params.id});
    res.status(200).json({message:'deleted'});
});

module.exports = app;