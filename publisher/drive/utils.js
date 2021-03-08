var path = require('path')
const chalk = require('chalk');
const groups = require('./groups')
var config = require ('../config')

async function process(drive, dir){
    var domains = {}
    var p = path.join("/", dir)
    var dirs = await drive.promises.readdir(p)
    var groupObj = await groups.load(drive)
    dirs = dirs.filter((item) => {if(!item.startsWith(".")){return item}}).sort()
    
    for(var i=0; i < dirs.length; i++){
        var dir = path.join(p, dirs[i])

        var domainfilepath = path.join(dir, ".domains.json")
        var repofilepath = path.join(dir, ".repo")
        var aclfilepath = path.join(dir, '.acls.json')
        
        try{
            await drive.promises.stat(domainfilepath)
            
        }catch(e){
            console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} does not contain .domains.json`))
            continue
        }

        try{
            await drive.promises.stat(aclfilepath)
        }catch(e){
            console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} does not contain .acls.json`))
            continue
        }

        try{
            await drive.promises.stat(repofilepath)
        }catch(e){
            console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} does not contain .repo`))
            continue
        }



        var domainInfo = {}
        try{
            var domainData = await  drive.promises.readFile(domainfilepath, 'utf8');
            domainInfo = JSON.parse(domainData)
        }catch(e){
            console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} Error reading: ${domainfilepath}`))
            continue
        }

        var repoInfo = {}
        try{
            var repoData = await  drive.promises.readFile(repofilepath, 'utf8');
            repoInfo = JSON.parse(repoData)
        }catch(e){
            console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} Error reading: ${repofilepath}`))
            continue
        }
        var users = []
        var acl = {}

        try{
            var aclata = await drive.promises.readFile(aclfilepath, 'utf8');
            acl = JSON.parse(aclata)
            users  = await groupObj.parseAcl(acl)
           
        }catch(e){
            console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} Error reading: ${aclfilepath}`))
            continue
        }
        var isWebSite = repoInfo["repo"].startsWith("www")
        var standalone= domainInfo.standalone
        
        var item =  isWebSite? "websites" : "wikis"

        var err = false
        for (var domain in domainInfo.domains){
            if(!(domain in domains)){
                domains[domain] = {"websites": {}, "wikis": {}}
            }

            var alias = standalone? "/" : repoInfo["alias"]
            if (alias == "/" && "/" in domains[domain][item]){
                console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} can not have multiple standalone domains`))
                err = true
                break

            }else if (alias in domains[domain][item]){
                console.log(chalk.red(`    ✓ (Drive (${drive.name}) Ignoring path: ${dir} duplicated alias`))
                err = true
                break
            }

            domains[domain][item][alias] = {
                "drive": drive,
                "dir": dir,
                "repo": repoInfo["repo"],
                "alias": repoInfo["alias"],
                "isWebSite": isWebSite,
                "users": users,
                "login": acl.login
            }
        }

        if(err){
            continue
        }
    }
    return domains
}

async function loadDomains(drive){
    var dirs = await drive.promises.readdir("/")
    dirs = dirs.filter((item) => {if(!item.startsWith(".")){return item}}).sort()
    var items = []

    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i]
        if(config.environments.includes(dir)){
            items.push(await process(drive, dir))
        }
    }
    items.push(await process(drive, "."))
    return items
}

async function reduce(items){
    var res = {}

    for(var i=0; i<items.length; i++){
        var obj = items[i]
        for(var domain in obj){
            if(!(domain in res)){
                res[domain] = obj[domain]
            }else{
                for(var alias in obj[domain]["websites"]){
                    if(alias in res[domain]["websites"]){
                        var driv = res[domain]["websites"][alias].drive
                        var dir = res[domain]["websites"][alias].dir
                        console.log(chalk.red(`    ✓ (Drive (${driv.name}) Ignoring path: ${dir} duplicate alias for domain ${domain}`))
                        continue
                    }else{
                        res[domain]["websites"][alias] = obj[domain]["websites"][alias]
                    }
  
                }
                for(var alias in obj[domain]["wikis"]){
                    if(alias in res[domain]["wikis"]){
                        var driv = res[domain]["websites"][alias].drive
                        var dir = res[domain]["websites"][alias].dir
                        console.log(chalk.red(`    ✓ (Drive (${driv.name}) Ignoring path: ${dir} duplicate alias for domain ${domain}`))
                        continue
                    }else{
                        res[domain]["wikis"][alias] = obj[domain]["wikis"][alias]
                    }
                }
            }
        }
    }
    for(var domain in res){
        res["localhost"] = res[domain]
        res["127.0.0.1"] = res[domain]
    }
    return res
}

module.exports = {
    loadDomains: loadDomains,
    reduce: reduce
}