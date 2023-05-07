/*----- constants -----*/
let cellState = {
  0: 'black',
  1: 'white'
}

/*----- state variables -----*/
let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
]
let numOfAtoms = 3

/*----- cached elements  -----*/
const boardEl = document.getElementById('board')
const cellEls = document.querySelectorAll('#board > div')
const raySelEls = document.querySelectorAll('.ray-selector')
const newGameButton = document.querySelector('button')

/*----- functions -----*/
const handleRayClick = (selector) => {}

const renderBoard = () => {
  board.forEach((rowArray, rowIdx) => {
    rowArray.forEach((cellVal, colIdx) => {
      const cellId = `r${rowIdx}c${colIdx}`
      const divCell = document.getElementById(cellId)
      divCell.style.backgroundColor = cellState[cellVal]
    })
  })
}

const handleClick = (evt) => {
  if (evt.target.className === 'ray-selector') {
    handleRayClick(selector)
  } else if (evt.target.className === 'cell') {
    console.log(evt.target.id)
  }
}

const getRandLoc = () => {
  let randomRow = Math.floor(Math.random() * board[0].length)
  while (randomRow === 0 || 7) {
    let randomRow = Math.floor(Math.random() * board[0].length)
  }
  let randomCol = Math.floor(Math.random() * board[0].length)
  while (randomRow === 0 || 7) {
    let randomRow = Math.floor(Math.random() * board[0].length)
  }
  return [randomRow, randomCol]
}

const getRandomBoard = () => {
  board = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
  for (i = 0; i < numOfAtoms; i++) {
    let randLoc = getRandLoc()
    board[randLoc[0]][randLoc[1]] = 1
  }
}

//Rewrite this to accept multiple board forms, or be able to construct challenge boards.

const initBoard = () => {
  for (let i = 0; i < cellEls.length; i++) {
    cellEls[i].style.gridArea = cellEls[i].id
  }
  boardEl.style.gridTemplateAreas =
    "'. top-0 top-1 top-2 top-3 top-4 .' 'left-0 r0c0 r0c1 r0c2 r0c3 r0c4 right-0' 'left-1 r1c0 r1c1 r1c2 r1c3 r1c4 right-1' 'left-2 r2c0 r2c1 r2c2 r2c3 r2c4 right-2' 'left-3 r3c0 r3c1 r3c2 r3c3 r3c4 right-3' 'left-4 r4c0 r4c1 r4c2 r4c3 r4c4 right-4' '. bottom-0 bottom-1 bottom-2 bottom-3 bottom-4 .'"
}

const init = () => {
  getRandomBoard()
  renderBoard()
  initBoard()
  boardEl.style.visibility = 'visible'
}

/*----- event listeners -----*/
newGameButton.addEventListener('click', init)
boardEl.addEventListener('click', handleClick)
