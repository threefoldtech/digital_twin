import express from "express"
import http from "http"
// import ioserver, {Socket} from "socket.io"
const socketio = require("socket.io");
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors"

import Message from "./models/message";
import Connections from "./models/connections";
import Contact from "./models/contact";
import {Socket} from "socket.io"
import {appCallback, getAppLoginUrl} from "./service/authService";
import session from "express-session";
import {config} from "./config/config"
import {uuidv4} from "./common/index"
import {sendEventToConnectedSockets} from "./service/socketService"

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

const app = express();
const httpServer = http.createServer(app)
const io = socketio(httpServer)
// @todo fix cors in prod -> config
// const io = socketio(httpServer, { cors: {
//   origin: '*',
// }})
// app.use(cors(corsOptions))

let connections = new Connections([]);
const dummycontact = new Contact("c2ef210a-f68c-44f4-98e3-a62e1d7d28e9", "Jason Parser", "localhost:3000");
let contacts: Array<Contact> = [dummycontact];
let contactRequests: Array<Contact> = [];
let messages:Array<Message> = [];


app.enable('trust proxy');

app.use(session({
  secret: 'secretpassphrase',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    path: "/api",
    secure: true,
    httpOnly: true
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/signin', async (request, respose) => {
  console.log(request.rawHeaders)
  console.log(request.cookies)
  const loginUrl = await getAppLoginUrl(request, `/api/callback`);
  respose.redirect(loginUrl);
});


app.get('/api/callback', async (request, respose) => {
  console.log(request.rawHeaders)
  console.log(request.cookies)
  const callback = await appCallback(request);
  respose.redirect(callback);
});

app.get('/api/healthcheck', async(req, res) => {
  res.sendStatus(200);
})

app.get("/api/chats", (req, res) => {
  res.json(messages);
});

app.get("/api/contacts", (req, res) => {
  const resp = contacts.map((contact) => {
    return {
      id: contact.id,
      name: contact.username
    };
  });
  res.json(resp);
});

app.get("/api/contactRequests", (req, res) => {
  res.json(contactRequests);
});

app.post("/api/contacts", (req, res) => {
  if(req.query.id){
    const id = req.query.id
    console.log("adding from requests to contacts: ", id)
    const index = contactRequests.findIndex(c=>c.id==id)
    // @TODO implement db here
    contacts.push(contactRequests[index]);
    contactRequests.splice(index,1)
    res.sendStatus(200)
    return
  }
  const con = req.body;
  const contact = new Contact(con.id, con.username, con.location);
  console.log(`Adding contact  ${contact.username}`);

  // @TODO implement db here
  contacts.push(contact);

  res.sendStatus(200);
  
});

// Should be externally availble
app.post("/api/messages", (req, res) => {
  // @ TODO check if valid
  const mes = req.body;
  const host = req.get('host')
  const location = host.split(".")[0]
  let contact = contacts.find(c => c.location == location)
  
  if(!contact){
    const id = uuidv4()
    contact = new Contact(id, mes.from, host);
    if(!contactRequests.find(c=> c.username == mes.from)){
      console.log("adding contact to contactrequest", contact )
      contactRequests.push(contact);
      sendEventToConnectedSockets(io, connections, "connectionRequest", contact)
    }
  }
  const message = new Message(contact.id, mes.from, mes.to, mes.body);
  console.log(`received new message from ${message.from}`);

  // @TODO implement db here
  messages.push(message);
  sendEventToConnectedSockets(io, connections, "message", message)

  res.sendStatus(200);
});

io.on("connection", (socket: Socket) => {
  console.log(`${socket.id} connected`);
  connections.add(socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    connections.delete(socket.id);
  });

  socket.on("message", (newMessage) => {
    console.log('new message')
    newMessage = new Message(newMessage.chatId, newMessage.from, newMessage.to, newMessage.body)
    console.log(contacts)
    console.log(newMessage.chatId)
    const receiver = contacts.find(c => c.id == newMessage.chatId);
    if (!receiver) {
      console.log("receiver not found")
      return "receiver not found";
    }
    // @TODO implement db here
    messages.push(newMessage);

    const url = `http://${receiver.location}/api/messages`
    console.log(`sending message ${ newMessage.body } to ${ url }`);

    connections.getConnections().forEach((connection: String) => {
      if (connection == socket.id){
        // this is me
        return
      }
      io.to(connection).emit("message", newMessage);
      console.log(`send message to ${connection}`);
    });
    
    if(config.userid == newMessage.from){
      return
    }

    try{
      axios.post(url, newMessage)
      .then(response => {
        console.log(response.data)
      })
      .catch( error => {
        console.log("couldn't send message")
      });
    } catch (e) {
      console.log(e)
    }
  });
});

httpServer.listen(3000, "localhost", () => {
  console.log("go to http://localhost:3000");
});
