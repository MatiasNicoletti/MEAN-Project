const express = require('express');


const app = express();

app.use('/api/posts', (req, res, next) => {
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