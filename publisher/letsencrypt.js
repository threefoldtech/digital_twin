const cache = require("./cache");
const fs = require('fs')


async function process(){
    var websites = {}

    for(var domain in cache.domains){
        var value = cache.domains[domain]
        var dir = value.dir
        if(!(dir in websites)){
            websites[dir] = []
        }
        websites[dir].push(domain)
    }

    var letsencrypt = {}

    for (var dir in websites){
        if (dir == ""){
            continue
        }
        var domains = websites[dir]
        if (domains.length > 0){
            var subject = domains.pop()
            letsencrypt[subject] = {}
            letsencrypt[subject].renewAt = 1
            if (domains.length > 0){
                letsencrypt[subject]["altnames"] = domains
            }
        }
    }

    // //{ "sites": [{ "subject": "example.com", "altnames": ["example.com"] }] }

    let config = JSON.parse(fs.readFileSync('greenlock.d/config.json'));
    var domains = {}
    config.sites.forEach(element => {
        domains[element.subject] = element.renewAt || 1
    });

    console.log(domains)
    for(var item in domains){
        if (!(item in letsencrypt)){
            continue
        }else{
            letsencrypt[item]["renewAt"] = domains[item]
        }
        
    }
    
    var newSites = []
    for(item in letsencrypt){
        var obj = {}
        obj.subject = item
        obj.altnames = letsencrypt[item].altnames
        obj.renewAt = letsencrypt[item].renewAt
        newSites.push(obj)
    }
    config.sites = newSites
    fs.writeFileSync('greenlock.d/config.json', JSON.stringify(config, null, 4), {flag: 'w'})

}


module.exports = {
    process : process
}