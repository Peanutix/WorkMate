import React, { useEffect } from "react";
import { fabric } from "fabric";

const Whiteboard = ({ canvasRef, setFabricCanvas }) => {
  useEffect(() => {
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
    <div className="relative w-full h-screen rounded-md">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
    </div>
  );
};

export default Whiteboard;
