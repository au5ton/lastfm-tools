
const fetch = require('node-fetch');
const Bottleneck = require("bottleneck");

//from: https://github.com/github/fetch/issues/256#issuecomment-259290394
const queryParams = (params) => {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

const limiter = new Bottleneck({
    maxConcurrent: 2,
    minTime: 5000
});

fetch('http://ws.audioscrobbler.com/2.0/?'+queryParams({
    method: 'library.getartists',
    api_key: process.env.LASTFM_API_KEY,
    user: 'au5ton',
    format: 'json',
    limit: 100,
    page: 1
})).then(res => {
    return res.json();
}).catch(err => {
    console.warn(err)
}).then(json => {
    console.log(json)
})

async function getAllQuestions(q,tag){
    var page = 0 
    var res = await getQuestions(q,tag,page)
    var all = [res]
    while(res.has_more && res.quota_remaining > 0){
        page++
        res=await getQuestions(q,tag,page)
        all.push(res)
    }
    return all
}


 
// Never more than 1 request running at a time.
// Wait at least 2000ms between each request.
