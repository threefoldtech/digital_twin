const express = require('express');
var session = require('express-session')

const mustacheExpress = require('mustache-express');
const config = require('../config')

const cors = require('cors');
const sites = require('./web/sites')
const threebot = require('./web/threebot')

let app = express()

// Session
var sess = {
    secret: config.http.session.secret,
    cookie: {},
    resave: true,
    saveUninitialized: true
  }
  
  if (config.nodejs.production) {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  
app.use(session(sess))

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// req info
app.use(function (req, res, next) {
  var port = 443
    var host = ""

    if (req.headers.host){
      host = req.headers.host
      var splitted = req.headers.host.split(':')
      if (splitted.length > 1){
          port = splitted[1]
          host = splitted[0]
      }
  }

  if (host === ""){
      return res.status(400).json('Header is missing');
  }

  if(!(host in config.domains)){
    return res.status(400).json('Bad domain');
  }

  if(req.url.startsWith('/threebot')){
    if(req.session.authorized){
      return res.status(201)
    }
    next()
    return
  }

  var info = null

  for (var alias in config.domains[host].websites){
    if (alias == '/'){
      info = config.domains[host].websites['/']
      break
    }
  }
  
  if(req.url == '/'){
    if(!info){
      for (var alias in config.domains[host].wikis){
        if (alias == '/'){
          info = config.domains[host].wikis['/']
          break
        }
      }
    }


  }else{
    for (var alias in config.domains[host].websites){
      if (req.url.startsWith(`/${alias}`)){
        info = config.domains[host].websites[alias]
        break
      }
    }

    for (var alias in config.domains[host].wikis){
      if (req.url.startsWith(`/info/${alias}`)){
        info = config.domains[host].wikis[alias]
        break
      }
    }
  }

  if(!info){
    return res.status(404).json("");
  }
  req.info = info
  req.info.host = host

  if(req.info.login){
    if(!req.session.authorized){
      res.redirect(`/threebot/connect?next=${req.url}`)
    }else{
      if(req.info.users.length > 0 && (!req.info.users.map((u)=>u.replace('.3bot', '')).includes(req.session.user.profile.doubleName.replace('.3bot', '')))){
        return res.status(401).json({"error": "Unauthorized access"})
      }else{
        next()
        return 
      }
    }
  }else{
    next()
    return
  }
})

app.use(express.json());

app.use(threebot)
app.use(sites);
app.use(cors());
module.exports = app
