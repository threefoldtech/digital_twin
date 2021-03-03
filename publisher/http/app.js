const express = require('express');
var session = require('express-session')

const mustacheExpress = require('mustache-express');

const cors = require('cors');
const drive = require('./api/drive')
const sites = require('./web/sites')
const threebot = require('./web/threebot')

const process = require('process')

let app = express()

// Session
var sess = {
    secret: process.env.SECRET|| 'fbc5def3-bbef-4836-8c76-51e0cef14e2f',
    cookie: {}
  }
  
  if (app.get('env') === 'production') {
    if (process.env.SECRET === ''){
        throw new Error("Secret is required")
    }

    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  
app.use(session(sess))

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');


// Threebot connect
app.use(function (req, res, next) {
    if (!req.url.startsWith('/threebot/setcookie') && req.url != '/threebot/connect' && !req.url.startsWith('/threebot/authorize' && !req.url('/'))){
        if(!req.session.authorized){
            res.redirect(`/threebot/connect?next=${req.url}`)
        }else{
            next()
        }
    }else{
        next()
    }
  })

app.use(express.json());

app.use(threebot)
app.use(sites);
app.use(drive);
app.use(cors());
module.exports = app
