const fs = require('fs');
const chalk = require('chalk')
const path = require('path');

let config = JSON.parse(fs.readFileSync('config.json'));

config.filesystem.path = resolveHome(config.filesystem.path)

console.log(chalk.green('✓ (Config) loaded'))

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

module.exports = config