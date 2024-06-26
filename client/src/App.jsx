import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Lobby from "../src/screens/Lobby";
import Room from "./screens/Room";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room/>} />
      </Routes>
    </>
  );
}

export default App;
