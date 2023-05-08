/*----- constants -----*/
let cellState = {
  0: 'black',
  A: 'white'
}

let DIRECTIONS = {
  0: -1,
  1: 1,
  2: 1,
  3: -1
}

let SELECTOR_COLORS = {
  0: 'red',
  1: 'orange',
  2: 'yellow',
  3: 'blue',
  4: 'purple',
  5: 'brown',
  99: 'limegreen'
}

/*----- state variables -----*/
let board
let numOfAtoms = 3
let lastExit
let lastHit
let exitNo

/*----- cached elements  -----*/
const boardEl = document.getElementById('board')
const cellEls = document.querySelectorAll('#board > div')
const raySelEls = document.querySelectorAll('.ray-selector')
const newGameButton = document.querySelector('button')

/*----- functions -----*/
const checkSpace = (row, col) => {
  if (board[row][col] === 'A') {
    return 'HIT'
  } else {
    return 'EMPTY'
  }
}

const placeElectron = (selector) => {
  let entryRow
  let entryCol
  let entryDir
  if (selector.id.startsWith('top')) {
    entryRow = 0
    entryDir = 2
  } else if (selector.id.startsWith('bottom')) {
    entryRow = board.length - 1
    entryDir = 0
  } else if (selector.id.startsWith('left')) {
    entryCol = 0
    entryDir = 1
  } else if (selector.id.startsWith('right')) {
    entryCol = board[0].length - 1
    entryDir = 3
  }
  if (entryRow === undefined) {
    entryRow = parseInt(selector.id.charAt(selector.id.length - 1))
  } else if (entryCol === undefined) {
    entryCol = parseInt(selector.id.charAt(selector.id.length - 1))
  }
  console.log(entryRow, entryCol, entryDir)
  return [entryRow, entryCol, entryDir]
}

const checkBothDiagonals = (electronRow, electronCol, electronDir) => {
  let test1Row
  let test1Col
  let test2Row
  let test2Col
  if (electronDir % 2 === 1) {
    test1Col = electronCol + DIRECTIONS[electronDir]
    test1Row = electronRow - DIRECTIONS[electronDir]
    test2Col = electronCol + DIRECTIONS[electronDir]
    test2Row = electronRow + DIRECTIONS[electronDir]
  } else if (electronDir % 2 === 0) {
    test1Row = electronRow + DIRECTIONS[electronDir]
    test1Col = electronCol + DIRECTIONS[electronDir]
    test2Row = electronRow + DIRECTIONS[electronDir]
    test2Col = electronCol - DIRECTIONS[electronDir]
  }
  let test1Result = checkSpace(test1Row, test1Col)
  let test2Result = checkSpace(test2Row, test2Col)
  if (test1Result === 'HIT' && test2Result === 'HIT') {
    return '180'
  } else if (test1Result === 'HIT') {
    return 'TURN RIGHT'
  } else if (test2Result === 'HIT') {
    return 'TURN LEFT'
  } else {
    return 'CLEAR'
  }
}

const checkHit = (electronRow, electronCol, electronDir) => {
  let checkRow
  let checkCol
  if (electronDir % 2 === 1) {
    checkCol = electronCol + DIRECTIONS[electronDir]
    checkRow = electronRow
  } else if (electronDir % 2 === 0) {
    checkRow = electronRow + DIRECTIONS[electronDir]
    checkCol = electronCol
  }
  let status = checkSpace(checkRow, checkCol)
  return status
}

const checkLeaveEmitter = (status) => {
  if (status === 'TURN RIGHT' || status === 'TURN LEFT' || status === '180') {
    return 'RETURN TO EMIT'
  } else {
    return 'CLEAR'
  }
}

const checkExit = (row, col) => {
  if (
    row <= 0 ||
    row >= board.length - 1 ||
    col >= board.length - 1 ||
    col <= 0
  ) {
    return 'EXIT'
  } else {
    return 'NO EXIT'
  }
}

const stepForward = (electronRow, electronCol, electronDir) => {
  let newSpaceRow
  let newSpaceCol
  let newDir = electronDir
  let status
  if (electronDir % 2 === 1) {
    newSpaceRow = electronRow
    newSpaceCol = electronCol + DIRECTIONS[electronDir]
  } else if (electronDir % 2 === 0) {
    newSpaceRow = electronRow + DIRECTIONS[electronDir]
    newSpaceCol = electronCol
  }
  status = checkExit(newSpaceRow, newSpaceCol)
  if (status === 'EXIT') {
    lastExit = [electronRow, electronCol, electronDir]
    return
  }
  status = checkHit(newSpaceRow, newSpaceCol, newDir)
  if (status === 'HIT') {
    lastHit = [newSpaceRow, newSpaceCol, newDir]
    return
  }
  status = checkBothDiagonals(newSpaceRow, newSpaceCol, newDir)
  if (status === '180') {
    newDir = (newDir + 2) % 4
  } else if (status === 'TURN LEFT') {
    newDir = (newDir + 3) % 4
  } else if (status === 'TURN RIGHT') {
    newDir = (newDir + 1) % 4
  }
  stepForward(newSpaceRow, newSpaceCol, newDir)
}

