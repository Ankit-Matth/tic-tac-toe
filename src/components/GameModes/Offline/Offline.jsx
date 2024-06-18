import '../Modes.css';

import {
  FontAwesomeIcon,
  faVolumeXmark, 
  faVolumeHigh, 
  Board, 
  ScoreBoard, 
  Modal, 
  useCommonStates
} from '../Common/common';

function Offline({homePage}) {
  const {
    board,
    isXPlaying,
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
    commonBtnClick
  } = useCommonStates();
  
  const handleBtnClick = (clickedBtnId) => {
    // Call commonBtnClick and ignore its return value
    commonBtnClick(clickedBtnId)
  }

  const onPlayAgain = () => {
    commonOnPlayAgain();
  };

  return (
    <div className="main">
      <h1>Tic Tac Toe</h1>
      <Board board={board} onClick={gameOver === true ? nothing : handleBtnClick} playing={isXPlaying} playAgainClicked={playAgainClicked} gameOver={gameOver} isRestricted={false} choosePlayerIcon={'cross'} opponentIcon={'circle'}/>
      <ScoreBoard xScore={xScore} oScore={oScore} tieScore={tieScore} playing={isXPlaying} topMargin={'2rem'}/>
      {showModal && <Modal message={modalMessage} onPlayAgain={onPlayAgain} choosePlayerIcon={'cross'} isOnlineMode={false}/>}
      <div className="bottomBtns">
            <button id="soundBtn" onClick={toggleSound}>{isSoundOn ? <FontAwesomeIcon icon={faVolumeHigh} style={{color: "#ffffff",}} /> : <FontAwesomeIcon icon={faVolumeXmark} style={{color: "#ffffff",}} />}</button>
            <button id="homeBtn" onClick={homePage}>Home</button> 
        </div>
    </div>
  );
}

export default Offline;
