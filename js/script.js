/*----- constants -----*/
let CELL_STATE = {
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
  0: 'var(--mainCol)',
  1: 'var(--oppCol)',
  2: 'var(--leftCol)',
  3: 'var(--rightCol)',
  4: 'var(--leftColMinusOne)',
  98: 'var(--rightColMinusOne)',
  99: 'var(--mainColPlusOne)'
}

let GUESS_BOARD_STATE = {
  0: 'black',
  1: 'var(--oppColMinusOne)',
  96: 'var(--mainCol)',
  97: 'var(--leftCol)',
  98: 'var(--rightCol)',
  99: 'var(--oppCol)'
}

/*----- state variables -----*/
let board
let guessBoard
let numOfAtoms = 4
let lastExit
let lastHit
let exitNo
let score
let boardDisabled = false
let soundOn = false
const wrongCost = 5
const rightReward = -5

/*----- cached elements  -----*/
const boardEl = document.getElementById('board')
const cellEls = document.querySelectorAll('#board > div')
const guessCellEls = document.querySelectorAll('#guess-board > div')
const raySelEls = document.querySelectorAll('.ray-selector')
const newGameButton = document.querySelector('#new-game')
const guessBoardEl = document.getElementById('guess-board')
const submitButton = document.getElementById('submit-guess')
const scoreEl = document.getElementById('score')
const audioButton = document.getElementById('audio-change')
const instructButton = document.getElementById('instructions-button')
const displayBox = document.getElementById('display-div')
const title = document.getElementById('title')
const hitBeep = new Audio('/audio/hitBuzz.wav')
const exitBeep = new Audio('/audio/exitBuzz.wav')
const correctBeep = new Audio('/audio/correctBeep.wav')
const wrongBeep = new Audio('/audio/wrongBeep.wav')

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
    emitter.style.backgroundColor = SELECTOR_COLORS[99]
    emitter.innerText = 'H'
    if (soundOn === true) {
      hitBeep.play()
    }
    return
  } else if (reason === 'IMM RETURN') {
    emitter.style.backgroundColor = SELECTOR_COLORS[98]
    emitter.innerText = 'R'
    if (soundOn === true) {
      exitBeep.play()
    }
    return
  } else if (reason === 'EXIT') {
    if (lastExit[2] === 0 || lastExit[2] === 2) {
      if (
        firstSpaceCol === lastExit[1] &&
        Math.abs(firstSpaceRow - lastExit[0]) === 1
      ) {
        emitter.style.backgroundColor = SELECTOR_COLORS[98]
        emitter.innerText = 'R'
        if (soundOn === true) {
          exitBeep.play()
        }
        return
      }
    } else if (lastExit[2] === 1 || lastExit[2] === 3) {
      if (
        firstSpaceRow === lastExit[0] &&
        Math.abs(firstSpaceCol - lastExit[1]) === 1
      ) {
        emitter.style.backgroundColor = SELECTOR_COLORS[98]
        emitter.innerText = 'R'
        if (soundOn === true) {
          exitBeep.play()
        }
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
    emitter.style.backgroundColor = SELECTOR_COLORS[exitNo % 5]
    emitter.innerText = exitNo
    exitEl.style.backgroundColor = SELECTOR_COLORS[exitNo % 5]
    exitEl.innerText = exitNo
    if (soundOn === true) {
      exitBeep.play()
    }
    exitNo++
  }
}

const handleRayClick = (selector) => {
  let status
  lastExit = undefined
  lastHit = undefined
  if (selector.innerText) {
    return
  }
  // Place atom in the opening cell.
  let firstSpace = placeElectron(selector)
  // Check for atom ahead.
  status = checkHit(firstSpace[0], firstSpace[1], firstSpace[2])
  if (status === 'HIT') {
    handleEnd('HIT', selector)
    return
  }
  status = checkBothDiagonals(firstSpace[0], firstSpace[1], firstSpace[2])
  status = checkLeaveEmitter(status)
  if (status === 'RETURN TO EMIT') {
    handleEnd('IMM RETURN', selector)
    return
  }
  stepForward(firstSpace[0], firstSpace[1], firstSpace[2])
  // Write handle exit condition to also cover return to emit
  if (lastExit !== undefined) {
    handleEnd('EXIT', selector, firstSpace[0], firstSpace[1])
  }
  if (lastHit !== undefined) {
    handleEnd('HIT', selector)
  }
  score += 2
  renderScore()
}

const getRandLoc = () => {
  let randomRow = Math.floor(Math.random() * (board[0].length - 2) + 1)
  let randomCol = Math.floor(Math.random() * (board[0].length - 2) + 1)
  return [randomRow, randomCol]
}

const renderGuessBoard = () => {
  guessBoard.forEach((rowArr, rowIdx) => {
    if (rowIdx !== 0 && rowIdx !== board.length - 1) {
      rowArr.forEach((cellVal, colIdx) => {
        if (colIdx !== 0 && colIdx < board.length - 1) {
          const cellId = `Gr${rowIdx}c${colIdx}`
          const divCell = document.getElementById(cellId)
          divCell.style.backgroundColor = GUESS_BOARD_STATE[cellVal]
          if (guessBoard[rowIdx][colIdx] === 99) {
            divCell.classList.add('hit')
          }
        }
      })
    }
  })
}

const getRandomBoard = () => {
  board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    raySelEl.style.backgroundColor = 'var(--mainColMinusOne)'
    raySelEl.innerText = ''
  })
}

