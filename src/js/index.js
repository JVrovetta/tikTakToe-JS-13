let vBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
const boardFields = document.querySelectorAll('.boardField')

function nextTurn() {
  const oldTurnPlayer = document.querySelector('div[data-turn="1"]')
  const newTurnPlayer = document.querySelector('div[data-turn="0"]')

  oldTurnPlayer.dataset.turn = '0'
  oldTurnPlayer.querySelector('.turn').innerText = ''
  oldTurnPlayer.classList.remove('turn-player')
  newTurnPlayer.dataset.turn = '1'
  newTurnPlayer.querySelector('.turn').innerText = 'Your Turn'
  newTurnPlayer.classList.add('turn-player')
  return parseFloat(newTurnPlayer.dataset.player)
}

function checkWin() {
  for (let i = 0; i < 3; i++) {
    const a = vBoard[0][i]
    const b = vBoard[1][i]
    const c = vBoard[2][i]
    if (a === b && b === c && a !== 0) {
      return { win: true, winFields: [[0, i], [1, i], [2, i]], winPlayer: a }
    }
    const d = vBoard[i][0]
    const e = vBoard[i][1]
    const f = vBoard[i][2]
    if (d === e && e === f && d !== 0) {
      return { win: true, winFields: [[i, 0], [i, 1], [i, 2]], winPlayer: d }
    }
  }
  const g = vBoard[0][0]
  const h = vBoard[1][1]
  const i = vBoard[2][2]
  if (g === h && h === i && g !== 0) {
    return { win: true, winFields: [[0, 0], [1, 1], [2, 2]], winPlayer: g }
  }
  const j = vBoard[0][2]
  const k = vBoard[2][0]
  if (j === h && h === k && j !== 0) {
    return { win: true, winFields: [[0, 2], [1, 1], [2, 0]], winPlayer: j }
  }
  return { win: false }
}

function setWinner(winnerNumber, fieldsList) {
  const winner = document.querySelector('.player' + winnerNumber)
  const winnerSpan = document.querySelector('.winnerName')
  const winnerName = document.querySelector('.player' + winnerNumber + ' > input').value
  const winnerCounter = document.querySelector('.player' + winnerNumber + ' > span')

  winner.classList.add('winner')
  winnerSpan.innerText = winnerName
  winnerSpan.style.color = 'var(--p' + winnerNumber + '-color)'
  winnerCounter.dataset.content = parseFloat(winnerCounter.dataset.content) + 1

  fieldsList.forEach(function (fieldCoordinates) {
    const field = document.querySelector('button[data-x="' + fieldCoordinates[0] + '"][data-y="' + fieldCoordinates[1] + '"]')
    field.classList.add('highlights')
  })
}

function checkTie() {
  const enabledFields = document.querySelectorAll('.enabled')
  if (enabledFields.length === 0) {
    return true
  }
  return false
}

function setTie() {
  const winnerSpan = document.querySelector('.winnerName')
  const players = document.querySelectorAll('#players > div')

  boardFields.forEach(function (field) {
    field.classList.add('highlights')
  })
  winnerSpan.innerText = 'scratch'
  players.forEach(function (player) {
    player.classList.add('winner')
  })
}

function disableNotUsed() {
  const notUsedFields = document.querySelectorAll('.enabled')
  notUsedFields.forEach(function (field) {
    field.classList.remove('enabled')
    field.disabled = true
  })
}

function reset() {
  const marked1 = document.querySelectorAll('.marker1')
  const marked2 = document.querySelectorAll('.marker2')
  const highlighteds = document.querySelectorAll('.highlights')
  const winner = document.querySelectorAll('.winner')
  const winnerSpan = document.querySelector('.winnerName')

  vBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  boardFields.forEach(function (field) {
    field.classList.add('enabled')
    field.disabled = false
  })
  highlighteds.forEach(function (field) {
    field.classList.remove('highlights')
  })
  marked1.forEach(function (field) {
    field.classList.remove('marker1')
  })
  marked2.forEach(function (field) {
    field.classList.remove('marker2')
  })
  winner.forEach(function (player) {
    player.classList.remove('winner')
  })
  winnerSpan.innerText = '...'
  winnerSpan.style.color = 'var(--font-color)'
}

function resetButton() {
  const resetDiv = document.getElementById('resetDiv')
  const resetButton = document.createElement('button')
  resetButton.innerText = "REMATCH"
  resetDiv.append(resetButton)
  resetButton.addEventListener('click', function () {
    reset()
    resetDiv.removeChild(resetButton)
  })
}

boardFields.forEach(function (field) {
  field.addEventListener('click', function (ev) {
    const button = ev.currentTarget
    const buttonPositionX = parseFloat(button.dataset.x)
    const buttonPositionY = parseFloat(button.dataset.y)
    const currentPlayer = document.querySelector('div[data-turn="1"]').dataset.player

    vBoard[buttonPositionX][buttonPositionY] = parseFloat(currentPlayer)
    button.classList.add('marker' + currentPlayer)
    button.classList.remove('enabled')
    button.disabled = true

    const win = checkWin()
    if (win['win']) {
      setWinner(win['winPlayer'], win['winFields'])
      disableNotUsed()
      resetButton()
    } else if (checkTie()) {
      setTie()
      resetButton()
    } else {
      nextTurn()
    }
  })
})