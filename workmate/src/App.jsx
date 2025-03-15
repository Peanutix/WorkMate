import React, { useRef, useState } from "react";
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

  return (
    <Router>
      <Navbar />
      <div className="absolute top-20 left-4 z-20">

      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route
          path="/whiteboard"
          element={<Whiteboard canvasRef={canvasRef} setFabricCanvas={setFabricCanvas}
            changePenColor={changePenColor}
            selectPen={selectPen}
            selectEraser={selectEraser}
            penColor={penColor}
           />}
        />
      </Routes>
    </Router>
  );
};

export default App;
