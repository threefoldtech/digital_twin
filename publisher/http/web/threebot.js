var url = require('url');
var express = require('express');
var router = express.Router();
var cache = require('../../cache')

const asyncHandler = require('express-async-handler')

var threebot = require('@threefoldjimber/threefold_login')

router.get('/threebot/connect', asyncHandler(async (req, res) => {

    const threeFoldAPIHost = 'https://login.threefold.me/';
    const appId = req.headers.host
    const seedPhrase = "analyst wrist friend quick person embrace spell bacon congress gorilla price figure mind camp vanish enrich large rhythm space garden arrive doctor poverty special";
    const redirectUrl = '/threebot/authorize';

    const login = new threebot.ThreefoldLogin( threeFoldAPIHost,
                                appId,
                                seedPhrase,
                                redirectUrl );
    await login.init();
    const state = threebot.generateRandomString();
    req.session.state = state
    req.session.save()
    const loginUrl = login.generateLoginUrl(state);
    res.redirect(loginUrl)
        
}))

router.get('/threebot/authorize', asyncHandler(async (req, res) => {
    var state = req.session.state
    const threeFoldAPIHost = 'https://login.threefold.me/';
    const appId = req.headers.host;
    const seedPhrase = "analyst wrist friend quick person embrace spell bacon congress gorilla price figure mind camp vanish enrich large rhythm space garden arrive doctor poverty special";
    const redirectUrl = '/threebot/authorize';

    const login = new threebot.ThreefoldLogin( threeFoldAPIHost,
                                appId,
                                seedPhrase,
                                redirectUrl );
    
    var uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    try{
        const profileData = await login.parseAndValidateRedirectUrl(new url.URL(uri), state)
        req.session.authorized = true
        req.user = profileData
        req.session.save()

        var urls = []
        for(var d in cache.domains){
            var u = req.protocol + '://' + d
            var host = req.get('host')
            var port = ""
            var splitted = host.split(":")
            if (splitted.length > 0){
                if(splitted[1] != "80"){
                    port = splitted[1]
                }
            }
            if (port){
                u = u + `:${port}`
            }
            u = u + `/threebot/setcookie?state=${state}`
            urls.push(u)
        }
        cache.authorized[state] = profileData

        res.render('sites/authorize.mustache', {
            sites : urls,
        });   
        return
    }catch(e){
        console.log(e)
        return res.status(200).json(e)
    }

}))

router.get('/threebot/setcookie', asyncHandler(async (req, res) => {
    req.session.cookie.domain = req.headers.host
    var state = req.query.state
    if(state in cache.authorized){
        req.session.authorized = true
        req.user = cache.authorized[state]
        req.session.save()
        res.status(200).json("")
        return
    }else{
        res.status(401).json("")
        return
    }
}))

module.exports = router
