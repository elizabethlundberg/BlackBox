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

// /*----- functions -----*/
// const checkForExit = (electronRow, electronCol, electronDir) => {
//   if (
//     (electronDir === 0 && electronRow === 0) ||
//     (electronDir === 1 && electronCol === board[0].length - 1) ||
//     (electronDir === 2 && electronCol === board.length - 1) ||
//     (electronDir === 3 && electronCol === 0)
//   ) {
//     return 'EXITED'
//   }
// }

// const determineMove = (test1, test2, test3) => {
//   if (test2 === 'ATOM') {
//     return 'HIT'
//   } else if (test1 === 'ATOM' && test3 === 'ATOM') {
//     return '180'
//   } else if (test1 === 'ATOM') {
//     return 'BEND FROM 1'
//   } else if (test3 === 'ATOM') {
//     return 'BEND FROM 3'
//   } else {
//     return 'CLEAR'
//   }
// }

// const takeStep = (electronRow, electronCol, electronDir) => {
//   if (electronDir === 0) {
//     electronRow--
//   } else if (electronDir === 1) {
//     electronCol++
//   } else if (electronDir === 2) {
//     electronRow++
//   } else if (electronDir === 3) {
//     electronCol--
//   }
//   return [electronRow, electronCol]
// }

// const handleCheckCell = (checkRow, checkCol) => {
//   if (board[checkRow][checkCol] === 'A') {
//     return 'ATOM'
//   }
//   return 'EMPTY'
// }

// // For later or tomorrow: MOVE TURN CHECKING ABOVE THE REST DUMMY

// const handleCheckStep = (electronRow, electronCol, electronDir) => {
//   let exitStatus = checkForExit(electronRow, electronCol, electronDir)
//   if (exitStatus === 'EXITED') {
//     console.log('EXITED')
//     return
//   }
//   let test1
//   let test2
//   let test3
//   let nextRow
//   let nextCol
//   let nextStep
//   if (electronDir === 0) {
//     console.log(electronRow, electronCol)
//     test1 = handleCheckCell(electronRow - 1, electronCol - 1)
//     test2 = handleCheckCell(electronRow - 1, electronCol)
//     test3 = handleCheckCell(electronRow - 1, electronCol + 1)
//     nextStep = determineMove(test1, test2, test3)
//   } else if (electronDir === 2) {
//     console.log(electronRow, electronCol)
//     test1 = handleCheckCell(electronRow + 1, electronCol + 1)
//     test2 = handleCheckCell(electronRow + 1, electronCol)
//     test3 = handleCheckCell(electronRow + 1, electronCol - 1)
//     nextStep = determineMove(test1, test2, test3)
//   } else if (electronDir === 3) {
//     if (electronRow === 0) {
//       console.log(electronRow, electronCol)
//       test1 = handleCheckCell(electronRow + 1, electronCol - 1)
//       test2 = handleCheckCell(electronRow, electronCol - 1)
//       console.log(determineMove(test1, test2, test3))
//     } else if (electronRow === board.length - 1) {
//       console.log(electronRow, electronCol)
//       test2 = handleCheckCell(electronRow, electronCol - 1)
//       test3 = handleCheckCell(electronRow - 1, electronCol - 1)
//       nextStep = determineMove(test1, test2, test3)
//     } else {
//       console.log(electronRow, electronCol)
//       test1 = handleCheckCell(electronRow - 1, electronCol - 1)
//       test2 = handleCheckCell(electronRow, electronCol - 1)
//       test3 = handleCheckCell(electronRow + 1, electronCol - 1)
//       nextStep = determineMove(test1, test2, test3)
//     }
//   } else if (electronDir === 1) {
//     if (electronRow === 0) {
//       console.log(electronRow, electronCol)
//       test2 = handleCheckCell(electronRow, electronCol - 1)
//       test3 = handleCheckCell(electronRow + 1, electronCol - 1)
//       nextStep = determineMove(test1, test2, test3)
//     } else if (electronRow === board.length - 1) {
//       console.log(electronRow, electronCol)
//       test1 = handleCheckCell(electronRow - 1, electronCol - 1)
//       test2 = handleCheckCell(electronRow, electronCol - 1)
//       nextStep = determineMove(test1, test2, test3)
//     } else {
//       console.log(electronRow, electronCol)
//       test1 = handleCheckCell(electronRow - 1, electronCol + 1)
//       test2 = handleCheckCell(electronRow, electronCol + 1)
//       test3 = handleCheckCell(electronRow + 1, electronCol + 1)
//       nextStep = determineMove(test1, test2, test3)
//     }
//   }
//   if (nextStep === 'HIT') {
//     console.log('HIT')
//     return
//   } else if (nextStep === 'BEND FROM 1') {
//     electronDir++
//     console.log('TURNING LEFT')
//   } else if (nextStep === 'BEND FROM 3') {
//     electronDir--
//   } else if (nextStep === '180') {
//     electronDir += 2
//   } else if (nextStep === 'CLEAR') {
//     console.log('CLEAR')
//     let nextStepLoc = takeStep(electronRow, electronCol, electronDir)
//     nextRow = nextStepLoc[0]
//     nextCol = nextStepLoc[1]
//   }
//   handleCheckStep(nextRow, nextCol, electronDir)
// }

