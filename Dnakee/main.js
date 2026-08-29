const stage = document.getElementById('canvas')
const pauseBtn = document.getElementById('pauseBtn')
const score = document.getElementById('score')

let speed = 1
let speedX = 1
let speedY = 0

let positionX = 20
let positionY = 20

let lengthSquare = 20

let totalSquares = 30

const WIDTH = stage.width
const HEIGHT = stage.height

let appleX = 18
let appleY = 10

let tail = [{ x: positionX, y: positionY }]
let lengthSnake = 1

let ctx

let gameOver = false

const FPS = 60

const BACKGROUND_COLOR = "#ef0f0f"
const APPLE_COLOR = "cyan"
const SNAKE_COLOR = "#000000"

let oldSpeedX = speedX
let oldSpeedY = speedY

let gamePaused = false

const gameloop = () => {
  if (!gameOver) {
    if (!gamePaused) {
      positionX += speedX
      positionY += speedY
    }

    // if the snake goes out the stage
    if (positionX < 0) {
      positionX = totalSquares - 1
    }
    if (positionX > totalSquares - 1) {
      positionX = 0
    }
    if (positionY < 0) {
      positionY = totalSquares - 1
    }
    if (positionY > totalSquares - 1) {
      positionY = 0
    }

    // drawing background
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // drawing apple
    ctx.fillStyle = APPLE_COLOR
    ctx.fillRect(appleX * lengthSquare, appleY * lengthSquare, lengthSquare, lengthSquare)

    // drawing the snake
    ctx.fillStyle = SNAKE_COLOR
    for (let i = 0; i < tail.length; i++) {
      ctx.fillRect(tail[i].x * lengthSquare, tail[i].y * lengthSquare, lengthSquare - 1, lengthSquare - 1)

      // verify if the current position of the head is one position of the snake
      if (!gamePaused && tail[i].x === positionX && tail[i].y === positionY) {
        gameOver = true
      }
    }

    // moving the snake
    if (!gamePaused) {
      tail.push({ x: positionX, y: positionY })
      while (tail.length > lengthSnake) {
        tail.shift()
      }
    }

    // eating the apple
    if (appleX === positionX && appleY === positionY) {
      lengthSnake++

      let { newAppleX, newAppleY } = generateApplePositions()
      appleX = newAppleX
      appleY = newAppleY
    }

    score.innerHTML = lengthSnake - 1
  } else {
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, stage.width, stage.height)
    ctx.fillStyle = "black"
    ctx.fillText('Game Over', 180, 200)
    ctx.fillText('Press New Game to restart :)', 140, 220)
  }
}

const generateApplePositions = () => {
  // gets the x and y positions of the snake
  const { x, y } = tail.reduce(
    ({ x, y }, pt) => ({ x: [...x, pt.x], y: [...y, pt.y] }),
    { x: [], y: [] }
  )

  // then, gets the apple position that it's not in the snake
  const possiblesX = Array.from(Array(totalSquares).keys()).filter(el => !x.includes(el))
  const possiblesY = Array.from(Array(totalSquares).keys()).filter(el => !y.includes(el))

  return {
    newAppleX: possiblesX[Math.floor(Math.random() * possiblesX.length)],
    newAppleY: possiblesY[Math.floor(Math.random() * possiblesY.length)]
  }
}

const keyEvent = (event) => {
  const keys = {
    a: {
      newSpeedX: -speed,
      newSpeedY: 0
    },
    w: {
      newSpeedX: 0,
      newSpeedY: -speed
    },
    d: {
      newSpeedX: speed,
      newSpeedY: 0
    },
    s: {
      newSpeedX: 0,
      newSpeedY: speed
    }
  }

  if (keys[event.key]) {
    let { newSpeedX, newSpeedY } = keys[event.key]
    speedX = newSpeedX
    speedY = newSpeedY
  }
}

const pause = () => {
  gamePaused = !gamePaused
  if (gamePaused) {
    pauseBtn.innerHTML = 'Continue'
  } else {
    pauseBtn.innerHTML = 'Pause'
  }
}

const newGame = () => {
  speedX = 1
  speedY = 0

  positionX = 10
  positionY = 10

  appleX = 18
  appleY = 10

  tail = [{ x: positionX, y: positionY }]
  lengthSnake = 1
  gameOver = false
  gamePaused = false
}

window.onload = () => {
  ctx = stage.getContext('2d')
  document.addEventListener("keydown", keyEvent)
  setInterval(gameloop, FPS)
}