// App.tsx
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
import GameBoard from "./components/features/GameBoard"
import OpponentFinder from "./components/features/OpponentFinder"

// Define the types for player data and opponent finder data
interface PlayerData {
  p1Name: string
  p2Name: string
  p1Value: string
  p2Value: string
  p1Move: string
  p2Move: string
}

export interface OpponentFinderData {
  allPlayers: Array<{
    p1: PlayerData
    p2: PlayerData
    sum: number
  }>
}

export interface BoxValue {
  id: string
  text: string
  name?: string | null
}

const App: React.FC = () => {
  const [boardValue, setBoardValue] = useState<BoxValue[]>([
    { id: "btn1", text: "" },
    { id: "btn2", text: "" },
    { id: "btn3", text: "" },
    { id: "btn4", text: "" },
    { id: "btn5", text: "" },
    { id: "btn6", text: "" },
    { id: "btn7", text: "" },
    { id: "btn8", text: "" },
    { id: "btn9", text: "" },
  ])
  const [playerName, setPlayerName] = useState<string>("")
  const [matchFound, setMatchFound] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [oppName, setOppName] = useState<string | undefined>()
  const [turn, setTurn] = useState<string | undefined>("X")

  const [value, setValue] = useState<string | undefined>()

  // Set up the socket connection
  const socket: Socket = io("http://localhost:3001")

  // Set up useEffect hook to handle side effects
  useEffect(() => {
    const handleFind = (data: OpponentFinderData): void => {
      const allPlayersArray = data.allPlayers
      setMatchFound(true)

      const foundPlayers = allPlayersArray?.find(
        (obj) => obj.p1.p1Name === playerName || obj.p2.p2Name === playerName
      )

      if (foundPlayers) {
        const { p1, p2 } = foundPlayers
        const userIsPlayer1 = foundPlayers.p1.p1Name === playerName

        const userPlayerName = userIsPlayer1
          ? p1.p1Name
          : p2.p2Name
        const oppPlayerName = userIsPlayer1
          ? p2.p2Name
          : p1.p1Name

        const playerValue = userIsPlayer1
          ? p1.p1Value
          : p2.p2Value

        setPlayerName(userPlayerName)
        setOppName(oppPlayerName)
        setValue(playerValue || undefined)
      }
    }

    // Listen for the "find" and "updateBoard" events from the socket
    socket.on("find", handleFind)
    socket.on("updateBoard", (data) => {
      setBoardValue(data.boardValue)
    })

    // Clean up the event listeners when the component is unmounted
    return () => {
      socket.off("updateBoard")
    }
  }, [playerName, socket])

  // Function to handle a move
  const handleMove = (clickedBox: BoxValue): void => {
    // console.log(clickedBox)
    const selectedBox = boardValue.find((box) => box.id === clickedBox.id)

    if (selectedBox) {
      const moveDetails: BoxValue = {
        ...clickedBox,
        name: playerName === oppName ? playerName : oppName,
      }

      socket.emit("playing", moveDetails)
    }
  }

  const emptyName: boolean = playerName === "" || playerName === null

  // Function to send the player name
  const sendName = (): void => {
    if (!emptyName) {
      setError(null)
      socket.emit("find", { name: playerName })
      setLoading(true)
    } else {
      setError("Please enter a name")
    }
  }

  return (
    <div>
      {!matchFound ? (
        <OpponentFinder
          playerName={playerName}
          setPlayerName={setPlayerName}
          sendName={sendName}
          error={error}
          loading={loading}
        />
      ) : (
        <GameBoard
          oppName={oppName}
          setPlayerName={setPlayerName}
          playerName={playerName}
          value={value}
          turn={turn}
          setTurn={setTurn}
          boardValue={boardValue}
          handleMove={handleMove}
          setBoardValue={setBoardValue}
        />
      )}
    </div>
  )
}

export default App
