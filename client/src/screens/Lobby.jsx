import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import "./lobby.css";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const [text, setText] = useState("Copy RoomID");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (email.trim() === "" || room.trim() === "") {
        alert("Please enter both email and room ID");
        return;
      }

      if (room.length !== 10) {
        alert(
          "Room Id must be exact 10 characters, and please try to use the `create room id` button"
        );
        return;
      }

      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleCopyRoomId = () => {
    if (room) {
      navigator.clipboard.writeText(room).then(
        () => {
          // alert("Room ID copied to clipboard!");
          setText("Copied");
        },
        (err) => {
          console.error("Failed to copy the room ID: ", err);
        }
      );
    }
  };

  const createRoomId = () => {
    setRoom(generateRoomId);
    setText("Copy RoomID");
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  return (
    <div className="lobby-container">
      <form className="lobby-form" onSubmit={handleSubmitForm}>
        <h1>Lobby</h1>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <div className="button-group">
          <button style={{ backgroundColor: "red" }} type="submit">
            Join
          </button>
          <button type="button" onClick={createRoomId}>
            Create RoomId
          </button>
          <button type="button" onClick={handleCopyRoomId}>
            {text}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LobbyScreen;
