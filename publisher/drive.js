const chalk = require('chalk');
const fs = require('fs');
var path = require('path');

const { Server: HyperspaceServer } = require('hyperspace');
const { Client: HyperspaceClient } = require('hyperspace')
const HyperDrive = require('hyperdrive')
const config = require('./config.js')
const db  = JSON.parse(fs.readFileSync('db/drives.json'));
const cache = require('./cache.js')

let client
let server

class LocalDrive{
    constructor(){
        var base = config.filesystem.path
        console.log(base)
        this.promises =  {
            stat : async function(filepath){
                return fs.lstatSync(path.join(base, filepath));
            },
            readdir: async function(dirpath){
                return fs.readdirSync(path.join(base, dirpath));
            },
            readFile: async function(filepath, encoding){
                if (encoding == 'binary'){
                    return fs.readFileSync(path.join(base, filepath))
                }
                return fs.readFileSync(path.join(base, filepath), encoding)
            },
        }
    }
}

async function create(name){
    let drive = new HyperDrive(client.corestore(), null)
    await drive.promises.ready()

    const key = drive.key.toString('hex')
    console.log(chalk.green('✓ (HyperSpace Drive) created'))
    console.log(chalk.blue(`\t✓ ${name} (${key})`))

    await client.replicate(drive)
    await new Promise(r => setTimeout(r, 3e3)) // just a few seconds
    await client.network.configure(drive, {announce: false, lookup: false})
    db.hyperdrives.push({"name": name, "key": key})
    fs.writeFile('db/drives.json', JSON.stringify(db), function(err) {
        if (err) {
            console.log(chalk.red('Error saving key to db'));
        }
    });
    cache.drives[key] = drive
    cache.drives[name] = drive
    
    return key
}

async function get(id_or_name){
    return cache.drives[id_or_name]
}

async function load(){
    db.hyperdrives.map( async function(item) {
        let drive = new HyperDrive(client.corestore(), item.key)
        await drive.promises.ready()
        await client.replicate(drive)
        await new Promise(r => setTimeout(r, 3e3)) // just a few seconds
        await client.network.configure(drive, {announce: false, lookup: false})
        console.log(chalk.blue(`✓ (HyperSpace Drive) loaded ${item.name} (${item.key})`))
        cache.drives[item.name] = drive
        cache.drives[item.key] = drive
        
    })
    cache.drives["local"] = new LocalDrive()
    console.log(chalk.blue(`✓ (LocalDrive Drive) loaded`))
}


async function ensureHyperSpace () {
    

    try {
        client = new HyperspaceClient()
        await client.ready()
    } catch (e) {
        // no daemon, start it in-process
        console.log(config.hyperdrive.path)
        server = new HyperspaceServer({storage: config.hyperdrive.path})
        await server.ready()
        client = new HyperspaceClient()
        await client.ready()
        console.log(chalk.green('✓ (HyperSpace Daemon)'))
        console.log(chalk.green('\t✓ start'));
        console.log(chalk.green('✓ (HyperSpace Daemon) connected status'))
        console.log(await client.status())
    }

    return {
        client,
        async cleanup () {
            await client.close()
            if (server) {
                await server.stop()
                console.log(chalk.green('✓ (HyperSpace Daemon)'))
                console.log(chalk.red('\t✓ closed'));
            }
        }
    }
}

module.exports = {
    ensureHyperSpace: ensureHyperSpace,
    create: create,
    load: load,
    get: get
}