/*----- constants -----*/
let cellState = {
  0: 'black',
  A: 'white'
}

let DIRECTIONS = {
  0: 'u',
  1: 'r',
  2: 'd',
  3: 'l'
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
const determineMove = (test1, test2, test3) => {
  if (test2 === 'ATOM') {
    return 'HIT'
  } else if (test1 === 'ATOM' && test3 === 'ATOM') {
    return '180'
  } else if (test1 === 'ATOM') {
    return 'BEND FROM 1'
  } else if (test3 === 'ATOM') {
    return 'BEND FROM 3'
  } else {
    return 'CLEAR'
  }
}

const takeStep = (electronRow, electronCol, electronDir) => {
  let exitStatus = false
  if (electronDir === 0) {
    if (electronRow === 0) {
      exitStatus = true
      return
    } else {
      electronRow--
    }
  } else if (electronDir === 1) {
    if (electronCol === board.length) {
      exitStatus = true
      return
    } else {
      electronCol++
    }
  } else if (electronDir === 2) {
    if (electronRow === board.length) {
      exitStatus = true
      return
    } else {
      electronRow++
    }
  } else if (electronDir === 3) {
    if (electronCol === 0) {
      exitStatus = true
      return
    } else {
      electronCol--
    }
  }
  console.log(exitStatus)
  return [electronRow, electronCol, exitStatus]
}

const handleCheckCell = (checkRow, checkCol) => {
  if (board[checkRow][checkCol] === 'A') {
    return 'ATOM'
  }
}

const handleCheckStep = (electronRow, electronCol, electronDir) => {
  console.log(`${electronRow}, ${electronCol}, ${electronDir}`)
  let test1
  let test2
  let test3
  let nextRow
  let nextCol
  if (electronDir === 0) {
    test1 = handleCheckCell(electronRow - 1, electronCol - 1)
    test2 = handleCheckCell(electronRow - 1, electronCol)
    test3 = handleCheckCell(electronRow - 1, electronCol + 1)
    nextStep = determineMove(test1, test2, test3)
  } else if (electronDir === 2) {
    test1 = handleCheckCell(electronRow + 1, electronCol + 1)
    test2 = handleCheckCell(electronRow + 1, electronCol)
    test3 = handleCheckCell(electronRow + 1, electronCol - 1)
    nextStep = determineMove(test1, test2, test3)
  } else if (electronDir === 3) {
    if (electronRow === 0) {
      test1 = handleCheckCell(electronRow + 1, electronCol - 1)
      test2 = handleCheckCell(electronRow, electronCol - 1)
      console.log(determineMove(test1, test2, test3))
    } else if (electronRow === board.length - 1) {
      test2 = handleCheckCell(electronRow, electronCol - 1)
      test3 = handleCheckCell(electronRow - 1, electronCol - 1)
      nextStep = determineMove(test1, test2, test3)
    } else {
      test1 = handleCheckCell(electronRow - 1, electronCol - 1)
      test2 = handleCheckCell(electronRow, electronCol - 1)
      test3 = handleCheckCell(electronRow + 1, electronCol - 1)
      nextStep = determineMove(test1, test2, test3)
    }
  } else if (electronDir === 1) {
    if (electronRow === 0) {
      test2 = handleCheckCell(electronRow, electronCol - 1)
      test3 = handleCheckCell(electronRow + 1, electronCol - 1)
      nextStep = determineMove(test1, test2, test3)
    } else if (electronRow === board.length - 1) {
      test1 = handleCheckCell(electronRow - 1, electronCol - 1)
      test2 = handleCheckCell(electronRow, electronCol - 1)
      nextStep = determineMove(test1, test2, test3)
    } else {
      test1 = handleCheckCell(electronRow - 1, electronCol + 1)
      test2 = handleCheckCell(electronRow, electronCol + 1)
      test3 = handleCheckCell(electronRow + 1, electronCol + 1)
      nextStep = determineMove(test1, test2, test3)
    }
  }
  if (nextStep === 'HIT') {
    console.log('HIT')
    return
  } else if (nextStep === 'BEND FROM 1') {
    electronDir++
  } else if (nextStep === 'BEND FROM 3') {
    electronDir--
  } else if (nextStep === '180') {
    electronDir += 2
  } else if (nextStep === 'CLEAR') {
    console.log('CLEAR')
    let nextStepLoc = takeStep(electronRow, electronCol, electronDir)
    if (nextStepLoc[2] === true) {
      console.log('EXITED')
      return
    }
    nextRow = nextStepLoc[0]
    nextCol = nextStepLoc[1]
  }
  console.log(nextStep)
  handleCheckStep(nextRow, nextCol, electronDir)
}

// handleEmission handles the first step, which has different rules, then calls handleStep, which runs recursively until it hits the edge.
const handleEmission = (electronRow, electronCol, electronDir) => {
  let status
  let nextCell
  if (board[electronRow][electronCol] === 'A') {
    status = 'HIT'
  } else {
    if (electronDir === 0 || electronDir === 2) {
      let result1 = handleCheckCell(electronRow, electronCol - 1)
      let result2 = handleCheckCell(electronRow, electronCol + 1)
      if (result1 === 'ATOM' || result2 === 'ATOM') {
        status = 'RETURN'
      } else {
        status = 'CLEAR'
      }
    } else if (electronDir === 3 || electronDir === 1) {
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
      if (result1 === 'ATOM' || result2 === 'ATOM') {
        status = 'RETURN'
      } else {
        status = 'CLEAR'
      }
    }
  }
  if (status === 'HIT') {
    console.log(status)
    return
  } else if (status === 'RETURN') {
    console.log(status)
    return
  } else if (status === 'CLEAR') {
    nextCell = takeStep(electronRow, electronCol)
    handleCheckStep(nextCell[0], nextCell[1], electronDir)
  }
}

// The ray click determines what cell to start on, then passes it on to the HandleEmission function.
const handleRayClick = (selector) => {
  let electronRow
  let electronCol
  let electronDir
  if (selector.includes('top')) {
    electronRow = 0
    electronCol = Number(selector.charAt(selector.length - 1))
    electronDir = 2
  } else if (selector.includes('bottom')) {
    electronRow = board.length - 1
    electronCol = Number(selector.charAt(selector.length - 1))
    electronDir = 0
  } else if (selector.includes('left')) {
    electronCol = 0
    electronRow = Number(selector.charAt(selector.length - 1))
    electronDir = 1
  } else if (selector.includes('right')) {
    electronCol = board.length - 1
    electronRow = Number(selector.charAt(selector.length - 1))
    electronDir = 3
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
