const path = require('path')
const fs = require('fs')
const config = require('./config')

class Groups{
    constructor(root){

        this.root = root
        this._groups = {}

        // flatten group
        this._flatten= function(group, groups){
            var users = new Set()
            
            group.users.map((u)=>{
                users.add(u)
            })

            group.groups.map((g)=>{
                g = groups[g]
                Array.from(this._flatten(g, groups)).map((u)=>{
                    users.add(u)
                })
            })
            return users 
        }
        
        this.list = function(){
            var res = []
            for(var g in this._groups){
                res.push(g)
            }
            return res
        }  
        
        this.load = async function(){
            this._groups = JSON.parse(fs.readFileSync(path.join(this.root, ".groups.json")));
            for(var item in this._groups){
                var g = this._groups[item]
                // make sure subgroups exis
                var subgroups =g.groups
                for(var i=0; i< subgroups.length; i++){
                    if(!(subgroups[i] in this._groups)){
                        throw new Error(`Group ${subgroups[i]} does not exist`)
                    }
                }
                // flatten users
                g._allUsers =  Array.from(this._flatten(g, this._groups))
                
            }
            return this
        }

        this.save = function(){
            fs.writeFileSync(path.join(this.root, ".groups.json"), JSON.stringify(this._groups, null, 4), {flag: 'w'})
        }

        this.get =  function(name){
            if(!name in this._groups){
                throw new Error("Not found")
            }
            return this._groups[name]
        }
    }
}

var g = new Groups(config.filesystem.path)
module.exports = g