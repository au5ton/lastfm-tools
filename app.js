// app.js

//modules
const express = require('express');
const app = express();
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

//check if user has listened to album
app.get('/checkalbumlistened/:username/:artist/:album', (req, res) => {
    lastfm.checkAlbumListened(req.params.username, req.params.artist, req.params.album).then((results) => {
        res.json(results);
    }).catch(err => {
        res.status(500).send('500: we had a problem');
        logger.error(err);
    })
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port '+(process.env.PORT || 3000)+'!'));