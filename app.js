// app.js

const express = require('express');
const app = express();
const VERSION = require('./package.json').version;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/version', (req, res) => res.json(VERSION));

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port '+(process.env.PORT || 3000)+'!'));