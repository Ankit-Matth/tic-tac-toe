import React, { useState, useEffect } from 'react';
import './Button.css';

const Button = ({id,value,onClick,playing,playAgainClicked,gameOver,isRestricted,choosePlayerIcon,opponentIcon}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [playAgainClicked]);

  const handleClick = () => {
    if (!isRestricted && opponentIcon) {
      setClicked(true);
      onClick();
    } else {
      if (opponentIcon) {
        if (!value) {
          alert("Waiting for opponent's move")
        }
      } else {
        alert("Please wait, your opponent still hasn't started the game.")
      }
    }
  };

  return (
    <button className={`square ${value === 'X' ? 'x' : 'o'} ${!clicked && !value && !gameOver ? (playing && choosePlayerIcon === "cross") ? 'xHover' : 'oHover' : ''} ${value === null ? '' : 'animate-font'} ${isRestricted && !value && opponentIcon ? 'restricted' : ''}`} id={id} onClick={handleClick}> {value} </button>
  );
};

export default Button;
