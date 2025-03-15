import React, { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Whiteboard from "./pages/Whiteboard";
import Toolbox from "./components/Toolbox";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fabric } from "fabric";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";


const App = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const defaultBackgroundColor = "#e5e7eb";

  // State for pen color and eraser toggle
  const [penColor, setPenColor] = useState("black");
  const [toggleEraser, setToggleEraser] = useState(false);


  //the joining session socket things
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [currentLobby, setCurrentLobby] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleLeaveLobby = (lobby) => {
    socket.send("leave_lobby;" + lobby)
  }

  const changePenColor = (color) => {
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.color = color;
      setPenColor(color);
      fabricCanvas.renderAll();
    }
  };

  // Pen tool: select the pen (black color)
  const selectPen = () => {
    if (fabricCanvas) {
      changePenColor("black");
      setToggleEraser(false);
    }
  };

  // Eraser tool: select the eraser (set brush color to background)
  const selectEraser = () => {
    if (fabricCanvas) {
      changePenColor(defaultBackgroundColor);
      setToggleEraser(true);
    }
  };

  useEffect(() => {
    // Connect to the backend WebSocket server
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("[CLIENT] Socket connected");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("[CLIENT] Socket disconnected");
      setIsConnected(false);
    };

    // For debugging/logging, or could do more sophisticated event handling here
    ws.onmessage = (event) => {
      console.log("[CLIENT] Received:", event.data);
    };

    setSocket(ws);

    // Cleanup when App unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);



  return (
    <Router>
      <Navbar leaveLobbyFunc={handleLeaveLobby} lobby={currentLobby} />

      {/* <div className="absolute top-20 left-4 z-20">
        //Toolbox thing dont remove it just in case i move it again - ahmed
      </div> */}
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
          element={<Whiteboard canvasRef={canvasRef} setFabricCanvas={setFabricCanvas}
            changePenColor={changePenColor}
            selectPen={selectPen}
            selectEraser={selectEraser}
            penColor={penColor}

            //session features
            socket={socket}
            username={username}
            currentLobby={currentLobby}
           />}
        />
      </Routes>
    </Router>
  );
};

export default App;
