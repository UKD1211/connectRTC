# connectRTC

A real-time video communication application built with React, Socket.io, and WebRTC. This application allows users to join rooms, make video calls, and manage their streams effectively.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)

## Features

- **Real-time communication**: Make and receive video calls in real-time.
- **Room Management**: Create or join rooms using unique room IDs.
- **Stream Control**: Toggle webcam streams on and off.
- **WebRTC Integration**: Utilizes WebRTC for peer-to-peer communication.
- **Socket.io Signaling**: Manages signaling between peers via Socket.io.

## Demo

Check out the live demo of the project [here](https://youtu.be/tzoy2fssbEo?si=KNElLJgRD1EGbNQw).

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/UKD1211/connectRTC
   cd connectRTC
   ```
1. **Install dependencies:**:
   ```bash
   npm install
   ```
1. **Run the server:**:
   ```bash
   node/nodemon server.js
   ```
1. **Start the client:**:
   ```bash
   npm start/npm run dev
   ```

## Usage

1. Open the application in your browser.
2. Enter your email and a room ID to join or create a room.
3. Once in a room, use the interface to make video calls.
4. Toggle your webcam stream using the provided buttons.

## Technologies Used

### Frontend:

- [React](https://reactjs.org/)
- [ReactPlayer](https://www.npmjs.com/package/react-player)
- CSS (with custom styles)

### Backend:

- [Node.js](https://nodejs.org/)
- [Socket.io](https://socket.io/)

### WebRTC:

- RTCPeerConnection
- MediaDevices API

## Screenshots

- **Lobby Screen:**
  ![Lobby Screen](<./pics/Screenshot%20(1561).png>)

- **Room Page:**
  ![Room Page](<./pics/Screenshot%20(1562).png>)

- **Video Call in Action:**
  ![Video Call](<./pics/Screenshot%20(1563).png>)

- **Remote Calling:"**
  ![Remote Calling](<./pics/Screenshot%20(1564).png>)

## Project Structure

```bash
/root
├── /public
├── /src
│   ├── /components
│   │   ├── LobbyScreen.jsx
│   │   ├── RoomPage.jsx
│   ├── /context
│   │   ├── SocketProvider.js
│   ├── /service
│   │   ├── peer.js
│   ├── App.js
│   ├── index.js
├── server.js
├── README.md
├── package.json
```
