import React, { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Whiteboard from "./components/Whiteboard";
import Toolbox from "./components/Toolbox";
import { fabric } from "fabric";

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

  // Select the pen tool by setting the brush color to black
  const selectPen = () => {
    if (fabricCanvas) {
      changePenColor("black");
      setToggleEraser(false);
    }
  };

  // Select the eraser tool by setting the brush color to the background color
  const selectEraser = () => {
    if (fabricCanvas) {
      changePenColor(defaultBackgroundColor);
      setToggleEraser(true);
    }
  };

  return (
    <div>
      <Navbar  />
      <div className="absolute top-20 left-4 z-20">
        <Toolbox
          selectPen={selectPen}
          selectEraser={selectEraser}
          changePenColor={changePenColor}
          penColor={penColor}
        />
      </div>
        <Whiteboard canvasRef={canvasRef} setFabricCanvas={setFabricCanvas} />
    </div>
  );
};

export default App;
