import React from 'react'
import Button from '../Button/Button'
import './Board.css'

const Board = ({board,onClick,playing,playAgainClicked,gameOver,isRestricted,choosePlayerIcon,opponentIcon}) => {
  return (
    <div className='board'>
      {board.map((item, id) => (
        <div key={id}> 
          <Button id={id} value={item} onClick={() => item === null && onClick(id)} playing={playing} playAgainClicked={playAgainClicked} gameOver={gameOver} isRestricted={isRestricted} choosePlayerIcon={choosePlayerIcon} opponentIcon={opponentIcon} />
        </div>
      ))}
    </div>
  );
}

export default Board
