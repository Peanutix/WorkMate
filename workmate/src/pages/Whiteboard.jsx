import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

function Whiteboard({ socket, username, currentLobby }) {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [lobbyUsers, setLobbyUsers] = useState([]);

  useEffect(() => {
    // Setup Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#e5e7eb",
      width: window.innerWidth,
      height: window.innerHeight,
      isDrawingMode: true
    });
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Listen for "lobby_update;user1,user2" from the server
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = event.data;
      if (data.startsWith("lobby_update;")) {
        const [, userListStr] = data.split(";");
        // userListStr might be "Ahmed,Alice,Bob"
        const userArray = userListStr ? userListStr.split(",") : [];
        setLobbyUsers(userArray);
      }
    };

    socket.addEventListener("message", handleMessage);

    // cleanup
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar / queue list */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#f0f0f0",
          borderRight: "1px solid #ccc",
          padding: "10px"
        }}
      >
        <h3>Lobby: {currentLobby}</h3>
        <ul>
          {lobbyUsers.map((user, idx) => (
            <li key={idx}>{user}</li>
          ))}
        </ul>
      </div>

      {/* The actual canvas */}
      <div style={{ flexGrow: 1 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default Whiteboard;
