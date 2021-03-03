const cache = require('./cache')
const path = require('path')
const fs = require('fs')
const groups = require('./groups')
const config = require('./config')

class Acls{
    constructor(root){
        this.root = root

        this.acls = {}

        this.load = async function () {
            
            for(var domain in cache.domains){
                if(domain == "localhost" || domain == "127.0.0.1"){
                    continue
                }
                var users = new Set()
                try{
                    var p = path.join(this.root, cache.domains[domain].dir, ".acls.json")
                    var acl = JSON.parse(fs.readFileSync(p));
                    acl.users.map((u)=>{users.add(u)})
                    acl.groups.map((g) => {
                        var groupObj = groups.get(g)
                        groupObj._allUsers.map((u)=>{users.add(u)})
                    })
                }catch(e){
                    continue
                }
                
                this.acls[cache.domains[domain].alias] = Array.from(users)
            } 
            this.acls["/"] = []
        }
    }
}


module.exports = new Acls(config.filesystem.path)
