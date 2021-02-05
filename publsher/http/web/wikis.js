var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')

var drive = require('../../drive.js')

// LIST WIKIS in a DRIVE
router.get('/drive/:id/wikis', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = "/"
    try {
        await driveObj.promises.stat(filepath)
        var files = await driveObj.promises.readdir(filepath)
        files.sort()
        wikis = []

        files.map( function(file) {
            if(["foundation", "legal","tfgrid_sdk"].includes(file)){
                wikis.push({"name": file, "url": `/drive/${req.params.id}/wikis/${file}`})
            }
        })
        res.render('wikis/wikis.mustache', {wikis : wikis});
    } catch (e) {
        return res.status(404).json('');
    }
}))

// WIKI index page
router.get('/drive/:id/wikis/:wikiname', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.wikiname}/index.html`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        return res.send(content)
       
    } catch (e) {
        return res.status(404).json('');
    }
}))

// MD File
router.get('/drive/:id/wikis/:wikiname/:filename', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var wikiname = req.params.wikiname
    var encoding = 'utf-8'
    var filename = req.params.filename

    if (filename.startsWith("file__") || filename.startsWith("page__")){
        var splitted = filename.split("__")
        if (splitted.length != 3){
            return res.status(404).json('');
        }
        if(filename.startsWith("file__")){
            encoding = 'binary'
        }

        filename = splitted[2]
        wikiname = splitted[1]
    }else if (filename.startsWith("html__")){
		var splitted = filename.split("__")

		if (splitted.length < 3){
            return res.status(404).json('');
        }

		
        wikiname = splitted[1]
        splitted.shift()
        splitted.shift()
        filename = splitted.join("__")

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
}))


// images Image
router.get('/drive/:id/wikis/:wikiname/img/:filename', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.wikiname}/${req.params.filename}`
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

module.exports = router


