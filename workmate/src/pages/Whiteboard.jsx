import React, { useEffect } from "react";
import { fabric } from "fabric";
import Toolbox from "../components/Toolbox";

const Whiteboard = ({ canvasRef, setFabricCanvas, selectPen, selectEraser, changePenColor, penColor}) => {
  useEffect(() => {
    // Guard: if canvasRef isn't attached, do nothing
    if (!canvasRef.current) return;
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#e5e7eb",
      width: window.innerWidth,
      height: window.innerHeight,
      isDrawingMode: true,
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasRef, setFabricCanvas]);

  return (
    <>
    <div className="bg-[#e5e7eb] p-5">

      <Toolbox
        
        selectPen={selectPen}
        selectEraser={selectEraser}
        changePenColor={changePenColor}
        penColor={penColor}
        />
        </div>
      <div className="relative w-full h-screen rounded-md">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          ></canvas>
      </div>
    </>
  );
};

export default Whiteboard;
