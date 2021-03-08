
const chalk = require('chalk');
const process = require('process');

const config = require('./config')
const localDrive = require('./drive/local')
const hyperdrive = require('./drive/hyperdrive');
const utils = require('./drive/utils')
const dnsserver = require("./servers/dns")

const letsencrypt = require('./letsencrypt')

async function init(){
    var domainsList = []

    await config.load()
    domainsList.push(...await localDrive.load())
    
    var cleanup = function () {}

    if(config.hyperdrive.enabled){
      const {_, cleanup } = await hyperdrive.start();
      domainsList.push(...await hyperdrive.load())
    }
    var domains = await utils.reduce(domainsList)
    config.domains = domains
    return cleanup
}

async function main(){
  
    const cleanup = await init().catch((e)=>{console.log(e);process.exit(1)})

    if(config.dns.enabled){
      console.log(chalk.green(`✓ (DNS Server) : ${config.dns.port}`));
      dnsserver.listen(config.dns.port);
    }

    // HTTP(s) Server
    process.on('SIGINT', () => {
        cleanup()
        server.close(() => {
            console.log(chalk.green(`✓ (HTTP Server)  http://localhost:${config.http.port}`));
            console.log(chalk.green(`✓ (DNS Server) : ${config.dns.port}`));
            console.log(chalk.red(`\t✓ closed`));
        })
    })

    if (!config.nodejs.production){
      var port = config.http.port
      const app = require('./http/app.js')
      const server = app.listen(port, "localhost", () => {	
        console.log(chalk.green(`✓ (HTTP Server) : http://localhost:${port}`));
      })
    }else{
      
      // write new config
      letsencrypt.process()

      require('greenlock-express').init({
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

   
    }

main()
