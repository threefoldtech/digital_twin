var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')

var drive = require('../../drive.js')

// LIST Sites in a DRIVE
router.get('/drive/:id/sites', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = "/"
    try {
        await driveObj.promises.stat(filepath)
        var files = await driveObj.promises.readdir(filepath)
        files.sort()
        var sites = []

        files.map( function(file) {
            if(!["foundation", "legal","tfgrid_sdk"].includes(file)){
                sites.push({"name": file, "url": `/drive/${req.params.id}/sites/${file}`})
            }
        })
        res.render('sites/sites.mustache', {sites : sites});
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

// Sites index page
router.get('/drive/:id/sites/:sitename', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.sitename}/index.html`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        content = content.replace(/src="\//g, `src="/drive/${req.params.id}/sites/${req.params.sitename}/`)
            content = content.replace(/href="\//g, `href="/drive/${req.params.id}/sites/${req.params.sitename}/`)
            content = content.replace(/data-srcset="\//g, `data-srcset="/drive/${req.params.id}/sites/${req.params.sitename}/`)
            content = content.replace(/url\(\//g, `url(/drive/${req.params.id}/sites/${req.params.sitename}/`)

        return res.send(content)
       
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

// Sites index page
router.get('/drive/:id/sites/:sitename/flexsearch', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.sitename}/flexsearch.json`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        content = content.replace(/src="\//g, `src="/drive/${req.params.id}/sites/${req.params.sitename}/`)
        content = content.replace(/href="\//g, `href="/drive/${req.params.id}/sites/${req.params.sitename}/`)
        content = content.replace(/data-srcset="\//g, `data-srcset="/drive/${req.params.id}/sites/${req.params.sitename}/`)
        content = content.replace(/url\(\//g, `url(/drive/${req.params.id}/sites/${req.params.sitename}/`)

        res.type("application/json");
        
        return res.send(content)
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))





// assets
router.get('/drive/:id/sites/:sitename/*', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var str = `/drive/${req.params.id}/sites`

    var filepath = req.url.replace(str, "").trim()
    console.log(filepath)
    var encoding = 'utf-8'
    if(filepath.endsWith('png') || filepath.endsWith('jpg') || filepath.endsWith('jpeg')){
        encoding = 'binary'
    }else if (filepath.endsWith("js")){
        res.type("text/javascript");
    }else if (filepath.endsWith("css")){
            res.type("text/css");
    }else if (filepath.endsWith("json")){
        res.type("application/json");

    }

    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        if(entry.isDirectory()){
            filepath = filepath + "/index.html"
            entry = await driveObj.promises.stat(filepath)
        }

        var content = await  driveObj.promises.readFile(filepath, encoding);
        if (encoding != 'binary'){
            content = content.replace(/src="\//g, `src="/drive/${req.params.id}/sites/${req.params.sitename}/`)
            content = content.replace(/href="\//g, `href="/drive/${req.params.id}/sites/${req.params.sitename}/`)
            content = content.replace(/data-srcset="\//g, `data-srcset="/drive/${req.params.id}/sites/${req.params.sitename}/`)
            content = content.replace(/url\(\//g, `url(/drive/${req.params.id}/sites/${req.params.sitename}/`)
            if (filepath.endsWith("js")){
                content = content.replace(/assets/g, `drive/${req.params.id}/sites/${req.params.sitename}/assets`)
            }
            content = content.split("/flexsearch").join(`/drive/${req.params.id}/sites/${req.params.sitename}/flexsearch`);
        }
       
        return res.send(content)
        
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

module.exports = router


