import React from "react";
import { PaintBrushIcon, ServerIcon } from "@heroicons/react/24/outline";

const Toolbox = ({ selectPen, selectEraser }) => {
  return (
    <div className="flex items-center justify-between bg-white p-2 space-x-4 rounded-md w-[140px] shadow-lg">
      {/* Pen Button */}
      <div onClick={selectPen} className="cursor-pointer">
        <Icons IconComponent={PaintBrushIcon} />
      </div>

      {/* Eraser Button */}
      <div onClick={selectEraser} className="cursor-pointer">
        <Icons IconComponent={ServerIcon} />
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
