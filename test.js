
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

// fetch(BASE_URL+'?'+queryParams({
//     method: 'album.getInfo',
//     api_key: process.env.LASTFM_API_KEY,
//     user: 'au5ton',
//     artist: 'Daft Punk',
//     album: 'Discovery',
//     format: 'json'
// })).then(res => {
//     return res.json();
// }).catch(err => {
//     console.warn(err)
// }).then(data => {
//     logger.log(data['album']['userplaycount'] !== undefined);
// });

lastfm.checkAlbum('FluffThePanda', 'Daft Punk', 'Discovery').then((bool) => {
    logger.log(bool);
}).catch(err => console.log);