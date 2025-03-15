import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Queue from "../components/Queue";
import Toolbox from "../components/Toolbox";
import Prompt from "../components/Prompt";
import ChatRoom from "../components/ChatRoom"; // Import the ChatRoom component

function Whiteboard({ socket, username, currentLobby }) {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [lobbyUsers, setLobbyUsers] = useState([]);

  // -- Add these local states for pen/eraser:
  const [penColor, setPenColor] = useState("#000000");
  const defaultBackgroundColor = "#e5e7eb";
  const [isEraserOn, setIsEraserOn] = useState(false);

  // -- Functions for pen and eraser:
  const changePenColor = (color) => {
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.color = color;
      setPenColor(color);
      fabricCanvas.renderAll();
    }
  };

  const selectPen = () => {
    if (fabricCanvas) {
      changePenColor("#000000");
      setIsEraserOn(false);
    }
  };

  const selectEraser = () => {
    if (fabricCanvas) {
      changePenColor(defaultBackgroundColor);
      setIsEraserOn(true);
    }
  };

  // -- Initialize FabricJS Canvas:
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: defaultBackgroundColor,
      width: window.innerWidth,
      height: window.innerHeight,
      isDrawingMode: true,
    });
    setFabricCanvas(canvas);
    return () => {
      canvas.dispose();
    };
  }, []);

  // -- Listen for window resize events to adjust canvas
  useEffect(() => {
    if (!fabricCanvas) return;
    const handleResize = () => {
      fabricCanvas.setWidth(window.innerWidth);
      fabricCanvas.setHeight(window.innerHeight);
      fabricCanvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fabricCanvas]);

  // send updated canvas to all users
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.on("object:added", (e) => {
        console.log("Object added:", e); // Log the modification event
        const objectData = e.target.toObject();
        const drawingData = {
          type: "drawing",
          objectData,
          username,
        };

        socket.send(
            "drawing;" +
            JSON.stringify({ action: "drawing", data: drawingData, lobby: currentLobby })
        );
        console.log("Sent drawing data:", drawingData);
      });

      return () => {
        fabricCanvas.off("object:added");
      };
    }
  }, [fabricCanvas]);

  // -- Listen for lobby updates
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event) => {
      const data = event.data;
      if (data.startsWith("lobby_update;")) {
        const [, userListStr] = data.split(";");
        const userArray = userListStr ? userListStr.split(",") : [];
        setLobbyUsers(userArray);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
      <>
        {/* Sidebar / Queue */}
        <div className="flex">
          <Queue currentLobby={currentLobby} lobbyUsers={lobbyUsers} />

          {/* Drawing area */}
          <div className="flex-grow relative h-screen">
            {/* Toolbox with local color/pen/eraser functions */}
            <Prompt socket={socket} username={username} currentLobby={currentLobby} />
            <Toolbox
                changePenColor={changePenColor}
                selectPen={selectPen}
                selectEraser={selectEraser}
                penColor={penColor}
            />
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        {/* Chat Room (Floating) */}
        <ChatRoom />
      </>
  );
}

export default Whiteboard;