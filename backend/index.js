const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const bodyParser = require("body-parser");
const axios = require('axios');
const cors = require('cors')

const Message = require("./message");
const Connections = require("./connections");
const Contact = require("./contact");

let connections = new Connections([]);
dummycontact = new Contact("Jason parser", "localhost:3000");
let contacts = [dummycontact];
let messages = [];

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  mes = req.body;
  const message = new Message(mes.from, mes.to, mes.body);
  console.log(`received new message from ${message.from}`);

  // @TODO implement db here
  messages.push(message);


  connections.getConnections().forEach((connection) => {
    io.to(connection).emit("message", message);
    console.log(`send message to ${connection}`);
  });
  res.sendStatus(200);
});

app.post("/api/contacts", (req, res) => {
  // @ TODO check if valid
  con = req.body;
  const contact = new Contact(con.username, con.location);
  console.log(`Adding contact  ${contact.username}`);

  // @TODO implement db here
  contacts.push(contact);

  res.sendStatus(200);
});

io.on("connection", (socket) => {
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
    receiver = contacts.find((c) => c.username == newMessage.to);
    if (!receiver) {
      console.log("receiver not found")
      return "receiver not found";
    }

    // @TODO implement db here
    messages.push(newMessage);

    const url = `http://${receiver.location}/api/messages`
    console.log(`sending message ${ newMessage.body } to ${ url }`);
    
    connections.getConnections().forEach((connection) => {
      if (connection == socket .id){
        // this is me
        return
      }
      io.to(connection).emit("message", newMessage);
      console.log(`send message to ${connection}`);
    });

    axios.post(url, newMessage)
      .then(response => {
        console.log(response.data)
        // console.log(response)
      });
  });
});

httpServer.listen(3000, "localhost", () => {
  console.log("go to http://localhost:3000");
});
