import React from "react";

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: string) => void;
  saveDiagram: () => void;
}

export default function SidebarToolbox({ onDragStart, saveDiagram }: SidebarProps) {
  return (
    <div
      style={{
        width: 180,
        borderRight: "1px solid #ddd",
        padding: 12,
        background: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h4 style={{ fontWeight: "600", marginBottom: 10 }}>Toolbox</h4>
      <div
        onDragStart={(e) => onDragStart(e, "rectangle")}
        draggable
        style={{
          background: "#bbf7d0",
          padding: "8px 0",
          textAlign: "center",
          cursor: "grab",
          borderRadius: 4,
        }}
      >
        Rectangle
      </div>
      <div
        onDragStart={(e) => onDragStart(e, "circle")}
        draggable
        style={{
          background: "#fef08a",
          padding: "8px 0",
          textAlign: "center",
          cursor: "grab",
          borderRadius: "50%",
        }}
      >
        Circle
      </div>
      <div
        onDragStart={(e) => onDragStart(e, "diamond")}
        draggable
        style={{
          background: "#bfdbfe",
          padding: "8px 0",
          textAlign: "center",
          cursor: "grab",
          transform: "rotate(45deg)",
        }}
      >
        ◇
      </div>
      <button onClick={saveDiagram} style={{ marginTop: 20 }}>
        💾 Save Diagram
      </button>
    </div>
  );
}
