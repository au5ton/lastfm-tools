// lastfm.js

//modules
const fetch = require('node-fetch');
const logger = require('au5ton-logger');
const Bottleneck = require('bottleneck');

//constants
const _ = {};
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
//from: https://github.com/github/fetch/issues/256#issuecomment-259290394
const queryParams = (params) => {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
};
//To comply with: https://www.last.fm/api/tos
/*
"You will not make more than 5 requests per originating 
IP address per second, averaged over a 5 minute period, 
without prior written consent."

5 req per sec = 1 req every 200ms

*/
const limiter = new Bottleneck({
    maxConcurrent: 4, //only 4 requests running at a time
    minTime: 1000 //per 1000ms
});

_.getAllArtistPages = async function(username) {
    let totalPages = Number.MAX_SAFE_INTEGER;
    let entries = [];
    //apply the ratelimiter with .wrap()
    let getPage = limiter.wrap(async function(n) {
        return await fetch('http://ws.audioscrobbler.com/2.0/?'+queryParams({
            method: 'library.getartists',
            api_key: process.env.LASTFM_API_KEY,
            user: username,
            format: 'json',
            limit: 100,
            page: n
        })).then(res => {
            return res.json();
        }).catch(err => {
            console.warn(err)
        }); //this catch returns a Promise that returns 1 object
    });

    for(let i = 1; i < totalPages; i++) {
        let page = await getPage(i);
        totalPages = page['artists']['@attr']['totalPages'];
        for(let j in page['artists']['artist']) {
            entries.push(page['artists']['artist'][j]);
        }
        if(totalPages == Number.MAX_SAFE_INTEGER) {
            //houston we have a problem
            break;
        }
    }
    
    return entries;
}

module.exports = _;