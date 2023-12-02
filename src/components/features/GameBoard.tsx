//GameBoard.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { io } from "socket.io-client"
import { BoxValue } from "../../App"

type BoardValue = {
  id: string
  text: string
}

type WinningCombination = [number, number, number] | [number, number]

type GameBoardProps = {
  oppName: string | undefined
  value: string | undefined
  turn: string | undefined
  playerName: string | undefined
  setPlayerName: React.Dispatch<React.SetStateAction<string>>
  boardValue: BoardValue[]
  handleMove: (clickedBox: { id: string; text: string }) => void
  setBoardValue: React.Dispatch<React.SetStateAction<BoxValue[]>>
  setTurn: React.Dispatch<React.SetStateAction<string | undefined>>
}

export default function GameBoard({
  oppName,
  value,
  turn,
  playerName,
  boardValue,
  handleMove,
  setBoardValue,
  setTurn,
  setPlayerName,
}: GameBoardProps) {
  const [gameStatus, setGameStatus] = useState<string | null>(null)
  const socketRef = useRef(io("http://localhost:3001")) // Creating a socket connection
  const socket = socketRef.current

  const winningCombinations: WinningCombination[] = useMemo(
    () => [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ],
    []
  )
  // Function to reset the board and redirect to home page
  const resetBoardAndRedirect = useCallback(() => {
    // Resetting the board values
    setBoardValue(
      [...Array(9)].map((_, i) => ({ id: `btn${i + 1}`, text: "" }))
    )
    setPlayerName("")

    // Emitting socket events to reset the board and playing status
    setTimeout(() => {
      socket.emit("resetBoard")
      socket.emit("playing", {
        id: "",
        text: "",
        name: "",
      })
    }, 500)

    setTimeout(() => {
      window.location.replace("http://localhost:3000")
    }, 2000)
  }, [setBoardValue, setPlayerName, socket])

  // useEffect hook to check for winning combinations and tie
  useEffect(() => {
    const tie = boardValue.every((box) => box.text !== "")

    // Looping through each winning combination
    for (const combination of winningCombinations) {
      const [a, b, c] = combination

      // board values for a, b, and c
      const boardValueA = boardValue[a].text
      const boardValueB = boardValue[b].text
      const boardValueC = c !== undefined && boardValue[c].text

      // Check if the combination forms a winning sequence.
      if (
        boardValueC !== undefined &&
        boardValueA &&
        boardValueA === boardValueB &&
        boardValueB === boardValueC
      ) {
        setGameStatus(`Player ${boardValue[a].text} wins!`)
        resetBoardAndRedirect()
        return
      }
    }

    if (tie) {
      setGameStatus("It's a tie!")
      resetBoardAndRedirect()
    }

    // Switching the turn between players
    setTurn((prevTurn) => (prevTurn === "X" ? "O" : "X"))
  }, [boardValue, resetBoardAndRedirect, setTurn, winningCombinations])

  function selectBox(i: number) {
    const selectedBox = boardValue[i]

    // Checking if the selected box is empty and it's the player's turn
    if (selectedBox && selectedBox.text === "" && turn === value) {
      const moveDetails = {
        id: selectedBox.id,
        text: turn!,
        name: playerName,
      }

        // Updating the board with the player's move
        setBoardValue((prevBoard) => {
          const updatedBoard = [...prevBoard]
          updatedBoard[i] = { ...selectedBox, text: moveDetails.text }
          return updatedBoard
        })

        // Handling the player's move and emitting a socket event
        handleMove(moveDetails)
        socket.emit("playing", moveDetails)
    }
  }

  return (
    <section className="h-screen grid place-items-center">
      <div className="flex flex-col">
        <h1 className="font-bold text-center mb-5 text-xl">TIC TAC TOE</h1>
        <h2 className="text-center mb-3">
          {gameStatus || "WHICH PLAYER WILL WIN?"}
        </h2>
        <div className="flex justify-between">
          <p>
            You: <span className="">{playerName}</span>
          </p>
          <p>
            Opponent: <span>{oppName}</span>
          </p>
        </div>
        <div>
          <p className="text-center">
            You are playing as <span>{value}</span>
          </p>
        </div>
        <p className="text-center">{turn}'s Turn</p>
        <div className="grid grid-cols-3 place-items-center gap-2">
          {boardValue.map((box, i) => (
            <button
              key={box.id}
              role="button"
              className="border w-[15vw] h-[15vh] flex items-center justify-center rounded-md shadow-md text-2xl"
              onClick={() => {
                selectBox(i)
              }}
              disabled={
                box.text !== "" || turn !== value || gameStatus !== null
              }
            >
              {box.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
