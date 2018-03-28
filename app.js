// app.js

//modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const logger = require('au5ton-logger');
const lastfm = require('./lib/lastfm');


//JSON data
const VERSION = require('./package.json').version;
const LYRICS = require('./lyrics.json');

app.get('/', (req, res) => res.json(LYRICS[Math.floor(Math.random()*LYRICS.length)]));
app.get('/version', (req, res) => res.json({
    app: VERSION,
    node: process.version
}));
app.get('/help', (req, res) => res.json({
    endpoints: [
        '/allartists/:username',
        '/allalbums/:username'
    ]
}));
app.get('/file', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//get all artists in their library
app.get('/allartists/:username', (req, res) => {
    lastfm.getAllUserArtists(req.params.username)
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        res.status(500).send('500: we had a problem');
        logger.error(err);
    })
});

//get all albums in their library
app.get('/allalbums/:username', (req, res) => {
    lastfm.getAllUserTopAlbums(req.params.username)
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        res.status(500).send('500: we had a problem');
        logger.error(err);
    })
});

io.on('connection', (socket) => {
    logger.log(socket);
});

http.listen(process.env.PORT || 3000, () => console.log('Example app listening on port '+(process.env.PORT || 3000)+'!'));