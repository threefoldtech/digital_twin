var url = require('url');
var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')

var threebot = require('@threefoldjimber/threefold_login')

router.get('/threebot/connect', asyncHandler(async (req, res) => {

    const threeFoldAPIHost = 'https://login.threefold.me/';
    const appId = '127.0.0.1:3000';
    const seedPhrase = "analyst wrist friend quick person embrace spell bacon congress gorilla price figure mind camp vanish enrich large rhythm space garden arrive doctor poverty special";
    const redirectUrl = '/threebot/authorize';

    const login = new threebot.ThreefoldLogin( threeFoldAPIHost,
                                appId,
                                seedPhrase,
                                redirectUrl );
    await login.init();
    const state = threebot.generateRandomString();
    req.session.state = state

    const loginUrl = login.generateLoginUrl(state);
    res.redirect(loginUrl)
        
}))

router.get('/threebot/authorize', asyncHandler(async (req, res) => {
    var state = req.session.state
    const threeFoldAPIHost = 'https://login.threefold.me/';
    const appId = '127.0.0.1:3000';
    const seedPhrase = "analyst wrist friend quick person embrace spell bacon congress gorilla price figure mind camp vanish enrich large rhythm space garden arrive doctor poverty special";
    const redirectUrl = '/threebot/authorize';

    const login = new threebot.ThreefoldLogin( threeFoldAPIHost,
                                appId,
                                seedPhrase,
                                redirectUrl );
    
    var uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    try{
        const profileData = await login.parseAndValidateRedirectUrl(new url.URL(uri), state)
        return res.status(200).json(profileData)
    }catch(e){
        console.log(e)
        return res.status(200).json(e)
    }

}))

module.exports = router