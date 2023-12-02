//node server
import cors from "cors"
import express from "express"
import http from "http"
import path from "path"
import { Server } from "socket.io"

const app = express()

app.use(cors())

// Creating an HTTP server using the Express
const server = http.createServer(app)

// Creating a Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(express.static(path.resolve("")))

let arr = []
let playingArray = []
let gameBoardState = [
  { id: "btn1", text: "" },
  { id: "btn2", text: "" },
  { id: "btn3", text: "" },
  { id: "btn4", text: "" },
  { id: "btn5", text: "" },
  { id: "btn6", text: "" },
  { id: "btn7", text: "" },
  { id: "btn8", text: "" },
  { id: "btn9", text: "" },
]

const initialGameBoardState = [...gameBoardState]

let gameStates = new Map()

// Handles the socket connection event
io.on("connection", (socket) => {
  // Handling "find" event
  socket.on("find", (e) => {
    if (e.name !== null) {
      arr.push(e.name)

      if (arr.length >= 2) {
        const [p1Name, p2Name] = arr

        // Creating player objects
        const p1obj = { p1Name, p1Value: "X", p1Move: "" }
        const p2obj = { p2Name, p2Value: "O", p2Move: "" }

        const obj = { p1: p1obj, p2: p2obj, sum: 1 }

        // Initializing game states for each player
        if (!gameStates.has(p1Name) || !gameStates.has(p2Name)) {
          gameStates.set(p1Name, [...initialGameBoardState])
          gameStates.set(p2Name, [...initialGameBoardState])
        }
        // console.log(gameStates)
        // console.log(initialGameBoardState)

        playingArray.push(obj)

        // Clearing the names array
        arr.splice(0, 2)

        // Emitting "find" event with all players
        io.emit("find", { allPlayers: playingArray })
        // console.log(playingArray)
      }
    }
  })

  // Handling "resetBoard" event
  socket.on("resetBoard", () => {
    // console.log("before", gameBoardState)
    console.log("before", playingArray)
    arr = []
    playingArray = []
    gameBoardState = initialGameBoardState
    gameStates.clear()

    // console.log("after", gameBoardState)
    // console.log("after:", playingArray)

    // Emitting "playing" event with an empty playing array
    // Emitting "updateBoard" event with the initial game board state
    io.emit("playing", { allPlayers: playingArray })
    io.emit("updateBoard", { boardValue: gameBoardState })
    // console.log("after after:", gameBoardState)
  })

  // Handling "playing" event
  socket.on("playing", (e) => {
    if (e.text === "X") {
      // Find the object in the playingArray where the p1.p1Name property is equal to e.name
      let objToChange = playingArray.find((obj) => obj.p1.p1Name === e.name)
      //   console.log(objToChange)

      if (objToChange) {
        objToChange.p1.p1Move = e.id
        objToChange.sum++
      }
    } else if (e.text === "O") {
      let objToChange = playingArray.find((obj) => obj.p2.p2Name === e.name)

      if (objToChange) {
        objToChange.p2.p2Move = e.id
        objToChange.sum++
      }
    }

    // Broadcasting "playing" event to all clients except the current socket
    socket.broadcast.emit("playing", { allPlayers: playingArray })
    // console.log(playingArray)

    // Updating the game board state for the current player
    const currentPlayerGameState = gameStates.get(e.name)
    const updatedCell =
      currentPlayerGameState &&
      currentPlayerGameState.find((cell) => cell.id === e.id)
    if (updatedCell) {
      updatedCell.text = e.text
    }

    // Broadcasting "updateBoard" event to all clients
    socket.broadcast.emit("updateBoard", { boardValue: currentPlayerGameState })
  })
})

// Handling root route
app.get("/", (req, res) => {
  return res.sendFile("app.tsx")
})

// Starting the server
const PORT = 3001
server.listen(PORT, () => {
  console.log("port connected to 3001")
})

// This code block contains a Node.js server implementation using Express, Socket.IO, and CORS middleware. It sets up an HTTP server, serves static files, and handles socket connections. The server manages a Tic-Tac-Toe game where players can join and make moves.