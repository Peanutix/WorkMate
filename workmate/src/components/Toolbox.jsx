import React from "react";
import { PaintBrushIcon, ServerIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const Toolbox = ({ selectPen, selectEraser, changePenColor, penColor, changePenWidth, penWidth, downloadBoard}) => {
  return (
    <div className="flex items-center justify-between bg-white p-2 space-x-4 rounded-xl w-[350px] shadow-xl border border-gray-200">
      {/* Pen Button */}
      <ToolButton onClick={selectPen} label="Pen">
        <PaintBrushIcon className="w-6 h-6 text-gray-700" />
      </ToolButton>

      {/* Eraser Button */}
      <ToolButton onClick={selectEraser} label="Eraser">
        <ServerIcon className="w-6 h-6 text-gray-700" />
      </ToolButton>

      {/* Color Picker */}
      <div
        className="relative group cursor-pointer"
        title="Pick Color"
      >
        <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-md hover:bg-gray-100 transition">
          <div
            className="w-5 h-5 rounded border border-black"
            style={{ backgroundColor: penColor }}
          />
        </div>
        <input
          type="color"
          onChange={(event) => changePenColor(event.target.value)}
          value={penColor}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

              {/* Pen Width */}
              <div className="w-full flex">
                <input
                  type="range"
                  onChange={(event) => changePenWidth(event.target.value)}
                  value={penWidth}
                  min="1"
                  max="30"
                  className="w-[100px] appearance-none h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>


          {/* Download Button  */}
 {/* Download Button */}
<ToolButton onClick={downloadBoard} label="Download">
  <ArrowDownTrayIcon className="w-6 h-6 text-gray-700" />
</ToolButton>



    </div>
  );
};

export default Toolbox;

// Reusable ToolButton Component with tooltip on hover
const ToolButton = ({ onClick, children, label }) => {
  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer"
      title={label}
    >
      <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-md transition">
        {children}
      </div>
    </div>
  );
};
