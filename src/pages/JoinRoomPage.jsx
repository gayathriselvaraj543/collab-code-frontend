import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./JoinRoomPage.css";
import socket from "../socket";

function JoinRoomPage() {
  const [name, setName] = useState("");
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    return () => {
      socket.off("error-message");
      socket.off("room-joined-success");
    };
  }, []);

  const createRoom = () => {
    const newRoomID = uuidv4();
    if (name.trim()) {
      socket.emit("create-room", newRoomID);
      navigate(`/editor/${newRoomID}`, { state: { name: name.trim() } });
      setRoomID(newRoomID);
    } else {
      alert("Please enter your name to create a room.");
    }
  };

  const joinRoom = () => {
    if (name.trim() && roomID.trim()) {

      socket.off("error-message");
      socket.off("room-joined-success");

      socket.once("room-joined-success", () => {
        navigate(`/editor/${roomID.trim()}`, { state: { name: name.trim() } });
      });

    
      socket.once("error-message", (msg) => {
        alert(msg);
      });

      socket.emit("join-room", { roomId: roomID.trim(), username: name.trim() });
    } else {
      alert("Please enter both your name and room ID to join.");
    }
  };

  return (
    <div className="join-container">
      <div className="join-card">
        <h2>💻 Join or Create a Coding Room</h2>
        <input
          type="text"
          placeholder="👤 Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="🔑 Room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
        />
        <div className="button-group">
          <button className="create" onClick={createRoom}>
            ➕ Create Room
          </button>
          <button className="join" onClick={joinRoom}>
            🚀 Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinRoomPage;
