import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Queue from "../components/Queue";
import Toolbox from "../components/Toolbox";
import Prompt from "../components/Prompt";
import ChatRoom from "../components/ChatRoom";// Import the ChatRoom component
import AIChatRoom from "../components/AIChatRoom"; // Import the AIChatRoom component

function Whiteboard({ socket, username, currentLobby, data }) {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [lobbyUsers, setLobbyUsers] = useState([]);

  // -- Add these local states for pen/eraser:
  const [penColor, setPenColor] = useState("#000000");
  const defaultBackgroundColor = "#e5e7eb";
  const [isEraserOn, setIsEraserOn] = useState(false);
    const [penWidth, setPenWidth] = useState(1);


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

  const changePenWidth = (width) => {
    if (fabricCanvas) {
      const parsedWidth = parseInt(width, 10);
      fabricCanvas.freeDrawingBrush.width = parsedWidth;
      setPenWidth(parsedWidth);
      fabricCanvas.renderAll();
    }
  };


  const downloadBoard = () => {
    if (fabricCanvas) {
      const pngData = fabricCanvas.toDataURL("png");
      const downloadLink = document.createElement("a");
      const fileName = `whiteBoard-session-${Math.random().toString().replace(".", "")}.png`;

      downloadLink.href = pngData;
      downloadLink.download = fileName;
      downloadLink.click();
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
      fabricCanvas.freeDrawingBrush.width = 12

      fabricCanvas.on("mouse:up", (event) => {
        const canvasImage = fabricCanvas.toDataURL({ format: "png" }); // Convert canvas to image (Base64)

        const drawingData = {
          type: "drawing",
          data: canvasImage, // Send as image
          username,
          lobby: currentLobby
        };

        socket.send("drawing$" + JSON.stringify(drawingData)); // Send to WebSocket
      });

      return () => {
        fabricCanvas.off("mouse:up");
      };
    }
  }, [fabricCanvas]);

  // -- Listen for lobby updates
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event) => {
      const data = event.data;
      if (data.startsWith("lobby_update$")) {
        const userListStr = data.split("$")[1];
        const userArray = userListStr ? userListStr.split(",") : [];
        setLobbyUsers(userArray);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  // change client canvas with incoming updates
  useEffect(() => {
      if (!socket || !fabricCanvas) return;
      const handleMessage = (event) => {
        const data = event.data;
        if (data.startsWith("drawing$")) {
          try {
            const drawingData = data.split("$");
            const parsedData = JSON.parse(drawingData[1]);
            if (parsedData.data) {
              fabric.Image.fromURL(parsedData.data, (fabricImg) => {
                fabricImg.scaleToWidth(fabricCanvas.width); // Scale image to fit
                fabricImg.scaleToHeight(fabricCanvas.height);
                fabricCanvas.add(fabricImg); // Add to canvas as an object
                fabricCanvas.renderAll();
              });
            }
          } catch (error) {
            console.error("Error processing drawing data:", error);
          }
        }
      };

      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }, [socket, fabricCanvas]);

  return (
      <>
        {/* Sidebar / Queue */}
        <div className="flex">
          <Queue currentLobby={currentLobby} lobbyUsers={lobbyUsers} />

          {/* Drawing area */}
          <div className="flex-grow relative h-screen">
            {/* Toolbox with local color/pen/eraser functions */}
            <Prompt socket={socket} />
            <Toolbox
                changePenColor={changePenColor}
                selectPen={selectPen}
                selectEraser={selectEraser}
                penColor={penColor}
                changePenWidth={changePenWidth}

                penWidth={penWidth}
                setPenWidth={setPenWidth}


                downloadBoard={downloadBoard}
            />
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        <AIChatRoom />
        {/* Chat Room (Floating) */}
        <ChatRoom socket={socket}/>
      </>
  );
}

export default Whiteboard;