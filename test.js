
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const fetch = require('node-fetch');
const Bottleneck = require('bottleneck');
const logger = require('au5ton-logger');

//from: https://github.com/github/fetch/issues/256#issuecomment-259290394
const queryParams = (params) => {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

fetch(BASE_URL+'?'+queryParams({
    method: 'user.getrecenttracks',
    artist: 'deadmau5',
    api_key: process.env.LASTFM_API_KEY,
    user: 'au5ton',
    format: 'json',
    limit: 50,
    page: 1
})).then(res => {
    return res.json();
}).catch(err => {
    console.warn(err)
}).then(data => {
    logger.log(data);
});