// const beginMove = (electronRow, electronCol, electronDir) => {
//   let status
//   let nextCell
//   if (board[electronRow][electronCol] === 'A') {
//     status = 'HIT'
//   } else {
//     if (electronDir === 0 || electronDir === 2) {
//       let result1 = handleCheckCell(electronRow, electronCol - 1)
//       let result2 = handleCheckCell(electronRow, electronCol + 1)
//       if (result1 === 'ATOM' || result2 === 'ATOM') {
//         status = 'RETURN'
//       } else {
//         status = 'CLEAR'
//       }
//     } else if (electronDir === 3 || electronDir === 1) {
//       let result1
//       let result2
//       if (electronRow === 0) {
//         result2 = handleCheckCell(electronRow + 1, electronCol)
//       } else if (electronRow === board.length - 1) {
//         result1 = handleCheckCell(electronRow - 1, electronCol)
//       } else {
//         result1 = handleCheckCell(electronRow - 1, electronCol)
//         result2 = handleCheckCell(electronRow + 1, electronCol)
//       }
//       if (result1 === 'ATOM' || result2 === 'ATOM') {
//         status = 'RETURN'
//       } else {
//         status = 'CLEAR'
//       }
//     }
//   }
//   if (status === 'HIT') {
//     console.log(status)
//     return
//   } else if (status === 'RETURN') {
//     console.log(status)
//     return
//   } else if (status === 'CLEAR') {
//     nextCell = takeStep(electronRow, electronCol)
//     handleCheckStep(nextCell[0], nextCell[1], electronDir)
//   }
// }

const test1Only = (electronRow, electronCol, electronDir) => {
  let test1Row
  let test1Col
  if (electronDir % 2 === 1) {
    test1Row = electronRow - DIRECTIONS[electronDir]
    test1Col = electronCol + DIRECTIONS[electronDir]
    if (board[test2Row][test2Col] === 'A') {
      return 'DEFLECTION FROM ONE'
    } else {
      return 'CLEAR AGAIN'
    }
  } else if (electronDir % 2 === 0) {
    test2Row = electronRow + DIRECTIONS[electronDir]
    test2Col = electronCol + DIRECTIONS[electronDir]
    if (board[test2Row][test2Col] === 'A') {
      return 'DEFLECTION FROM ONE'
    } else {
      return 'CLEAR AGAIN'
    }
  }
}

const test2Only = (electronRow, electronCol, electronDir) => {
  let test2Row
  let test2Col
  if (electronDir % 2 === 1) {
    test2Row = electronRow + DIRECTIONS[electronDir]
    test2Col = electronCol + DIRECTIONS[electronDir]
    if (board[test2Row][test2Col] === 'A') {
      console.log('DEFLECTION FROM 2')
      return
    } else {
      console.log('CLEAR AGAIN')
      return
    }
  } else if (electronDir % 2 === 0) {
    test2Row = electronRow + DIRECTIONS[electronDir]
    test2Col = electronCol - DIRECTIONS[electronDir]
    if (board[test2Row][test2Col] === 'A') {
      console.log('DEFLECTION FROM 2')
      return
    } else {
      console.log('CLEAR AGAIN')
      return
    }
  }
}

const testBothDiagonal = (electronRow, electronCol, electronDir) => {
  if (
    (electronDir === 0 && electronCol === 0) ||
    (electronDir === 2 && electronCol === board[0].length - 1) ||
    (electronDir === 1 && electronRow === 0) ||
    (electronDir === 3 && electronRow === board.length - 1)
  ) {
    test2Only(electronRow, electronCol, electronDir)
    return
  } else if (
    (electronDir === 0 && electronCol === board[0].length - 1) ||
    (electronDir === 2 && electronCol === 0) ||
    (electronDir === 1 && electronRow === board.length - 1) ||
    (electronDir === 3 && electronRow === 0)
  ) {
    test1Only(electronRow, electronCol, electronDir)
    return
  }
  let test1Row
  let test1Col
  let test2Row
  let test2Col
}

