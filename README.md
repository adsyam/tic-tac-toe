
# React Tic Tac Toe w/Node JS

This project is a Tic Tac Toe game implemented using React and Node.js. It allows players to join and make moves in a real-time multiplayer game.

## Installation

1. Clone the repository: `git clone https://github.com/adsyam/tic-tac-toe.git`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`
4. Install nodemon globally: `npm install -g nodemon`
5. Add `"start": "vite"` to the "scripts" section of the package.json file.
5. Install Tailwind CSS, PostCSS, and Autoprefixer as dev dependencies: `npm install -D tailwindcss postcss autoprefixer`
6. Initialize Tailwind CSS: `npx tailwindcss init`
7. configure the index.css:

```javascript
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Usage

1. Start the Node.js server: `nodemon index`
2. The Node.js server is at: [http://localhost:3001]
3. Start the Vite server: `npm start`
4. In your browser open 2 of those tabs to have 2 players (the link should be at http://localhost:3000)
5. Enter your name and click "Find Opponent" to start searching for a match.
6. Once a match is found, the game board will be displayed and you can make moves by clicking on the cells.
7. The game will continue until there is a winner or a tie.

## tailwind.config.js

Make sure your `tailwind.config.js` file has the following configuration:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## vite.config.js

Make sure your `vite.config.js` file has the following configuration:

```javascript
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
}) 
```


## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b <branch-name>`
3. Make your changes and commit them: `git commit -m '<commit-message>'`
4. Push your changes to the branch: `git push origin <branch-name>`
5. Submit a pull request

## Bugs

- As of writing this, this is my 1st time dealing with Node JS w/o prior experience
- Issue: Board does reset but it does not for the 2nd session
- Issue: A restart on the Node server with the command `rs` or `ctrl + C` lets you play with no bugs

## Future Plans

- Feature: More Players should be able to play
- Improvement: Fix the said bugs

## Authors

- [adsyam](https://github.com/adsyam)

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Socket.IO](https://socket.io/)

## Contact

For any questions or feedback, please feel free to reach out to me at [adiyambaojs@gmail.com](adiyambaojs@gmail.com).
