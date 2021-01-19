const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const faker = require("faker");

var Users = require("./users");
var User = require("./user");
var Message = require("./message");
var users = new Users([
  { name: "Jason Parser", socket: "pyhAJgy5mY_3wsemAAAD", streams: {} },
  { name: "Queue Tea", socket: "L7l6d47DtXC_4IN5AAAF", streams: {} },
  { name: "ivan", socket: "pyhAJgy5mY_3wsemAAAD", streams: {} },
  { name: "tobias", socket: "pyhAJgy5mY_3wsemAAAD", streams: {} },
]);

var delayedMessages = [];
var delayedSignal = [];

app.get("/contacts", (req, res) => {
  contacts = users.getUsers().map((username) => {
    return {
      name: username,
      message: faker.lorem.sentence(),
      date: faker.date.past(),
    };
  });
  res.json(contacts);
});

io.on("connection", (socket) => {
  var user = null;
  console.log(``);
  console.log("Someone connected");
  console.log(``);

  // User fills in username
  socket.on("identify", (newUser) => {
    console.log(``);
    console.log(`>> identify`);
    user = new User(newUser.name, socket.id);
    console.log(`${new Date()}: ${newUser.name} is connected`);
    users.addOrUpdate(user);
    console.log(`<< identify`);
    console.log(``);

    console.log("trying delayedMessages");
    console.log(delayedMessages);
    delayed = delayedMessages.filter(
      (message) => message.from == user.name || message.to == user.name
    );
    console.log(delayed);
    delayed.forEach((message) => {
      io.to(user.socket).emit("message", message);
    });
  });

  socket.on("disconnect", () => {
    if (user) {
      users.setUserOffline(user.name);
      console.log("user disconnected");
    }

    socket.emit("signal", { type: "userStatus", user: {
      name: user.name,
      isOffline: true,
      lastSeen: new Date()
    } });
  });

  socket.on("message", (newMessage) => {
    console.log(``);
    console.log(`>> message`);
    console.log(newMessage);
    if (user) {
      const message = new Message(user.name, newMessage.to, newMessage.body);
      console.log(
        `${message.time}: New message from ${user.name}: ${JSON.stringify(
          message
        )}`
      );
      const correspondent = users.getUserByName(message.to);
      console.log(correspondent);
      delayedMessages.push(message);
      if (correspondent.isOffline) {
        console.log("correspondent was offline");
        console.log("here are the delayed messages", delayedMessages);
      } else {
        console.log("correspondent was online");
        io.to(correspondent.socket).emit("message", message);
      }
    } else {
      console.log("user is not set");
    }
    console.log(`<< message`);
    console.log(``);
  });
  // socket.on('signal', newMessage => {
  //   console.log(``)
  //   console.log(`>> signal`)
  //   if (user) {
  //     console.log(`============= ${JSON.stringify(user)} ======== ${JSON.stringify(newMessage)}`)
  //     const message = new Message(user.name, newMessage.to, newMessage.body, newMessage.type, newMessage.channel)
  //     console.log(`New signal from ${JSON.stringify(user)}: ${JSON.stringify(message)}`)
  //     const correspondent = users.getUserByName(message.to)
  //     console.log(`Found correspondent ${JSON.stringify(correspondent)}`)
  //     if (correspondent) {
  //       if (correspondent.isOffline) delayedSignal.push(message)
  //       else io.to(correspondent.socket).emit('signal', message)
  //     } else {
  //       console.log('Correspondent is not found?')
  //     }
  //   }
  //   console.log(`<< signal`)
  //   console.log(``)
  // })
});

httpServer.listen(3000, "localhost", () => {
  console.log("go to http://localhost:3000");
});
