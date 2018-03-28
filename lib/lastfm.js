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

_.getAllUserArtists = async (username) => {
    let totalPages = Number.MAX_SAFE_INTEGER;
    let entries = [];
    //apply the ratelimiter with .wrap()
    let getPage = limiter.wrap(async function(n) {
        return await fetch(BASE_URL+'?'+queryParams({
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

//only gets top 1000
_.getAllUserTopAlbums = async (username) => {
    let totalPages = Number.MAX_SAFE_INTEGER;
    let entries = [];
    //apply the ratelimiter with .wrap()
    let getPage = limiter.wrap(async function(n) {
        return await fetch(BASE_URL+'?'+queryParams({
            method: 'user.gettopalbums',
            api_key: process.env.LASTFM_API_KEY,
            user: username,
            format: 'json',
            limit: 100,
            period: 'overall',
            page: n
        })).then(res => {
            return res.json();
        }).catch(err => {
            console.warn(err)
        }); //this catch returns a Promise that returns 1 object
    });

    for(let i = 1; i < totalPages; i++) {
        let page = await getPage(i);
        totalPages = page['topalbums']['@attr']['totalPages'];
        for(let j in page['topalbums']['album']) {
            entries.push(page['topalbums']['album'][j]);
        }
        if(totalPages == Number.MAX_SAFE_INTEGER) {
            //houston we have a problem
            break;
        }
    }
    
    return entries;
}

_.getAllUserTracks = async (username) => {
    let totalPages = Number.MAX_SAFE_INTEGER;
    let entries = [];
    //apply the ratelimiter with .wrap()
    let getPage = limiter.wrap(async function(n) {
        return await fetch(BASE_URL+'?'+queryParams({
            method: 'user.getrecenttracks',
            api_key: process.env.LASTFM_API_KEY,
            user: username,
            format: 'json',
            limit: 200,
            page: n
        })).then(res => {
            return res.json();
        }).catch(err => {
            console.warn(err)
        }); //this catch returns a Promise that returns 1 object
    });

    for(let i = 1; i < totalPages; i++) {
        let page = await getPage(i);
        logger.log('page ',i,' done.');
        totalPages = page['recenttracks']['@attr']['totalPages'];
        for(let j in page['recenttracks']['track']) {
            entries.push(page['recenttracks']['track'][j]);
        }
        if(totalPages == Number.MAX_SAFE_INTEGER) {
            //houston we have a problem
            break;
        }
    }
    
    return entries;
}

_.checkAlbumListened = async (username, artist, album) => {
    return await limiter.schedule(() => fetch(BASE_URL+'?'+queryParams({
        method: 'album.getInfo',
        api_key: process.env.LASTFM_API_KEY,
        user: username,
        artist: artist,
        album: album,
        format: 'json'
    })).then(res => {
        return res.json();
    }).catch(err => {
        console.warn(err);
    }).then(data => {
        return data['album']['userplaycount'] !== undefined;
    }));
};

module.exports = _;