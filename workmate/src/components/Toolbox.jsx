import React from "react";
import { PaintBrushIcon, ServerIcon } from "@heroicons/react/24/outline";

const Toolbox = ({ selectPen, selectEraser, changePenColor, penColor }) => {
  return (
    <div className="flex items-center justify-between bg-white p-2 space-x-4 rounded-md shadow-lg">
      {/* Pen Button */}
      <div onClick={selectPen} className="cursor-pointer">
        <Icons IconComponent={PaintBrushIcon} />
      </div>

      {/* Eraser Button */}
      <div onClick={selectEraser} className="cursor-pointer">
        <Icons IconComponent={ServerIcon} />
      </div>

      {/* Color Picker */}
      <div className="p-2 flex justify-center items-center hover:bg-gray-100 rounded-md h-10 w-10 relative">
        <div className="w-5 h-5 border-2 border-black rounded relative">
          <input
            type="color"
            onChange={(event) => changePenColor(event.target.value)}
            value={penColor}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbox;

const Icons = ({ IconComponent }) => {
  return (
    <div className="h-10 w-10 hover:bg-gray-100 rounded-md p-2">
      <IconComponent className="w-6 h-6" />
    </div>
  );
};
