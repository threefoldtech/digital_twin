const express = require('express');
var session = require('express-session')

const mustacheExpress = require('mustache-express');

const cors = require('cors');
const drive = require('./api/drive')
const sites = require('./web/sites')
const threebot = require('./web/threebot')

const process = require('process')
const acls = require('../acls')

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
    if (!req.url.startsWith('/threebot/setcookie') && !req.url.startsWith('/threebot/connect') && !req.url.startsWith('/threebot/authorize')){
        if(!req.session.authorized){
            res.redirect(`/threebot/connect?next=${req.url}`)
        }else{
            // check acls
            var splitted =  req.url.split("/")
            var isWebsite = true

            if(req.url == "/" ){
              var prefix = "/"
            }else{
              if( splitted[1] == "info"){
                isWebsite = false
                var prefix = splitted[2]
              }else{
                var prefix = splitted[1]
              }
            }
            
            var permissions = acls.acls

            if(isWebsite){
              var permissions  = acls.acls.websites
            }else{
              var permissions = acls.acls.wikis
            }
            
            users = permissions [prefix]
            if (!users){
              return res.status(404).json({"error": "invalid url"})
            }
            if(users.length == 0){
              next()
              return
            }
            if(users.contains(req.session.user.profile.doubleName)){
              next()
              return
            }
            return res.status(401).json({"error": "user has no permission to see this page"})
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
