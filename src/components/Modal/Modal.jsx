import React from 'react';
import './Modal.css'; 

const Modal = ({ message,onPlayAgain,onRestartGame}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          {message === "tie" ? <h2>Draw!</h2> : <h2 style={{fontSize: '2.6rem'}}>Winner!</h2>}
          <div>
            {message === "X" ? 
            <button className='winnerX' style={{marginBottom: '0.5rem'}}>X</button> : 
            message === "O" ? <button className='winnerO' style={{marginBottom: '0.5rem'}}>O</button> : 
            <>
            <button className='winnerX'>X</button>
            <button className='winnerO'>O</button>
            </>}
          </div>
          <button className='modalBtns' onClick={onPlayAgain}>Play again</button>
          <button className='modalBtns' onClick={onRestartGame}>Restart</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
