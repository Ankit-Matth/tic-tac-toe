import React, { useState, useEffect } from 'react';
import './Button.css';

const Button = ({ id, value, onClick, playing,playAgainOrRestartClicked,gameOver }) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [playAgainOrRestartClicked]);

  const handleClick = () => {
    setClicked(true);
    onClick();
  };

  return (
    <button
      className={`square ${value === 'X' ? 'x' : 'o'} ${!clicked && !gameOver ? (playing) ? 'xHover' : 'oHover' : ''} ${value === null ? '' : 'animate-font'}`}
      id={id} onClick={handleClick}> {value} </button>
  );
};

export default Button;
