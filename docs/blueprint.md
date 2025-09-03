# **App Name**: Noughts & Crosses Connect

## Core Features:

- Player ID Generation: Generate and persist a unique player ID using localStorage to maintain identity across sessions.
- Room Management: Create and manage game rooms via REST API calls (create/delete) to the backend.
- Real-time Gameplay: Implement live, interactive Tic Tac Toe gameplay using WebSocket communication for moves and game state updates.
- Automatic Reconnection: Automatically reconnect to the game on connection drops with exponential backoff and resume unfinished games.
- Game State Persistence: The app attempts to re-connect and 'resume game'. A tool may use a `resume_game` response from the backend to restore an in-progress game state (board, players, turn).
- Game History Display: Display a collapsable panel showing previous games in a given room, including their result (win/loss/draw)
- Turn Indication: Visually indicate whose turn it is with an intuitive highlight of the relevant player avatar or name.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent connectivity and clear communication.
- Background color: A light, desaturated blue (#E5F6FD) to provide a clean, modern backdrop.
- Accent color: A contrasting orange (#FF8C00) to highlight interactive elements and important actions.
- Font: 'Inter', a sans-serif font, is recommended for both headlines and body text, for a modern and readable user experience.
- Use clean, geometric icons to represent game actions and player turns.
- A mobile-first, responsive grid layout should be implemented for optimal gameplay on all devices.
- Incorporate subtle animations, like smooth transitions and highlights, to enhance the interactive experience of placing marks and indicating the winner.