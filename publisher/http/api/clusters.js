var express = require('express');
var router = express.Router();
var fs = require("fs").promises;
var path = require('path');
var app = express();

const asyncHandler = require('express-async-handler')
const clusterspath = "/tmp/clusters";

async function clusters_list(cpath) {
    const clusters = [];

    let files = await fs.readdir(cpath)
    let pathName = cpath;

    const apath = path.resolve(pathName);

    for(let file of files) {
        /*
        try {
            let content = await fs.readFile(apath + '/' + file)
            let data = JSON.parse(content);
            clusters.push(data);

        } catch(err) {
            console.log(`${err}`);
        }
        */

        clusters.push(file.substring(0, file.lastIndexOf('.')));
    }

    return clusters;
}

async function cluster_get(cpath) {
    try {
        await fs.access(cpath, fs.F_OK);

    } catch(err) {
        throw "invalid cluster";
    }

    try {
        let content = await fs.readFile(cpath)
        let data = JSON.parse(content);
        return data;

    } catch(err) {
        console.log(`${err}`);
    }
}

async function clusters_delete(cpath) {
    try {
        await fs.access(cpath, fs.F_OK);

    } catch(err) {
        throw "invalid cluster";
    }

    try {
        fs.unlink(cpath);

    } catch(err) {
        throw "cannnot delete this cluster";
    }

    return {"status": "success"}
}

async function cluster_put(cpath, body) {
    console.log(body);

    if(!('name' in body))
        throw "missing name";

    if(!('psk' in body))
        throw "missing pre-shared key (psk)";

    if(!('ipv4' in body))
        throw "missing ipv4 addresses list";

    if(!('ipv6' in body))
        throw "missing ipv6 addresses list";

    try {
        let write = await fs.writeFile(cpath, JSON.stringify(body));

    } catch(err) {
        console.log(`${err}`);
    }

    return {"status": "created"};
}



router.get('/clusters', function(req, res) {
    clusters_list(clusterspath).then((content) => {
        res.json(content);

    }, (err) => {
        res.status(422).json({
            message: `${err}`
        });
    });
})

router.get('/clusters/:id', function(req, res) {
    let fullpath = path.join(clusterspath, req.params.id + ".json");
    const apath = path.resolve(fullpath);

    cluster_get(apath).then((content) => {
        res.json(content);

    }, (err) => {
        res.status(422).json({
            message: `${err}`
        });
    });
});

router.delete('/clusters/:id', function(req, res) {
    let fullpath = path.join(clusterspath, req.params.id + ".json");
    const apath = path.resolve(fullpath);

    clusters_delete(apath).then((content) => {
        res.json(content);

    }, (err) => {
        res.status(422).json({
            message: `${err}`
        });
    });
});

router.put('/clusters/:id', function(req, res) {
    let fullpath = path.join(clusterspath, req.params.id + ".json");
    const apath = path.resolve(fullpath);

    cluster_put(apath, req.body).then((content) => {
        res.json(content);

    }, (err) => {
        res.status(422).json({
            message: `${err}`
        });
    });
});


module.exports = router
