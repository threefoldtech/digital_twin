module.exports = class Users {
    constructor (name, socket, publicKey) {
      this.name = name
      this.socket = socket
      this.publicKey = publicKey
    }
  }