import React, { useState , useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import PlayZone from './PlayZone';
import '../Modes.css';

import { io } from 'socket.io-client';

function Online({ homePage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [joinedRoomCode, setJoinedRoomCode] = useState('');
  const [roomCodeError, setRoomCodeError] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [choosePlayerIcon, setChoosePlayerIcon] = useState('');
  const [opponentIcon, setOpponentIcon] = useState('');
  const [socket, setSocket] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [opponentLeftError, setOpponentLeftError] = useState('');

  // Function to create a new socket connection
  const createSocket = () => {
    return new Promise((resolve, reject) => {
      const newSocket = io('http://localhost:5345/', {
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        setSocket(newSocket);
        window.socket = newSocket;  // Store the socket on the window object for global access
        resolve(newSocket);
      });

      newSocket.on('connect_error', (err) => {
        reject(err);
      });
    });
  };

  // Emit request to start the game when player icon is chosen
  useEffect(() => {
    if (choosePlayerIcon) {
      socket.emit('request_to_start', {
        choosePlayerIcon
      });
    }
  }, [choosePlayerIcon,socket]);

  // Initialize the socket connection when the user joins a room
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        if (joinedRoomCode) {
          const newSocket = await createSocket();
          newSocket.emit('request_to_play', {
            playerData: {
              ...userData,
              joinedRoomCode: joinedRoomCode
            }
          });
        }
      } catch (err) {
        console.error('Failed to connect to socket:', err);
      }
    };

    initializeSocket();
  }, [joinedRoomCode, userData]);

  socket?.on('OpponentNotFound', () => {
    setOpponentData(null)
  });

  socket?.on('OpponentLeftTheMatch', () => {
    setOpponentData(null)
    setGameStarted(false)
    setChoosePlayerIcon('')
    setOpponentIcon('')
    setOpponentLeftError('Opponent left the room...')
    setTimeout(() => {
      setOpponentLeftError('');
    }, 4000);
  });

  socket?.on('OpponentFound', (data) => {
    setOpponentData(data.opponent)
    setOpponentLeftError('') 
    setRoomCodeError('')
  });

  socket?.on('GameStarted', (data) => {
    setGameStarted(true)
    setOpponentIcon(data.choosedIcon)
  });
  
  // Handle login data from Google OAuth
  const handleLoginData = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUserData({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    });
    setIsLoggedIn(true);
  };

  // Expose the handleLoginData function for Cypress testing
  if (window.Cypress) {
    window.handleLoginData = handleLoginData;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setRoomCode('');
    setJoinedRoom(false);
    setJoinedRoomCode('');
    setRoomCodeError('');
    socket?.disconnect();
    setSocket(null);
  };

  // Handle changes to the room code input field
  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim() === '') {
      setRoomCodeError('*Please enter a room code to join the room.');
      setTimeout(() => {
        setRoomCodeError('');
      }, 2500);
    } else {
      setJoinedRoom(true);
      setJoinedRoomCode(roomCode);
      setRoomCodeError('');
    }
  };

  const handleExitRoom = () => {
    socket?.disconnect();
    setJoinedRoom(false);
    setRoomCode('');
    setJoinedRoomCode('');
    setSocket(null);
    setOpponentData(null);
    setRoomCodeError('');
  }

  const handleQuitGame = () => {
    socket?.disconnect();
    setSocket(null);
    setJoinedRoom(false);
    setRoomCode('');
    setJoinedRoomCode('');
    setGameStarted(false);
    setChoosePlayerIcon('')
    setOpponentIcon('')
  }

  const handleStartGame = () => {
    if (opponentData) {
      setGameStarted(true);
    } else {
      setRoomCodeError('*Please wait for a opponent...');
      setTimeout(() => {
        setRoomCodeError('');
      }, 2500);
    }
  }

   // Render the UI for when the user has joined a room
  const renderRoomJoined = () => {
    return (
      <div className="room-joined">
        <h3>Room number: {joinedRoomCode}</h3>
        <h5>Participants</h5>
        <div className="participants">
          <div className="user">
            <div className='left'>
            <div className="pic"><img src={userData.picture} alt="Profile" /></div>
            <div className="info">
              <div className="name">{userData.name}</div>
              <div className="email">{userData.email}</div>
            </div>
            </div>
            <div className="role">
              (You)
            </div>
          </div>
          {opponentData &&(
             <div className="user" style={{marginTop: '0.8rem'}}>
              <div className="left">
              <div className="pic"><img src={opponentData.picture} alt="Profile" /></div>
               <div className="info">
                 <div className="name">{opponentData.name}</div>
                 <div className="email">{opponentData.email}</div>
               </div>
              </div>
               <div className="role">
                  (Opponent)
               </div>
              </div>
          )}
          {opponentLeftError && <p className="error-message" style={{fontSize: '1.4rem',margin: '1rem auto'}}>{opponentLeftError}</p>}
        </div>
        {roomCodeError && <p className="error-message" style={{fontSize: '1.2rem',margin: '0.9rem auto'}}>{roomCodeError}</p>}
        <button className='roomJoinedBtns' onClick={handleStartGame}>Start the Game</button>
        <button className='roomJoinedBtns' onClick={handleExitRoom}>Exit from Room</button>
        <button className='roomJoinedBtns' onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  // Render the UI when the user is logged in but has not joined a room
  const renderLoggedInContent = () => {
    return (
      <div className="user-info">
        <div>Hello <span>{userData.name}</span>,</div>
        <div>Welcome to your profile.</div>
        <p className='note'>Note: To play together, both you and your friend must enter the same room code.</p>
        <input type="text" value={roomCode} onChange={handleRoomCodeChange} placeholder="Enter a room code" autoFocus={true} />
        {roomCodeError && <p className="error-message">{roomCodeError}</p>}
        <button onClick={handleJoinRoom}>Join Room</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  // Render the UI for when the user is not logged in
  const renderLoginButton = () => {
    return (
      <div className="online-container">
        <h2>Welcome to Online Mode</h2>
        <p>To play online, you must sign in with your Google account.</p>
        <GoogleLogin width={190} onSuccess={(credentialResponse) => { handleLoginData(credentialResponse); }} onError={() => { console.log('Login Failed'); }}  />
        <button className="back-to-home" onClick={homePage}>
          Back to Home
        </button>
      </div>
    );
  };

  const handleChooseIcon = (icon) => {
    if (icon === "cross") {
      if (opponentIcon === "cross") {
        setRoomCodeError("Sorry, this has been selected by "+opponentData.name);
        setTimeout(() => {
          setRoomCodeError('');
        }, 2000);
      } else {
        setChoosePlayerIcon('cross')
      }
    } else if (icon === "circle") {
      if (opponentIcon === "circle") {
        setRoomCodeError("Sorry, this has been selected by "+opponentData.name);
        setTimeout(() => {
          setRoomCodeError('');
        }, 2000);
      } else {
        setChoosePlayerIcon('circle')
      }
    }
  }

   // Render the UI for choosing a player icon
  const renderChooseIcon = () => {
    return (
      <div className="overlay">
        <div className="box">
          <div className="content">
              <h4>Choose a icon:</h4>
              <div>
              <button className='cross' onClick={() => handleChooseIcon('cross')}>X</button>
              <button className='circle' onClick={() => handleChooseIcon('circle')}>O</button>
              </div>
              {opponentIcon && <p className="error-message small-error-message" style={{fontSize: '0.7rem !important'}}>{roomCodeError}</p>}
          </div>
        </div>
      </div>
    );
  };

  // Render the main UI based on the current state
  return (
    <>
      {gameStarted ? (
        choosePlayerIcon ? (
          <PlayZone handleQuitGame={handleQuitGame} userData={userData} opponentData={opponentData} choosePlayerIcon={choosePlayerIcon} socket={socket} opponentIcon={opponentIcon} />
        ) : (
          renderChooseIcon()
        )
      ) : (
        <>
        <div className="online-mode">
          {isLoggedIn && !joinedRoom ? renderLoggedInContent() : null}
          {joinedRoom ? renderRoomJoined() : null}
          {!isLoggedIn && !joinedRoom ? renderLoginButton() : null}
        </div>
        </>
      )}
    </>
  );
}

export default Online;
