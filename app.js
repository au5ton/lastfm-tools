// app.js

//modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const logger = require('au5ton-logger');
const lastfm = require('./lib/lastfm');
const util = require('./lib/util');

//JSON data
const VERSION = require('./package.json').version;
const LYRICS = require('./lyrics.json');

var Session = [];

app.use(express.static('public'));

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
app.get('/lyrics', (req, res) => res.json(LYRICS[Math.floor(Math.random()*LYRICS.length)]));

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

/*

Socket.io Protocol
==================

=> server to client
<= client to server

emission_name <=> description


assign_session => provide the client with a unique session that the client includes with further requests
    - created and destroyed on connection/disconnect

request <= sends a formal request that is added to `Session` and picked up by the request crawler

*/

const emitTo = (sid, eventName, eventData) => {
    io.clients().sockets[sid].emit(eventName, eventData);
};

io.on('connection', (socket) => {
    logger.warn(socket.id);
    let client_list = Object.keys(io.clients().sockets);
    for(let i = 0; i < client_list.length; i++) {
        emitTo(client_list[i],'alert','test');
    }
    let sess = util.generateSession();
    Session.push({id: sess, requests: []});
    socket.emit('assign_session',sess);
    //logger.log('hello ',sess);
    socket.on('disconnect', function(){
        //logger.log('goodbye ',sess);
        for(let i = 0; i < Session.length; i++) {
            if(sess == Session[i].id) {
                Session.splice(i,1);
            }
        }
    });
});

http.listen(process.env.PORT || 3000, () => console.log('Example app listening on port '+(process.env.PORT || 3000)+'!'));