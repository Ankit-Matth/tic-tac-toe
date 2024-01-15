import { useState } from 'react';
import './App.css';
import Board from './components/Board/Board';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';
import Modal from './components/Modal/Modal';
import useSound from 'use-sound';
import winSound from './Audio/win.mp3';
import tieSound from './Audio/tie.mp3';
import btnPopUpSound from './Audio/btnPopUp.mp3';
import newGameSound from './Audio/newGame.wav';

function App() {
  const [board,setBoard] = useState(Array(9).fill(null));
  const [isXPlaying,setIsXPlaying] = useState(true);
  const [xScore,setXScore] = useState(0);
  const [oScore,setOScore] = useState(0);
  const [tieScore,setTieScore] = useState(0);
  const [gameOver,setGameOver] = useState(false);

  const [playWin , { stop: stopWin }] = useSound(winSound);
  const [playTie , { stop: stopTie }] = useSound(tieSound);
  const [playBtnPopUp, { stop: stopBtnPopUp }] = useSound(btnPopUpSound);
  const [playNewGame, { stop: stopNewGame }] = useSound(newGameSound);

  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleBtnClick = (clickedBtnId) => {

    const updatedBoard = board.map((value,id) => {
      if (id === clickedBtnId) {
        stopNewGame()
        playBtnPopUp()
        return isXPlaying === true ? "X" : "O"
      } else {
        return value;
      }
    })
    setBoard(updatedBoard)
    setIsXPlaying(!isXPlaying)
    const winner = checkWinner(updatedBoard)

    const animateWinningCells = (winningCells) => {
      const resultArray = Array(updatedBoard.length).fill(null);

      winningCells.forEach((cell, index) => {
          resultArray[cell] = updatedBoard[cell];
      });

      setBoard(resultArray);
    };
    

    if (winner) {
      const winningCells = WIN_CONDITIONS.find(([x, y, z]) => {
        return (
          updatedBoard[x] && updatedBoard[x] === updatedBoard[y] && updatedBoard[y] === updatedBoard[z]
        );
      });
      animateWinningCells(winningCells);
      if (winner === "X") {
        setXScore(xScore+1)
        stopBtnPopUp()
        playWin()
        setGameOver(true)
        reset("X")
      } else {
        setOScore(oScore+1)
        stopBtnPopUp()
        playWin()
        setGameOver(true)
        reset("O")
      }
    }

    let allFilled = true

    updatedBoard.forEach((item) => {
      if (item === null) {
        allFilled = false;
      }
    });
    
    if (allFilled && winner !== "X" && winner !== "O") {
      setTieScore(tieScore+1)
      stopBtnPopUp()
      playTie()
      setGameOver(true)
      reset("tie")
    }
  }

  const checkWinner = (updatedBoard)=>{
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x,y,z] = WIN_CONDITIONS[i]

      if (updatedBoard[x] && updatedBoard[x] === updatedBoard[y] && updatedBoard[y] === updatedBoard[z]) {
        return updatedBoard[x];
      }
    }
  }

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const reset = (currentWinner) => {
    setModalMessage(currentWinner);
    setIsXPlaying(true);
    setTimeout(() => {
      setShowModal(true);
    }, 1200);
  };

  const [playAgainOrRestartClicked, setPlayAgainOrRestartClicked] = useState(false);

  const onPlayAgain = () => {
    stopTie()
    stopWin()
    playNewGame()
    setShowModal(false);
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setPlayAgainOrRestartClicked(true)
    setTimeout(() => {
      setPlayAgainOrRestartClicked(false)
    }, 500);
  };

  const onRestartGame = () => {
    stopTie()
    stopWin()
    playNewGame()
    setShowModal(false);
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setXScore(0);
    setOScore(0);
    setTieScore(0);
    setPlayAgainOrRestartClicked(true)
    setTimeout(() => {
      setPlayAgainOrRestartClicked(false)
    }, 500); 
  }

  const nothing = () => {
    // nothing (just used to remove some runtime errors...)
  }

  return (
    <div className="main">
      <h1>Tic Tac Toe</h1>
      <Board board={board} onClick={gameOver === true ? nothing : handleBtnClick} playing={isXPlaying} playAgainOrRestartClicked={playAgainOrRestartClicked} gameOver={gameOver}/>
      <ScoreBoard xScore={xScore} oScore={oScore} tieScore={tieScore} playing={isXPlaying}/>
      {showModal && <Modal message={modalMessage} onPlayAgain={onPlayAgain} onRestartGame={onRestartGame}/>}
    </div>
  );
}

export default App;
