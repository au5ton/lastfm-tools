
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const fetch = require('node-fetch');
const Bottleneck = require('bottleneck');
const logger = require('au5ton-logger');
const lastfm = require('./lib/lastfm');

//from: https://github.com/github/fetch/issues/256#issuecomment-259290394
const queryParams = (params) => {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

lastfm.checkAlbum('au5ton', 'Daft Punk', 'Discovery').then((bool) => {
    logger.log(bool);
}).catch(err => console.log);