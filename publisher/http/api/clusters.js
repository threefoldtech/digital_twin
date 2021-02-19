var express = require('express');
var router = express.Router();
var fs = require("fs").promises;
var path = require('path');
var app = express();

const asyncHandler = require('express-async-handler')
const rootpath = "/tmp/clusters";

async function list(cpath) {
    const clusters = [];

    let files = await fs.readdir(cpath)
    let pathName = cpath;

    const apath = path.resolve(pathName);

    for(let file of files) {
        try {
            let content = await fs.readFile(apath + '/' + file)
            let data = JSON.parse(content);
            clusters.push(data);

        } catch(err) {
            console.log(`${err}`);
        }

        // clusters.push(file.substring(0, file.lastIndexOf('.')));
    }

    return clusters;
}

async function get(cpath) {
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

async function remove(cpath) {
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

async function put(cpath, body) {
    console.log(body);

    try {
        let write = await fs.writeFile(cpath, JSON.stringify(body));

    } catch(err) {
        console.log(`${err}`);
    }

    return {"status": "created"};
}

async function findByName(cpath, name) {
    let values = await list(cpath);

    for(var i in values) {
        const cluster = values[i];

        if(cluster['name'] == name)
            return cluster;
    }

    return null;
}

module.exports = {rootpath, list, get, remove, put, findByName}
