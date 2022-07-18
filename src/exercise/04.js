// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../hooks'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
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
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    generateEmptyBoard(),
  )

  const [moves, setMoves] = useLocalStorageState('moves', [
    generateEmptyBoard(),
  ])

  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) return

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue

    setSquares(squaresCopy)
    setCurrentStep(previousState => previousState + 1)

    setMoves([...moves, squaresCopy])
  }

  function restart() {
    setSquares(generateEmptyBoard())
    setMoves([generateEmptyBoard()])
    setCurrentStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>
          {moves.map((move, i) => {
            const isCurrent = currentStep === i
            return (
              <li key={i}>
                <button
                  disabled={isCurrent}
                  onClick={() => {
                    setSquares(move)
                    setCurrentStep(i)
                  }}
                >
                  Go to {i === 0 ? 'game start' : `move #${i}`}{' '}
                  {isCurrent && '(current)'}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function generateEmptyBoard() {
  return Array(9).fill(null)
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