const submitGuess = () => {
  let numToRun = guessBoard.length * guessBoard.length
  let scoreAdjust = 0
  let wrongGuesses = 0
  for (i = 0; i < numToRun; i++) {
    let curRow = Math.floor(i / guessBoard.length)
    let curCol = i % board.length
    if (
      curRow !== 0 &&
      curRow !== guessBoard.length - 1 &&
      curCol !== 0 &&
      curCol !== guessBoard.length - 1
    ) {
      if (guessBoard[curRow][curCol] === 1) {
        if (board[curRow][curCol] === 'A') {
          guessBoard[curRow][curCol] = 99
          scoreAdjust += rightReward
        } else if (board[curRow][curCol] === 0) {
          guessBoard[curRow][curCol] = 96
          scoreAdjust += wrongCost
          wrongGuesses++
        }
      }
    }
  }
  for (i = 0; i < numToRun; i++) {
    let curRow = Math.floor(i / guessBoard.length)
    let curCol = i % guessBoard.length
    if (
      curRow !== 0 &&
      curRow !== guessBoard.length - 1 &&
      curCol !== 0 &&
      curCol !== guessBoard.length - 1
    ) {
      if (board[curRow][curCol] === 'A') {
        if (guessBoard[curRow][curCol] !== 99) {
          guessBoard[curRow][curCol] = 97
          scoreAdjust += wrongCost
          wrongGuesses++
        }
      }
    }
  }
  if (wrongGuesses === 0 && soundOn === true) {
    correctBeep.play()
  } else if (soundOn === true) {
    wrongBeep.play()
  }
  boardDisabled = true
  renderGuessBoard()
  score += scoreAdjust
  renderScore()
  submitButton.disabled = true
}

const handleBoardClick = (evt) => {
  if (boardDisabled === true) {
    return
  }
  if (evt.target.className === 'ray-selector') {
    handleRayClick(evt.target)
    return
  }
  let guessLoc = evt.target.id
  let guessRow = guessLoc.charAt(2)
  let guessCol = guessLoc.charAt(4)
  guessBoard[guessRow][guessCol] = (guessBoard[guessRow][guessCol] + 1) % 2
  renderGuessBoard()
  if (guessBoard[guessRow][guessCol] === 1) {
    submitButton.disabled = false
  }
  renderScore()
}

const initGuessBoard = () => {
  guessBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
  for (let i = 0; i < guessCellEls.length; i++) {
    guessCellEls[i].style.gridArea = guessCellEls[i].id
  }
  // Did it this way so I can come back and make board size modular.
  guessBoardEl.style.gridTemplateAreas =
    "'. top-1 top-2 top-3 top-4 top-5 top-6 top-7 .' 'left-1 Gr1c1 Gr1c2 Gr1c3 Gr1c4 Gr1c5 Gr1c6 Gr1c7 right-1' 'left-2 Gr2c1 Gr2c2 Gr2c3 Gr2c4 Gr2c5 Gr2c6 Gr2c7 right-2' 'left-3 Gr3c1 Gr3c2 Gr3c3 Gr3c4 Gr3c5 Gr3c6 Gr3c7 right-3' 'left-4 Gr4c1 Gr4c2 Gr4c3 Gr4c4 Gr4c5 Gr4c6 Gr4c7 right-4' 'left-5 Gr5c1 Gr5c2 Gr5c3 Gr5c4 Gr5c5 Gr5c6 Gr5c7 right-5' 'left-6 Gr6c1 Gr6c2 Gr6c3 Gr6c4 Gr6c5 Gr6c6 Gr6c7 right-6' 'left-7 Gr7c1 Gr7c2 Gr7c3 Gr7c4 Gr7c5 Gr7c6 Gr7c7 right-7' '. bottom-1 bottom-2 bottom-3 bottom-4 bottom-5 bottom-6 bottom-7 .'"
  guessBoardEl.style.visibility = 'visible'
}

//Rewrite this to accept multiple board forms, or be able to construct challenge boards.

const renderScore = () => {
  if (boardDisabled === false) {
    let scoreMessage = ''
    let atomsLeft = numOfAtoms
    scoreMessage += `SCORE: ${score}`
    guessBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 1) {
          atomsLeft--
        }
      })
    })
    scoreMessage += `\nATOMS LEFT: ${atomsLeft}`
    scoreEl.innerText = scoreMessage
  } else if (boardDisabled === true) {
    scoreEl.innerText = `FINAL SCORE: ${score}`
    scoreEl.style.fontSize = `36px`
  }
}

const toggleSound = () => {
  if (soundOn === true) {
    soundOn = false
    audioButton.innerText = 'TURN SOUND ON'
  } else if (soundOn === false) {
    soundOn = true
    audioButton.innerText = 'TURN SOUND OFF'
  }
}

const init = () => {
  displayBox.style.visibility = 'hidden'
  title.style.visibility = 'visible'
  scoreEl.style.fontSize = '22px'
  boardDisabled = false
  getRandomBoard()
  initGuessBoard()
  renderGuessBoard()
  resetSelectors()
  exitNo = 1
  submitButton.disabled = true
  score = 0
  renderScore()
}

const openInstructions = () => {
  window.open('instructions.html')
}

/*----- event listeners -----*/
newGameButton.addEventListener('click', init)
guessBoardEl.addEventListener('click', handleBoardClick)
submitButton.addEventListener('click', submitGuess)
audioButton.addEventListener('click', toggleSound)
instructButton.addEventListener('click', openInstructions)
