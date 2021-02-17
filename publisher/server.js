
const chalk = require('chalk');

const config = require('./config')
const app = require('./http/app.js')
const process = require('process');
const dns = require('dns2');
const { Packet } = dns;

const dnsserver = dns.createUDPServer((request, send, rinfo) => {
    const response = Packet.createResponseFromRequest(request);
    const [ question ] = request.questions;
    const { name } = question;
    response.answers.push({
      name,
      type: Packet.TYPE.A,
      class: Packet.CLASS.IN,
      ttl: 300,
      address: '8.8.8.8'
    });
    send(response);
  });


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

    dnsserver.on('request', (request, response, rinfo) => {
        console.log(request.header.id, request.questions[0]);
      });
    dnsserver.listen(5333);
    console.log(chalk.green(`✓ (DNS Server) 5333`));
    require('greenlock-express')
    .init({
        packageRoot: __dirname,

        // contact for security and critical bug notices
        maintainerEmail: "hamdy.a.farag@gmail.com",

        // where to look for configuration
        configDir: './greenlock.d',

        // whether or not to run at cloudscale
        cluster: false
    })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(app);

    }

main()
