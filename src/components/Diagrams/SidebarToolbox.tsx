import React from "react";

type SidebarToolboxProps = {
  saveDiagram: () => void;
  isEditable: boolean;
  onDragStart: (e: React.DragEvent, nodeType: string) => void;
};

const shapes = [
  { type: "rectangle", label: "Rectangle", svg: <rect width="40" height="30" fill="#4caf50" /> },
  { type: "circle", label: "Circle", svg: <circle cx="20" cy="15" r="15" fill="#2196f3" /> },
  { type: "diamond", label: "Diamond", svg: <polygon points="20,0 40,15 20,30 0,15" fill="#ff9800" /> },
  { type: "triangle", label: "Triangle", svg: <polygon points="20,0 40,30 0,30" fill="#9c27b0" /> },
  { type: "hexagon", label: "Hexagon", svg: <polygon points="10,0 30,0 40,15 30,30 10,30 0,15" fill="#f44336" /> },
  { type: "parallelogram", label: "Parallelogram", svg: <polygon points="10,0 40,0 30,30 0,30" fill="#607d8b" /> },
];

const SidebarToolbox: React.FC<SidebarToolboxProps> = ({ saveDiagram, onDragStart, isEditable }) => {
  return (
    <aside style={{ width: 120, padding: 10, borderRight: "1px solid #ccc", display: "flex", flexDirection: "column", gap: 12 }}>
      <button disabled={!isEditable} 
        onClick={saveDiagram}
        style={{ marginBottom: 10, padding: "6px 10px", cursor: "pointer" }}
      >
        Save Diagram
      </button>

      {shapes.map((shape) => (
        <div
          key={shape.type}
          draggable
          onDragStart={(e) => onDragStart(e, shape.type)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 60,
            height: 40,
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "grab",
            backgroundColor: "#fff",
          }}
          title={shape.label}
        >
          <svg width="40" height="30">{shape.svg}</svg>
        </div>
      ))}
    </aside>
  );
};

export default SidebarToolbox;
