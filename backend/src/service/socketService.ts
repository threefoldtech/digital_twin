import { Socket } from "socket.io";
import Connections from "../models/connections";


export const sendEventToConnectedSockets = (io:Socket, connections: Connections, event:string, body:any) => {
    connections.getConnections().forEach((connection: string) => {
        io.to(connection).emit(event, body);
        console.log(`send message to ${connection}`);
      });
}