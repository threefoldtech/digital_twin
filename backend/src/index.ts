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

const app = express();
const httpServer = http.createServer(app)
const io = socketio(httpServer)

let connections = new Connections([]);
const dummycontact = new Contact("Jason parser", "localhost:3000");
let contacts: Array<Contact> = [dummycontact];
let messages:Array<Message> = [];

// var corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200
// }

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

// app.use(cors(corsOptions))
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

app.get('api/healthcheck', async(req, res) => {
  res.sendStatus(200);
})

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.get("/api/contacts", (req, res) => {
  const resp = contacts.map((contact) => {
    return {
      name: contact.username
    };
  });
  res.json(resp);
});

app.post("/api/messages", (req, res) => {
  // @ TODO check if valid
  const mes = req.body;
  const message = new Message(mes.from, mes.to, mes.body);
  console.log(`received new message from ${message.from}`);

  // @TODO implement db here
  messages.push(message);

  connections.getConnections().forEach((connection: String) => {
    io.to(connection).emit("message", message);
    console.log(`send message to ${connection}`);
  });
  res.sendStatus(200);
});

app.post("/api/contacts", (req, res) => {
  // @ TODO check if valid
  const con = req.body;
  const contact = new Contact(con.username, con.location);
  console.log(`Adding contact  ${contact.username}`);

  // @TODO implement db here
  contacts.push(contact);

  res.sendStatus(200);
});

io.on("connection", (socket: Socket) => {
  console.log(`${socket.id} connected`);
  connections.add(socket.id);

  messages.forEach((message) => {
    socket.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    connections.delete(socket.id);
  });

  socket.on("message", (newMessage) => {
    console.log('new message')
    const receiver = contacts.find((c) => c.username == newMessage.to);
    if (!receiver) {
      console.log("receiver not found")
      return "receiver not found";
    }

    // @TODO implement db here
    messages.push(newMessage);

    const url = `http://${receiver.location}/api/messages`
    console.log(`sending message ${ newMessage.body } to ${ url }`);

    connections.getConnections().forEach((connection: String) => {
      if (connection == socket .id){
        // this is me
        return
      }
      io.to(connection).emit("message", newMessage);
      console.log(`send message to ${connection}`);
    });
    try{

      axios.post(url, newMessage)
      .then(response => {
        console.log(response.data)
        // console.log(response)
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
  console.log("go to http://localhost:3001");
});
