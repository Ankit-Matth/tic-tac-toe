const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:3000/"
});

const allUsers = {}; 
  
io.on("connection", (socket) => {
  console.log("User joined: "+socket.id)

  socket.on('request_to_play', (data) => {
    allUsers[socket.id] = {
      socket: socket,
      online: true,
      playing: false, 
      name: data.playerData.name,
      email: data.playerData.email,
      picture: data.playerData.picture,
      joinedRoomCode: data.playerData.joinedRoomCode,
    }
    
    const currentUser = allUsers[socket.id];
    
    let opponentPlayer; 
 
    for (const key in allUsers) {
        const user = allUsers[key]
        if (user.online && !user.playing && key !== socket.id && user.joinedRoomCode == currentUser.joinedRoomCode ) {
            opponentPlayer = user
            break; 
        }
    } 
 
    if (opponentPlayer) {
      opponentPlayer.socket.emit("OpponentFound", {
        opponent: {
          name: currentUser.name,
          email: currentUser.email,
          picture: currentUser.picture,
          joinedRoomCode: currentUser.joinedRoomCode,
        },
      });
      currentUser.socket.emit("OpponentFound", {
        opponent: {
          name: opponentPlayer.name,
          email: opponentPlayer.email,
          picture: opponentPlayer.picture,
          joinedRoomCode: opponentPlayer.joinedRoomCode,
        },
      });

      // Set both users as playing
      opponentPlayer.playing = true;
      currentUser.playing = true;

      // Store opponentId
      allUsers[socket.id].opponentId = opponentPlayer.socket.id;
      allUsers[opponentPlayer.socket.id].opponentId = socket.id;
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  socket.on('request_to_start', (data) => {
    const currentUser = allUsers[socket.id];
  
    if (currentUser && currentUser.opponentId) {
      const opponentPlayer = allUsers[currentUser.opponentId];
  
      if (opponentPlayer && opponentPlayer.socket) {
        opponentPlayer.socket.emit("GameStarted", {
          choosedIcon: data.choosePlayerIcon,  
        });
      } 
    } 
  });   
 
  socket.on('playerMoveFromClient', (data) => {
    const currentUser = allUsers[socket.id];
  
    if (currentUser && currentUser.opponentId) {
      const opponentPlayer = allUsers[currentUser.opponentId];
  
      if (opponentPlayer && opponentPlayer.socket) {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          serverBoard: data.clientBoard, 
          serverIsXPlaying: data.clientIsXPlaying 
        });  
      } 
    } 
  });

  socket.on('playAgainFromClient', () => {
    const currentUser = allUsers[socket.id];
  
    if (currentUser && currentUser.opponentId) {
      const opponentPlayer = allUsers[currentUser.opponentId];
  
      if (opponentPlayer && opponentPlayer.socket) {
        opponentPlayer.socket.emit("playAgainFromServer");  
      } 
    } 
  });
  
  socket.on('disconnect', function () {
    const current = allUsers[socket.id];
    if (current) {
      console.log('User disconnected: ' + socket.id);
      const opponentPlayer = allUsers[current.opponentId];
  
      if (opponentPlayer && opponentPlayer.socket) {
        opponentPlayer.playing = false
        delete opponentPlayer.opponentId;
        opponentPlayer.socket.emit("OpponentLeftTheMatch");  
      } 
      delete allUsers[socket.id];
    }
  });
});
 
const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});