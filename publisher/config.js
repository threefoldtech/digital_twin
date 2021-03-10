const fs = require('fs');
const chalk = require('chalk')
const path = require('path');

let config = JSON.parse(fs.readFileSync('config.json'));

config.filesystem.path = resolveHome(config.filesystem.path)
config.hyperdrive.path = resolveHome(config.hyperdrive.path)


function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

if(process.env.NODE_ENV == "production") {
    config.development = false

    var passPhrase = process.env.THREEBOT_PHRASE
    if(!passPhrase){
        throw new Error("THREEBOT_PHRASE Env variable must be set for production")
    }
    config.threebot.passPhrase = passPhrase

} else {
    config.development = true
}

if(process.env.PORT)
    config.http.port = parseInt(process.env.PORT)

console.log(chalk.green('✓ (Config) loaded'))

module.exports = config
