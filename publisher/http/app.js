const express = require('express');
const mustacheExpress = require('mustache-express');

const cors = require('cors');
const drive = require('./api/drive')
const sites = require('./web/sites')


let app = express()

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.use(express.json());
app.use(cors());
app.use(sites);
app.use(drive);

module.exports = app