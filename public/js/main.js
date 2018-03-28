// main.js
// browser side

var client = io();

class QueueItem {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}

client.emit('info_query', new QueueItem('checkalbum', {
    user: 'au5ton',
    artist: 'Daft Punk',
    album: 'Discovery'
}));

client.on('info_query_status', (status) => {
    console.log(status);
    if(status === 'good') {
        //you did fine
    }
    else {
        //you messed up somewhere
    }
})

client.on('response_ready', (data) => {
    console.log('your thing is done')
});