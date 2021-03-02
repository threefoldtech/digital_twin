import low from 'lowdb'
import FileSync from "lowdb/adapters/FileSync";


const adapter = new FileSync('/appdata/db.json')

// import YAML from "js-yaml";
//
// const toYamlString = (dbObject:any) => {
//     return YAML.dump(dbObject);
// };
//
// const fromYamlString = (dbObjectString: string) => {
//     return YAML.load(dbObjectString);
// };
//
// const adapter = new FileSync('/appdata/db.yaml', {
//     serialize: (dbObject) => toYamlString(dbObject),
//     deserialize: (dbObjectString) => fromYamlString(dbObjectString)
// })

export const db = low(adapter)

db.defaults({ chats: [] })
    .write()
