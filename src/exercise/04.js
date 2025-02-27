// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import {useLocalStorageState} from "./../utils";

function Board({onClick, currentBoard}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {currentBoard[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)]);
  const [current, setCurrent] = useLocalStorageState('current', 0);

  const currentBoard = history[current];
  const nextValue = calculateNextValue(currentBoard);

  function selectSquare(square) {

    if (currentBoard[square] || calculateWinner(currentBoard)) {
      return;
    } else {
      const newHistory = history.slice(0, current+1)
      const newBoard = [...currentBoard];
      newBoard[square] = nextValue;
      setHistory([...newHistory, newBoard]);
      setCurrent(newHistory.length)
    }
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrent(0);
  }

  function displayAllMoves() {
    return(
      <ol>
        {history.map((move, index) => {
          return(
            <li key={index}>
              <button onClick={() => setCurrent(index)}>Go to move {index}</button>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} currentBoard={currentBoard} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{
          calculateStatus(
            calculateWinner(currentBoard),
            currentBoard, 
            calculateNextValue(currentBoard)
          )}
        </div>
        <ol>{displayAllMoves()}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
