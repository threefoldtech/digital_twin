const express = require('express');
const mustacheExpress = require('mustache-express');

const cors = require('cors');
const drive = require('./api/drive')
const wikis = require('./web/wikis')


let app = express()

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.use(express.json());
app.use(cors());
app.use(wikis);
app.use(drive);

module.exports = app