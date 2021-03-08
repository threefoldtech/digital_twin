const process = require('process')
const path = require('path')

// Resolve path with ~
async function resolvePath(filepath){
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

class Utils{
    constructor(){
        this.resolvePath = resolvePath
    }
}

module.exports = new Utils()