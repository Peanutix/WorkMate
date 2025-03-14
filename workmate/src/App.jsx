import React, { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Whiteboard from "./components/Whiteboard";
import Toolbox from "./components/Toolbox";
import { fabric } from "fabric";

const App = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const defaultBackgroundColor = "#e5e7eb";

  // using penColor for toggling between pen and eraser.
  const [penColor, setPenColor] = useState("black");
  const [toggleEraser, setToggleEraser] = useState(false);

  const changePenColor = (color) => {
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.color = color;
      setPenColor(color);
      fabricCanvas.renderAll();
    }
  };
  // test
  // pen tool 
  const selectPen = () => {
    if (fabricCanvas) {
      changePenColor("black");
      setToggleEraser(false);
    }
  };

  //erase tool 
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
        <Toolbox selectPen={selectPen} selectEraser={selectEraser} />
      </div>
        <Whiteboard canvasRef={canvasRef} setFabricCanvas={setFabricCanvas} />
    </div>
  );
};

export default App;
