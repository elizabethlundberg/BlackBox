/*----- constants -----*/
let cellState = {
  0: 'black',
  A: 'white'
}

/*----- state variables -----*/
let board = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]
let numOfAtoms = 3

/*----- cached elements  -----*/
const boardEl = document.getElementById('board')
const cellEls = document.querySelectorAll('#board > div')
const raySelEls = document.querySelectorAll('.ray-selector')
const newGameButton = document.querySelector('button')

/*----- functions -----*/
const handleCheckCell = (checkRow, checkCol) => {
  if (board[checkRow][checkCol] === 'A') {
    return 'RETURN'
  }
}

const handleEmission = (electronRow, electronCol, electronDir) => {
  if (board[electronRow][electronCol] === 'A') {
    console.log('HIT')
    return
  }
  if (electronDir === 'u' || electronDir === 'd') {
    let result1 = handleCheckCell(electronRow, electronCol - 1)
    let result2 = handleCheckCell(electronRow, electronCol + 1)
    if (result1 === 'RETURN' || result2 === 'RETURN') {
      console.log('RETURN')
    } else {
      console.log('CLEAR PATH')
    }
  }
  if (electronDir === 'l' || electronDir === 'r') {
    let result1
    let result2
    if (electronRow === 0) {
      result2 = handleCheckCell(electronRow + 1, electronCol)
    } else if (electronRow === board.length - 1) {
      result1 = handleCheckCell(electronRow - 1, electronCol)
    } else {
      result1 = handleCheckCell(electronRow - 1, electronCol)
      result2 = handleCheckCell(electronRow + 1, electronCol)
    }
    if (result1 === 'RETURN' || result2 === 'RETURN') {
      console.log('RETURN')
    } else {
      console.log('CLEAR PATH')
    }
  }
}

const ponderAdjacent = (electronRow, electronCol, electronDir) => {
  if (board[electronRow][electronCol] === 'A') {
    console.log('HIT')
  }
  if (electronDir === 'u' || electronDir === 'd') {
    console.log('Got here')
    let adjCol1 = electronCol - 1
    let adjCol2 = electronCol + 1
    if (board[electronRow][adjCol1] === 'A') {
      console.log('RETURN')
    }
  }
}

const handleRayClick = (selector) => {
  let electronRow
  let electronCol
  let electronDir
  if (selector.includes('top')) {
    electronRow = 0
    electronCol = Number(selector.charAt(selector.length - 1))
    electronDir = 'd'
  } else if (selector.includes('bottom')) {
    electronRow = board.length - 1
    electronCol = Number(selector.charAt(selector.length - 1))
    electronDir = 'u'
  } else if (selector.includes('left')) {
    electronCol = 0
    electronRow = Number(selector.charAt(selector.length - 1))
    electronDir = 'r'
  } else if (selector.includes('right')) {
    electronCol = board.length - 1
    electronRow = Number(selector.charAt(selector.length - 1))
    electronDir = 'l'
  }
  handleEmission(electronRow, electronCol, electronDir)
}

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
    handleRayClick(evt.target.id)
  } else if (evt.target.className === 'cell') {
    console.log(evt.target.id)
  }
}

const getRandLoc = () => {
  let randomRow = Math.floor(Math.random() * board[0].length)
  let randomCol = Math.floor(Math.random() * board[0].length)
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
    if (board[randLoc[0]][randLoc[1]] === 'A') {
      getRandomBoard()
    }
    board[randLoc[0]][randLoc[1]] = 'A'
  }
  // Check the number of atoms - it likes to make 4 for some reason.
  let boardNumAtoms = 0
  board.forEach((row) => {
    row.forEach((el) => {
      if (el === 'A') {
        boardNumAtoms++
      }
    })
  })
  if (boardNumAtoms > numOfAtoms) {
    getRandomBoard()
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
