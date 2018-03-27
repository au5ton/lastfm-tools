// lastfm.js

//modules
const fetch = require('node-fetch');
const logger = require('au5ton-logger');

//constants
const _ = {};
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
//from: https://github.com/github/fetch/issues/256#issuecomment-259290394
const queryParams = (params) => {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
};

//TODO: replace placeholder
_.getUser = () => {
    return new Promise((resolve, reject) => {
        fetch('https://api.github.com/users/github')
        .then(res => res.json())
        .catch((err) => {
            reject(err);
        })
	    .then(result => {
            resolve(result);
        });
    });
}

module.exports = _;