const testForHit = (electronRow, electronCol, electronDir) => {
  let testRow
  let testCol
  if (electronDir === 0) {
    testRow = electronRow - 1
    testCol = electronCol
  } else if (electronDir === 1) {
    testRow = electronRow
    testCol = electronCol + 1
  } else if (electronDir === 2) {
    testRow = electronRow + 1
    testCol = electronCol
  } else if (electronDir === 3) {
    testRow = electronRow
    testCol = electronCol - 1
  }
  console.log(electronDir)
  if (board[testRow][testCol] === 'A') {
    console.log('HIT')
    return
  } else {
    testBothDiagonal(electronRow, electronCol, electronDir)
  }
}

const takeNextStep = (electronRow, electronCol, electronDir) => {}

const checkImmediateHit = (electronRow, electronCol, electronDir) => {
  console.log(electronRow, electronCol, electronDir)
  if (board[electronRow][electronCol] === 'A') {
    console.log('immediateHit')
    return
  }
  // The rules for the first step of detection are a little different, so I can't use a generalized version yet.
  if (electronDir === 0 || electronDir === 2) {
    if (electronCol === 0) {
      if (board[electronRow][electronCol + 1] === 'A') {
        console.log('immediateReflection')
        return
      } else {
        console.log('CLEAR')
        testForHit(electronRow, electronCol, electronDir)
        return
      }
    } else if (electronCol === board.length - 1) {
      if (board[electronRow][electronCol - 1] === 'A') {
        console.log('immediateReflection')
        return
      } else {
        console.log('CLEAR')
        testForHit(electronRow, electronCol, electronDir)
        return
      }
    }
    if (board[electronRow][electronCol - 1] === 'A') {
      console.log('immediateDeflection')
      return
    } else if (board[electronRow][electronCol + 1] === 'A') {
      console.log('immediateDeflection')
      return
    } else {
      console.log('CLEAR')
      testForHit(electronRow, electronCol, electronDir)
      return
    }
  } else if (electronDir === 1 || electronDir === 3) {
    if (electronRow === 0) {
      if (board[electronRow + 1][electronCol] === 'A') {
        console.log('immediateDeflection')
        return
      } else {
        console.log('CLEAR')
        testForHit(electronRow, electronCol, electronDir)
        return
      }
    } else if (electronRow === board.length - 1) {
      if (board[electronRow - 1][electronCol] === 'A') {
        console.log('immediateDeflection')
        return
      } else {
        console.log('CLEAR')
        testForHit(electronRow, electronCol, electronDir)
        return
      }
    }
    if (board[electronRow - 1][electronCol] === 'A') {
      console.log('immediateDeflection')
      return
    } else if (board[electronRow + 1][electronCol] === 'A') {
      console.log('immediateDeflection')
      return
    } else {
      console.log('CLEAR')
      testForHit(electronRow, electronCol, electronDir)
      return
    }
  }
}

const checkEntrance = (selector) => {
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
  checkImmediateHit(entryRow, entryCol, entryDir)
}

// The ray click determines what cell to start on, then passes it on to the HandleEmission function.
const enterBoard = (selector) => {
  checkEntrance(selector)
  // if (selector.includes('top')) {
  //   electronRow = 0
  //   electronCol = Number(selector.charAt(selector.length - 1))
  //   electronDir = 2
  // } else if (selector.includes('bottom')) {
  //   electronRow = board.length - 1
  //   electronCol = Number(selector.charAt(selector.length - 1))
  //   electronDir = 0
  // } else if (selector.includes('left')) {
  //   electronCol = 0
  //   electronRow = Number(selector.charAt(selector.length - 1))
  //   electronDir = 1
  // } else if (selector.includes('right')) {
  //   electronCol = board.length - 1
  //   electronRow = Number(selector.charAt(selector.length - 1))
  //   electronDir = 3
  // }
  // if (board[electronRow][electronCol] === 'A') {
  //   console.log('HIT')
  // } else {
  //   if (electronDir === 0 || electronDir === 2) {
  //   }
  // }
  // beginMove(electronRow, electronCol, electronDir)
}

const handleClick = (evt) => {
  if (evt.target.className !== 'ray-selector') {
    return
  }
  enterBoard(evt.target)
}

const getRandLoc = () => {
  let randomRow = Math.floor(Math.random() * board[0].length)
  let randomCol = Math.floor(Math.random() * board[0].length)
  return [randomRow, randomCol]
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
