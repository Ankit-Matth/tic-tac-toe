import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import Board from '../../Board/Board';
import ScoreBoard from '../../ScoreBoard/ScoreBoard';
import Modal from '../../Modal/Modal';
import useSound from 'use-sound';
import winSound from '../../../Audio/win.mp3';
import tieSound from '../../../Audio/tie.mp3';
import btnPopUpSound from '../../../Audio/btnPopUp.mp3';
import newGameSound from '../../../Audio/newGame.wav'; 

// Custom Hook for Common States
const useCommonStates = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXPlaying, setIsXPlaying] = useState(true);
    const [xScore,setXScore] = useState(0);
    const [oScore,setOScore] = useState(0);
    const [tieScore,setTieScore] = useState(0);
    const [gameOver,setGameOver] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(false);
    const [playWin , { stop: stopWin }] = useSound(winSound);
    const [playTie , { stop: stopTie }] = useSound(tieSound);
    const [playBtnPopUp, { stop: stopBtnPopUp }] = useSound(btnPopUpSound);
    const [playNewGame, { stop: stopNewGame }] = useSound(newGameSound);
    const [playAgainClicked, setPlayAgainClicked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

    const nothing = () => {
      // nothing (just used to remove some runtime errors...)
    }
    
    const toggleSound = () => {
      setIsSoundOn(!isSoundOn);
    };

    const checkWinner = (updatedBoard)=>{
        for (let i = 0; i < WIN_CONDITIONS.length; i++) {
          const [x,y,z] = WIN_CONDITIONS[i]
    
          if (updatedBoard[x] && updatedBoard[x] === updatedBoard[y] && updatedBoard[y] === updatedBoard[z]) {
            return updatedBoard[x];
          }
        }
    }

    const reset = (currentWinner) => {
        setModalMessage(currentWinner);
        setIsXPlaying(isXPlaying);
        setTimeout(() => {
          setShowModal(true);
        }, 1200);
    };

    const commonOnPlayAgain = () => {
        stopTie();
        stopWin();
        if (isSoundOn) playNewGame();
        setShowModal(false);
        setBoard(Array(9).fill(null));
        setGameOver(false);
        setPlayAgainClicked(true)
        setTimeout(() => {
          setPlayAgainClicked(false)
        }, 500);
    }

    const handleGameResult = (updatedBoard) => {
        const winner = checkWinner(updatedBoard);
      
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
            setXScore(xScore + 1);
            stopBtnPopUp();
            if (isSoundOn) playWin();
            setGameOver(true);
            reset("X");
          } else {
            setOScore(oScore + 1);
            stopBtnPopUp();
            if (isSoundOn) playWin();
            setGameOver(true);
            reset("O");
          }
        }
      
        let allFilled = true;
      
        updatedBoard.forEach((item) => {
          if (item === null) {
            allFilled = false;
          }
        });
      
        if (allFilled && winner !== "X" && winner !== "O") {
          setTieScore(tieScore + 1);
          stopBtnPopUp();
          if (isSoundOn) playTie();
          setGameOver(true);
          reset("tie");
        }
    };

    const handlePlayerMoveSound = () => {
        stopNewGame()
        if (isSoundOn) playBtnPopUp();
    } 

    const commonBtnClick = (clickedBtnId) => {
        const updatedBoard = board.map((value,id) => {
            if (id === clickedBtnId) {
              handlePlayerMoveSound()
              return isXPlaying === true ? "X" : "O"
            } else {
              return value;
            }
        })
        setBoard(updatedBoard)
        setIsXPlaying(!isXPlaying)
          
        handleGameResult(updatedBoard);

        return updatedBoard
    }

    return {
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
    };
}

export {
    FontAwesomeIcon,
    faVolumeXmark, 
    faVolumeHigh, 
    Board, 
    ScoreBoard,
    Modal, 
    useCommonStates
};