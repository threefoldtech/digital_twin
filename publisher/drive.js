const chalk = require('chalk');
const fs = require('fs');

const { Server: HyperspaceServer } = require('hyperspace');
const { Client: HyperspaceClient } = require('hyperspace')
const HyperDrive = require('hyperdrive')
const config = require('./config.js')
const db  = JSON.parse(fs.readFileSync('db/drives.json'));
const cache = require('./cache.js')

let client
let server

async function create(){
    let drive = new HyperDrive(client.corestore(), null)
    await drive.promises.ready()

    const key = drive.key.toString('hex')
    console.log(chalk.green('✓ (HyperSpace Drive) created'))
    console.log(chalk.blue(`\t✓ ${key}`))

    await client.replicate(drive)
    await new Promise(r => setTimeout(r, 3e3)) // just a few seconds
    await client.network.configure(drive, {announce: false, lookup: false})
    db.keys.push(key)
    fs.writeFile('db/drives.json', JSON.stringify(db), function(err) {
        if (err) {
            console.log(chalk.red('Error saving key to db'));
        }
    });
    cache.drives[key] = drive
    return key
}

async function get(id){
    return cache.drives[id]
}

async function load(){
    db.keys.map( async function(item) {
        let drive = new HyperDrive(client.corestore(), item)
        await drive.promises.ready()
        await client.replicate(drive)
        await new Promise(r => setTimeout(r, 3e3)) // just a few seconds
        await client.network.configure(drive, {announce: false, lookup: false})
        console.log(chalk.blue(`✓ (HyperSpace Drive) loaded ${item}`))
        cache.drives[item] = drive
    })
}


async function ensureHyperSpace () {
    

    try {
        client = new HyperspaceClient()
        await client.ready()
    } catch (e) {
        // no daemon, start it in-process
        server = new HyperspaceServer({storage: config.storage})
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