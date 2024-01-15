import React from 'react'
import './ScoreBoard.css'

const ScoreBoard = ({xScore,oScore,tieScore,playing}) => {
  return (
    <div className='scoreBoard'>
      <div className="forX" style={{ color: playing ? 'red' : 'black'}}>
        <div>X</div>
        <div>Score - {xScore}</div>
      </div>
      <div className="forO" style={{ color: playing ? 'black' : 'blue'}}>
        <div>O</div>
        <div>Score - {oScore}</div>
      </div>
      <div className="forDraw">
        <div>Draw</div>
        <div>Ties - {tieScore}</div>
      </div>
    </div>
  )
}

export default ScoreBoard