const handleEnd = (reason, emitter, firstSpaceRow, firstSpaceCol) => {
  if (reason === 'HIT') {
    emitter.style.backgroundColor = SELECTOR_COLORS[0]
    emitter.innerText = 'H'
    return
  } else if (reason === 'IMM RETURN') {
    emitter.style.backgroundColor = SELECTOR_COLORS[99]
    emitter.innerText = 'R'
    return
  } else if (reason === 'EXIT') {
    if (lastExit[2] === 0 || lastExit[2] === 2) {
      if (
        firstSpaceCol === lastExit[1] &&
        Math.abs(firstSpaceRow - lastExit[0]) === 1
      ) {
        emitter.style.backgroundColor = SELECTOR_COLORS[99]
        emitter.innerText = 'R'
        return
      }
    } else if (lastExit[2] === 1 || lastExit[2] === 3) {
      if (
        firstSpaceRow === lastExit[0] &&
        Math.abs(firstSpaceCol - lastExit[1]) === 1
      ) {
        emitter.style.backgroundColor = SELECTOR_COLORS[99]
        emitter.innerText = 'R'
        return
      }
    }
    let exitID
    if (lastExit[2] === 0) {
      exitID = `top-${lastExit[1]}`
    } else if (lastExit[2] === 1) {
      exitID = `right-${lastExit[0]}`
    } else if (lastExit[2] === 2) {
      exitID = `bottom-${lastExit[1]}`
    } else if (lastExit[2] === 3) {
      exitID = `left-${lastExit[0]}`
    }
    let exitEl = document.getElementById(exitID)
    emitter.style.backgroundColor = SELECTOR_COLORS[exitNo]
    emitter.innerText = exitNo
    exitEl.style.backgroundColor = SELECTOR_COLORS[exitNo]
    exitEl.innerText = exitNo
    exitNo++
  }
}

const handleClick = (evt) => {
  let status
  lastExit = undefined
  lastHit = undefined
  if (evt.target.className !== 'ray-selector') {
    return
  }
  if (evt.target.innerText) {
    return
  }
  // Place atom in the opening cell.
  let firstSpace = placeElectron(evt.target)
  // Check for atom ahead.
  status = checkHit(firstSpace[0], firstSpace[1], firstSpace[2])
  if (status === 'HIT') {
    handleEnd('HIT', evt.target)
    return
  }
  status = checkBothDiagonals(firstSpace[0], firstSpace[1], firstSpace[2])
  status = checkLeaveEmitter(status)
  if (status === 'RETURN TO EMIT') {
    handleEnd('IMM RETURN', evt.target)
    return
  }
  stepForward(firstSpace[0], firstSpace[1], firstSpace[2])
  // Write handle exit condition to also cover return to emit
  if (lastExit !== undefined) {
    handleEnd('EXIT', evt.target, firstSpace[0], firstSpace[1])
  }
  if (lastHit !== undefined) {
    handleEnd('HIT', evt.target)
  }
}

const getRandLoc = () => {
  let randomRow = Math.floor(Math.random() * (board[0].length - 2) + 1)
  let randomCol = Math.floor(Math.random() * (board[0].length - 2) + 1)
  return [randomRow, randomCol]
}

const renderBoard = () => {
  board.forEach((rowArray, rowIdx) => {
    if (rowIdx !== 0 && rowIdx !== board.length - 1) {
      rowArray.forEach((cellVal, colIdx) => {
        if (colIdx !== 0 && colIdx < board.length - 1) {
          const cellId = `r${rowIdx}c${colIdx}`
          const divCell = document.getElementById(cellId)
          divCell.style.backgroundColor = cellState[cellVal]
        }
      })
    }
  })
}

const getRandomBoard = () => {
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
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
  //Runs itself again if the board's not right.
  if (boardNumAtoms > numOfAtoms) {
    getRandomBoard()
  }
}

const resetSelectors = () => {
  raySelEls.forEach((raySelEl) => {
    raySelEl.style.backgroundColor = 'green'
    raySelEl.innerText = ''
  })
}

//Rewrite this to accept multiple board forms, or be able to construct challenge boards.
const initBoard = () => {
  for (let i = 0; i < cellEls.length; i++) {
    cellEls[i].style.gridArea = cellEls[i].id
  }
  boardEl.style.gridTemplateAreas =
    "'. top-1 top-2 top-3 top-4 top-5 .' 'left-1 r1c1 r1c2 r1c3 r1c4 r1c5 right-1' 'left-2 r2c1 r2c2 r2c3 r2c4 r2c5 right-2' 'left-3 r3c1 r3c2 r3c3 r3c4 r3c5 right-3' 'left-4 r4c1 r4c2 r4c3 r4c4 r4c5 right-4' 'left-5 r5c1 r5c2 r5c3 r5c4 r5c5 right-5' '. bottom-1 bottom-2 bottom-3 bottom-4 bottom-5 .'"
}

const init = () => {
  getRandomBoard()
  renderBoard()
  initBoard()
  boardEl.style.visibility = 'visible'
  resetSelectors()
  exitNo = 1
}

/*----- event listeners -----*/
newGameButton.addEventListener('click', init)
boardEl.addEventListener('click', handleClick)
