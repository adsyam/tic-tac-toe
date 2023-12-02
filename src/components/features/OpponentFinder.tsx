type OpponentFinderProps = {
  playerName: string
  setPlayerName: React.Dispatch<React.SetStateAction<string>>
  sendName: () => void
  error: string | null
  loading: boolean
}

export default function OpponentFinder({
  setPlayerName,
  playerName,
  sendName,
  error,
  loading,
}: OpponentFinderProps) {

  return (
    <section className="h-screen grid place-items-center">
      <div className="flex flex-col">
        <h1 className="font-bold text-center mb-5 text-xl">TIC TAC TOE</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="playerName"
            id="playerName"
            placeholder="Enter your name"
            className="border p-2 rounded-md outline-none"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          {loading && <p>Finding Opponent...</p>}
          <button
            className="border border-stone-500 rounded-md text-white bg-orange-300 px-3 py-2"
            onClick={sendName}
            disabled={loading}
          >
            Search for an Opponent
          </button>
        </div>
      </div>
    </section>
  )
}
