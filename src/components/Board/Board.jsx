import React from 'react'
import './Board.css'
import Button from '../Button/Button'

const Board = ({board,onClick,playing,playAgainOrRestartClicked,gameOver}) => {
  return (
    <div className='board'>
      {board.map((item, id) => (
        <div key={id}>
          <Button id={id} value={item} onClick={() => item === null && onClick(id)} playing={playing} playAgainOrRestartClicked={playAgainOrRestartClicked} gameOver={gameOver} />
        </div>
      ))}
    </div>
  );
}

export default Board
