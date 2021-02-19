var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')

var drive = require('../../drive.js')

// HELPERS

async function iswiki(drive, alias){
    try {
        await drive.promises.stat(`/info_${alias}`)
        return true
    }catch(e){
       return false
    }
}

async function handleWebsiteFile(req, res, driveObj){
    var filename = req.url.replace(`/${req.params.id}/${req.params.sitename}/`, "")
    var filepath = `/www_${req.params.sitename}/${filename}`
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
            content = content.replace(/src="\//g, `src="/${req.params.id}/${req.params.sitename}/`)
            content = content.replace(/href="\//g, `href="/${req.params.id}/${req.params.sitename}/`)
            content = content.replace(/data-srcset="\//g, `data-srcset="/${req.params.id}/${req.params.sitename}/`)
            content = content.replace(/url\(\//g, `url(/${req.params.id}/${req.params.sitename}/`)
            if (filepath.endsWith("js")){
                content = content.replace(/assets/g, `${req.params.id}/${req.params.sitename}/assets`)
            }
            content = content.split("/flexsearch").join(`/${req.params.id}/${req.params.sitename}/flexsearch`);
        }

        return res.send(content)

    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}

async function handleWikiFile(req, res, driveObj){
    var wikiname = `info_${req.params.sitename}`
    var encoding = 'utf-8'
    var filename = req.url.replace(`/${req.params.id}/${req.params.sitename}/`, "")

    if (filename.startsWith("file__") || filename.startsWith("page__")){
        var splitted = filename.split("__")
        if (splitted.length != 3){
            return res.status(404).json('');
        }
        if(filename.startsWith("file__")){
            encoding = 'binary'
        }

        filename = splitted[2]
        wikiname = `info_${splitted[1]}`
    }else if (filename.startsWith("html__")){
		var splitted = filename.split("__")

		if (splitted.length < 3){
            return res.status(404).json('');
        }


        wikiname =`info_${splitted[1]}`
        splitted.shift()
        splitted.shift()
        filename = splitted.join("__")

	}else if (filename == "_sidebar.md"){
        filename = "sidebar.md"
    }

    filepath = `/${wikiname}/${filename}`
    // `/${req.params.wikiname}/${req.params.filename}`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, encoding);
        return res.send(content)

    } catch (e) {
        if (filename == "README.md"){
            filepath = `/${wikiname}/readme.md`
            try{
                entry = await driveObj.promises.stat(filepath)
                var content = await  driveObj.promises.readFile(filepath, encoding);
                return res.send(content)
            }catch(e){
                var content =`# ${wikiname}`
                return res.send(content)
            }
        }
        return res.status(404).json('');
    }
}

// Home
router.get('/', (req, res) => {
    res.render('sites/home.mustache', {
        drives : ["local"],
    });
})

/*
// LIST Sites & Wikis in a DRIVE
router.get('/:id', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = "/"
    try {
        await driveObj.promises.stat(filepath)
        var files = await driveObj.promises.readdir(filepath)
        files.sort()
        var sites = []
        var wikis = []

        files.map( function(file) {
            if(file.startsWith("www")){
                var alias = file.replace("www_", "")
                sites.push({"name": alias, "url": `/${req.params.id}/${alias}`})
            }else if(file.startsWith("info_")){
                var alias = file.replace("info_", "")
                wikis.push({"name": alias, "url": `/${req.params.id}/${alias}`, "err" :`/${req.params.id}/wikis/${alias}/errors`})
            }
        })
        res.render('sites/sites.mustache', {
            sites : sites,
            wikis: wikis
        });
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))
*/

/*
// Sites index page
router.get('/:id/:sitename', asyncHandler(async (req, res) => {
    prefix = "www"
    var driveObj = await drive.get(req.params.id)

    if (await iswiki(driveObj, req.params.sitename)){
        prefix = "info"
    }
    var filepath = `/${prefix}_${req.params.sitename}/index.html`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');

        if (prefix == "www"){
            content = content.replace(/src="\//g, `src="/${req.params.id}/${req.params.sitename}/`)
            content = content.replace(/href="\//g, `href="/${req.params.id}/${req.params.sitename}/`)
            content = content.replace(/data-srcset="\//g, `data-srcset="/${req.params.id}/${req.params.sitename}/`)
            content = content.replace(/url\(\//g, `url(/${req.params.id}/${req.params.sitename}/`)
        }

        return res.send(content)
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))
*/

router.get('/:id/:sitename/flexsearch', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.sitename}/flexsearch.json`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        content = content.replace(/src="\//g, `src="/${req.params.id}/${req.params.sitename}/`)
        content = content.replace(/href="\//g, `href="/${req.params.id}/${req.params.sitename}/`)
        content = content.replace(/data-srcset="\//g, `data-srcset="/${req.params.id}/${req.params.sitename}/`)
        content = content.replace(/url\(\//g, `url(/${req.params.id}/${req.params.sitename}/`)

        res.type("application/json");

        return res.send(content)
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

// Wiki errors
router.get('/:id/wikis/:sitename/errors', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var wikiname = req.params.sitename

    filepath = `info_${wikiname}/errors.json`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)

        var content = await  driveObj.promises.readFile(filepath, 'utf-8');

        var data = JSON.parse(content)
        var errors = {
            page_errors : []
        }
        errors.site_errors = data.site_errors

        for (var key in data.page_errors){
            var e = {
                page : key,
                errors : data.page_errors[key]
            }
            errors.page_errors.push(e)
        }
        res.render('sites/errors.mustache', {site_name: wikiname, site_errors : errors.site_errors, page_errors: errors.page_errors});

    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

/*
// files
router.get('/:id/:sitename/*', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)

    prefix = "www"
    var driveObj = await drive.get(req.params.id)

    if (await iswiki(driveObj, req.params.sitename)){
        prefix = "info"
    }
    if (prefix == "www"){
        return handleWebsiteFile(req, res, driveObj)
    }else{
        return handleWikiFile(req, res, driveObj)
    }

}))

// wiki files only
router.get('/:id/:sitename/img/:filename', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/info_${req.params.sitename}/${req.params.filename}`
    var encoding = 'binary'

    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, encoding);
        return res.send(content)

    } catch (e) {
        return res.status(404).json('');
    }
}))
*/



module.exports = router


