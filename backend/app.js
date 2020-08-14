const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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
    const post = req.body;
    console.log(post);
    res.status(201).json({
        status:'success'
    })
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: 'fagh34ghdfs', title: 'server post', content: 'this is a content' },
        { id: 'fy6654gh', title: 'second server post', content: 'this is a content' },
    ];
    return res.status(200).json({
        status: 'success',
        posts
    });
});

module.exports = app;