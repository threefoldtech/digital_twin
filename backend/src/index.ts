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
import Chat from "./models/chat";
import Chats from "./models/chats";
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
// const io = socketio(httpServer)
// @todo fix cors in prod -> config
const io = socketio(httpServer, { cors: {
  origin: '*',
}})
app.use(cors(corsOptions))

let connections = new Connections([]);
// const dummycontact = new Contact("c2ef210a-f68c-44f4-98e3-a62e1d7d28e9", "Jason Parser", "localhost:3000");
let contacts: Array<Contact> = [];
let contactRequests: Array<Contact> = [];

let chats:Chats = new Chats();


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
  const returnChats = chats.getAcceptedChats()
  res.json(returnChats);
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
    //Flow to add contact request to contacts
    const id = req.query.id
    console.log("adding from requests to contacts: ", id)
    const index = contactRequests.findIndex(c=>c.id==id)
    contacts.push(contactRequests[index]);
    contactRequests.splice(index,1)
    //@ts-ignore
    const messages = chats.getMessagesFromId(id)
    //@ts-ignore
    chats.setChatToAccepted(id)
    res.json(messages)
    return
  }

  const con = req.body;
  const contact = new Contact(con.id, con.username, con.location);

  console.log(`Adding contact  ${contact.username}`);
  contacts.push(contact);

  const message:Message = con.message
  console.log(`creating chat`)
  console.log(message)
  chats.addChat(contact.id,[contact],false, message ,contact.username, true)

  const url = `http://${contact.location}/api/messageRequest`
  const data = {
    username:config.userid,
    location: `${config.userid}-chat`
  }
  console.log("sending to ",url)
  try{
    axios.post(
      url,
      data).then( () => {
        console.log("Send request to ", contact.location)
      }).catch((e)=>{
        console.log("couldnt send contact request")
      })
  }catch (e) {
    console.log("couldn't send contact request")
  }
  res.sendStatus(200);
});

// Should be externally availble
app.post("/api/messages", (req, res) => {
  // @ TODO check if valid
  const mes = req.body;

  let contact = contacts.find(c => c.username == mes.from)
  if(!contact){
    contact = contactRequests.find(c=> c.username == mes.from)

    if(!contact){
      res.sendStatus(404)
      return
    }
    return
  }
  const message = new Message(mes.from, mes.to, mes.body);
  console.log(`received new message from ${message.from}`);

  chats.sendMessage(contact.id, message);
  const data = {
    chatId: contact.id,
    message: mes
  }

  sendEventToConnectedSockets(io, connections, "message", data)
  console.log("<<<<< new message >>>>")

  res.sendStatus(200);
});

app.post("/api/messageRequest", (req,res)=>{
  const username = req.body.username
  const location = req.body.location

  if(!contactRequests.find(c=> c.location == location)){
      const id = uuidv4()
      const contact = new Contact(id, username, location);

      console.log("adding contact to contactrequest", contact )
      contactRequests.push(contact);

      console.log(`creating chat`)
      const addMessage:Message = {
        chatId: id,
        to: config.userid,
        body: `Request to connect received from ${username}`,
        from: username,
        timeStamp: new Date()
      }
      chats.addChat(contact.id, [contact], false, addMessage, contact.username, false)

      sendEventToConnectedSockets(io, connections, "connectionRequest", contact)
    }
  res.sendStatus(200)
})

io.on("connection", (socket: Socket) => {
  console.log(`${socket.id} connected`);
  connections.add(socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    connections.delete(socket.id);
  });

  socket.on("message", (messageData) => {
    console.log('new message')
    const newMessage:Message = messageData.message
    const chatId:string = messageData.chatId

    console.log(contacts)
    console.log(chatId)
    const receiver = contacts.find(c => c.id == chatId);
    if (!receiver) {
      console.log("receiver not found")
      return "receiver not found";
    }
    
    chats.sendMessage(receiver.id, newMessage);

    const url = `http://${receiver.location}/api/messages`
    console.log(`sending message ${ newMessage.body } to ${ url }`);

    connections.getConnections().forEach((connection: String) => {
      if (connection == socket.id){
        // this is me
        return
      }
      const data = {
        chatId: newMessage.chatId,
        message:newMessage
      } 
      io.to(connection).emit("message", data);
      console.log(`send message to ${connection}`);
    });
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
