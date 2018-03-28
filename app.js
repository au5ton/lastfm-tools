// app.js

//modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const EventEmitter = require('events');
const logger = require('au5ton-logger');
const lastfm = require('./lib/lastfm');
const util = require('./lib/util');

//JSON data
const VERSION = require('./package.json').version;
const LYRICS = require('./lyrics.json');

var Queue = [];

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

info_query <= sends a formal request that is added to `Session` and picked up by the request crawler
    {
        type: 'allalbums',
        data: <arbitrary data>
    }

info_query_status => update client on if you're working on their request or not

*/

const emitTo = (sid, eventName, eventData) => {
    io.clients().sockets[sid].emit(eventName, eventData);
};

class Bell extends EventEmitter {}
const bell = new Bell();

class QueueItem {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}

const valid_queries = [
    'checkalbum'
];

io.on('connection', (socket) => {
    Queue.push({id: socket.id, requests: []});
    
    socket.on('info_query', (query) => {
        //received a request for doing things
        if(valid_queries.includes(query.type)) {
            for(let e in Queue) {
                if(Queue[e].id === socket.id) {
                    Queue[e].requests.push(new QueueItem(query.type, query.data));
                    socket.emit('info_query_status', 'good');
                    bell.emit('notification');
                }
            }
        }
        else {
            socket.emit('info_query_status', 'error');
        }
        
    });
    
    socket.on('disconnect', function(socket){
        for(let i = 0; i < Queue.length; i++) {
            if(socket.id == Queue[i].id) {
                Queue.splice(i,1);
            }
        }
    });
});

bell.on('notification', async () => {
    logger.log(Queue);
    for(let sock in Queue) {
        for(let i in Queue[sock].requests) {
            let item = Queue[sock].requests[i];

            if(item.type === )

        }
    }
});


http.listen(process.env.PORT || 3000, () => console.log('Example app listening on port '+(process.env.PORT || 3000)+'!'));