
const chalk = require('chalk');

const config = require('./config')
const app = require('./http/app.js')
const process = require('process');

async function init(){
    const drive = require('./drive.js');
    const {_, cleanup } = await drive.ensureHyperSpace();
    await drive.load();
    return {_, cleanup }

}

async function main(){
    var host = config.http.host;
    var port = config.http.port;

    const {_, cleanup } = await init();
    
    process.on('SIGINT', () => {
        cleanup()
        server.close(() => {
            console.log(chalk.green(`✓ (HTTP Server) http://${host}:${port}`));
            console.log(chalk.red(`\t✓ closed`));
        })
    })

    const server = app.listen(port, host, () => {
        console.log(chalk.green(`✓ (HTTP Server) : http://${host}:${port}`));
    })
}

main()