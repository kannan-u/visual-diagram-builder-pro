import React from "react";

type ToolbarProps = {
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onSave, onZoomIn, onZoomOut, onFitView }) => (
  <div className="flex items-center gap-3 bg-gray-100 border-b px-4 py-2 shadow-sm">
    <button onClick={onSave} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
      💾 Save
    </button>
    <button onClick={onFitView} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
      🧭 Fit View
    </button>
    <button onClick={onZoomIn} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
      ➕ Zoom In
    </button>
    <button onClick={onZoomOut} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
      ➖ Zoom Out
    </button>
  </div>
);

export default Toolbar;
