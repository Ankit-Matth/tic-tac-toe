import React from 'react';
import './Modal.css'; 

const Modal = ({ message,onPlayAgain,choosePlayerIcon,isOnlineMode}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          {isOnlineMode ? (
            message === "tie" ? (
              <>
                <h2>It's a tie!</h2>
                <h4>No one wins this round.</h4>
              </>
            ) : (
              (message === "X" && choosePlayerIcon === "cross") || (message === "O" && choosePlayerIcon === "circle") ? (
                <>
                  <h2>Congratulations!</h2>
                  <h4>You won the match!</h4>
                </>
              ) : (
                (message === "X" && choosePlayerIcon === "circle") || (message === "O" && choosePlayerIcon === "cross") ? (
                  <>
                    <h2>Better Luck Next Time!</h2>
                    <h4>You lost the match!</h4>
                  </>
                ) : null
              )
            )
          ) : (
            <>
              {message === "tie" ? <h6 style={{fontSize: '2.6rem'}}>Draw!</h6> : <h6 style={{fontSize: '2.6rem'}}>Winner!</h6>}
              <div>
                {message === "X" ? (
                  <button className='winnerX'>X</button>
                ) : message === "O" ? (
                  <button className='winnerO'>O</button>
                ) : (
                  <>
                    <button className='winnerX'>X</button>
                    <button className='winnerO'>O</button>
                  </>
                )}
              </div>
            </>
          )}
        <button className='modalBtn' onClick={onPlayAgain}>Play again</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
