// lastfm.js

const fetch = require('node-fetch');
const logger = require('au5ton-logger');

const _ = {};


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