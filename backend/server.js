const Express = require("express");
const HTTP = require("http");
const IO = require("socket.io");
const cors = require("cors");
const MySql = require("mysql");
const { saveMatch } = require("./db");

const Application = Express();
const HttpServer = HTTP.Server(Application);
const io = IO(HttpServer, { cors: { origin: "*" }});
const db = MySql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "scf"
});


Application.use(cors());

var clients = 0;

let clientsObjects = [];
let clientsChoices = [];

async function ResolveMatch(){
  let win = { "paper" : "stone", "stone" : "scissors", "scissors" : "paper" };
  let user1 = clientsChoices[0];
  let user2 = clientsChoices[1];
  let user1Object = clientsObjects[0];
  let user2Object = clientsObjects[1];

  let winner = "";

  if (user1.choice === user2.choice){
    io.sockets.emit("Tie", { message: "Avete scelto la stessa carta" });
  } else if (win[user1.choice] === user2.choice){
    user1Object.object.emit("Result", { result: true, message: "Hai vinto!", adChoice: user2.choice });
    user2Object.object.emit("Result", { result: false, message: "Hai perso!", adChoice: user1.choice });
    winner = user1Object.username
  } else {
    user1Object.object.emit("Result", { result: false, message: "Hai perso!", adChoice: user2.choice });
    user2Object.object.emit("Result", { result: true, message: "Hai vinto!", adChoice: user1.choice });
    winner = user2Object.username;
  }

  let values = {
    user1: user1Object.username,
    user2: user2Object.username,
    result: {
      user1Choice: user1.choice,
      user2Choice: user2.choice,
      winner: winner
    }
  }

  console.log(values);

  let res = await saveMatch(values, db);

  user1.choice = null;
  user2.choice = null;
}

io.on('connection', (socket) => {
  if (clients < 2) {
    clients++;

    socket.on('disconnect', function() {
      clientsChoices.forEach((elem, index) => { if (elem.id === socket.id){ clientsChoices.splice(index, 1)}});
      clientsObjects.forEach((elem, index) => { if (elem.id === socket.id){ clientsObjects.splice(index, 1)}});
      clients--;

      io.sockets.emit("ClientDisconnected", { id: socket.id, message: "L'avversario si è disconnesso dalla partita" });
    });

    socket.on("Selected", (args) => {
      
      let selectedClient = null;

      for (let i = 0; i < clientsChoices.length; i++){
        if (clientsChoices[i].id === args.id){
          clientsChoices[i].choice = args.message;
        } else {
          selectedClient = clientsObjects[i].object;
        }
      }
      selectedClient.emit("VerSelected", "L'avversario ha fatto la sua scelta");
      if (clientsChoices[0].choice !== null && clientsChoices[1].choice !== null){
        ResolveMatch();
      }
    });

    socket.on("Data", (args) => {
      clientsObjects.forEach((elem, index) => {
        if (elem.id === socket.id) {
          elem.username = args;
        }
      })
      io.sockets.emit("data", args);
    });

    clientsChoices.push({ id: socket.id, choice: null });
    clientsObjects.push({ id: socket.id, object: socket});
  } else {
    socket.emit("Error", { message: "Too many clients" });
    
    socket.disconnect();
  }
});

HttpServer.listen(8080, function() {
  console.log('listening on localhost:8080');
});
