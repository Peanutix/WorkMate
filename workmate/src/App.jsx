import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Whiteboard from "./pages/Whiteboard";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  // -- WebSocket states:
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [currentLobby, setCurrentLobby] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState("");

  // -- Connect to backend WebSocket:
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("[CLIENT] Socket connected");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("[CLIENT] Socket disconnected");
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      // console.log("[CLIENT] Received:", event.data);
      setData(event.data);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleLeaveLobby = () => {
    if (socket) {
      socket.send("leave_lobby$" + currentLobby);
    }
    setCurrentLobby("")
  };

  return (
    <Router>
      <Navbar leaveLobbyFunc={handleLeaveLobby} currentLobby={currentLobby} socket={socket} />
      <Routes>
        <Route
          path="/"
          element={
            <Login
              socket={socket}
              setUsername={setUsername}
              isConnected={isConnected}
            />
          }
        />
        <Route
          path="/lobby"
          element={
            <Lobby
              socket={socket}
              username={username}
              setCurrentLobby={setCurrentLobby}
              isConnected={isConnected}
            />
          }
        />
        <Route
          path="/whiteboard"
          element={
            <Whiteboard
              socket={socket}
              username={username}
              currentLobby={currentLobby}
              data={data}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
