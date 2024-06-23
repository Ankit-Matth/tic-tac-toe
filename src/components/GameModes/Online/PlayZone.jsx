import { useState , useEffect } from 'react';
import versusImg from '../../../images/versus.png';
import '../Modes.css';

import {
  FontAwesomeIcon,
  faVolumeXmark, 
  faVolumeHigh, 
  Board, 
  ScoreBoard, 
  Modal, 
  useCommonStates  // Custom hook for managing common states
} from '../Common/common';

function PlayZone({handleQuitGame, userData, opponentData, choosePlayerIcon, socket, opponentIcon}) {
  // Destructuring states and functions from useCommonStates hook
  const {
    board,
    setBoard,
    isXPlaying,
    setIsXPlaying,
    xScore,
    oScore,
    tieScore,
    gameOver,
    isSoundOn,
    playAgainClicked,
    showModal,
    modalMessage,
    nothing,
    toggleSound,
    commonOnPlayAgain,
    handleGameResult,
    handlePlayerMoveSound,
    commonBtnClick
  } = useCommonStates();

  // State to restrict player actions
  const [isRestricted, setIsRestricted] = useState(false);

  // Effect to set restriction based on player's icon and turn
  useEffect(() => {
    const isCross = choosePlayerIcon === "cross";
    setIsRestricted(isXPlaying ? !isCross : isCross);
  }, [board,choosePlayerIcon,isXPlaying]);

  // Effect to handle incoming player moves from the server
  useEffect(() => {
    const handlePlayerMoveFromServer = (data) => {
      handlePlayerMoveSound();
      setBoard(data.serverBoard);
      setIsXPlaying(data.serverIsXPlaying);
      handleGameResult(data.serverBoard);
    };
   
    socket?.on('playerMoveFromServer', handlePlayerMoveFromServer);
  
    return () => {
      socket?.off('playerMoveFromServer', handlePlayerMoveFromServer);
    };
  },);

  // Function to handle button clicks for making a move
  const handleBtnClick = (clickedBtnId) => {
    const updatedBoard = commonBtnClick(clickedBtnId);
    socket.emit('playerMoveFromClient', {
      clientBoard: updatedBoard,
      clientIsXPlaying: !isXPlaying,
    });
  }

  // Function to handle the play again action
  const onPlayAgain = () => {
    commonOnPlayAgain();
    socket?.emit('playAgainFromClient');
  };

  // Effect to handle play again requests from the server
  useEffect(() => {
    const handlePlayAgainFromServer = () => {
      commonOnPlayAgain();
    };
  
    socket?.on('playAgainFromServer', handlePlayAgainFromServer);
  
    return () => {
      socket?.off('playAgainFromServer', handlePlayAgainFromServer);
    };
  },);

  return (
    <div className="main">
        <div className="participantInfo">
            <div className="left">
                <img src={userData.picture} alt="Profile" />
                <h5>{userData.name}</h5>
            </div>
            <div className="middle">
                <img src={versusImg} alt="Profile" />
            </div>
            <div className="right">
                <img src={opponentData?.picture} alt="Profile" />
                <h5>{opponentData?.name}</h5>
            </div>
        </div>
      <Board board={board} onClick={gameOver === true ? nothing : handleBtnClick} playing={isXPlaying} playAgainClicked={playAgainClicked} gameOver={gameOver} isRestricted={isRestricted} choosePlayerIcon={choosePlayerIcon} opponentIcon={opponentIcon}/>
      <h4 className='playerTurn'>{isXPlaying ? (choosePlayerIcon === "cross" ? 'Your Turn' : "Waiting for opponent's move") : (choosePlayerIcon === "cross" ? "Waiting for opponent's move" : 'Your Turn')}</h4>
      <ScoreBoard xScore={xScore} oScore={oScore} tieScore={tieScore} playing={isXPlaying} topMargin={'0.8rem'}/>
      {showModal && <Modal message={modalMessage} onPlayAgain={onPlayAgain} choosePlayerIcon={choosePlayerIcon} isOnlineMode={true}/>}
      <div className="bottomBtns" style={{padding: '0px',marginTop: '0.8rem'}}>
            <button id="soundBtn" onClick={toggleSound}>{isSoundOn ? <FontAwesomeIcon icon={faVolumeHigh} style={{color: "#ffffff",}} /> : <FontAwesomeIcon icon={faVolumeXmark} style={{color: "#ffffff",}} />}</button>
            <button id="homeBtn" onClick={handleQuitGame}>Quit Game</button> 
        </div>
    </div> 
  );
}

export default PlayZone;
