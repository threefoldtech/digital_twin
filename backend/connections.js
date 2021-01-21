module.exports = class Connections {
    constructor (connections) {
      this.connections = connections
    }
    
    add (connection) {
      this.connections.push(connection)
    }
  
    delete (connection) {
      const index = this.connections.findIndex(c => c === connection)
      this.connections.splice(index, 1)
    }

    getConnections () {
      return this.connections
    }
  }