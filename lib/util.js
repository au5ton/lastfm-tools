// util

const _ = {};
const crypto = require('crypto');

_.generateSession = () => {
    let sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

module.exports = _;