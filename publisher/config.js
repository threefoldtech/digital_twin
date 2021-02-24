const fs = require('fs');
const chalk = require('chalk')
const path = require('path');

let config = JSON.parse(fs.readFileSync('config.json'));

config.filesystem.path = resolveHome(config.filesystem.path)
config.hyperdrive.path = resolveHome(config.hyperdrive.path)

console.log(chalk.green('✓ (Config) loaded'))

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

if(process.env.NODE_ENV == "production"){
    config.development = false
}else{
    config.development = true
}

module.exports = config