"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connections = void 0;
class Connections {
    constructor(connections) {
        this.socketIds = connections;
    }
    add(connection) {
        this.socketIds.push(connection);
    }
    delete(connection) {
        const index = this.socketIds.findIndex(c => c === connection);
        this.socketIds.splice(index, 1);
    }
    getConnections() {
        return this.socketIds;
    }
}
exports.Connections = Connections;
