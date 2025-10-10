// EditableNode.tsx
import React, { useState } from "react";
import { Handle, Position } from "reactflow";

interface EditableNodeProps {
  data: {
    label: string;
    shape?: "rectangle" | "circle" | "diamond" | "triangle";
    color?: string;
  };
  selected: boolean;
}

const EditableNode: React.FC<EditableNodeProps> = ({ data, selected }) => {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");

  // Generate shape-specific styles
  const getShapeStyle = (): React.CSSProperties => {
    switch (data.shape) {
      case "circle":
        return {
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: data.color || "#ffafcc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      case "diamond":
        return {
          width: 100,
          height: 100,
          background: data.color || "#b5ead7",
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      case "triangle":
        return {
          width: 0,
          height: 0,
          borderLeft: "50px solid transparent",
          borderRight: "50px solid transparent",
          borderBottom: `100px solid ${data.color || "#ffd166"}`,
          background: "transparent",
          position: "relative",
        };
      default: // rectangle
        return {
          width: 120,
          height: 60,
          borderRadius: 6,
          background: data.color || "#a2d2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
    }
  };
  

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {/* Handles for connecting edges (skip for triangle if needed) */}
      {data.shape !== "triangle" && (
        <Handle type="target" position={Position.Top} style={{ background: "#555" }} />
      )}

      {/* Shape */}
      <div
        style={{
          ...getShapeStyle(),
          border: selected ? "2px solid #007bff" : "1px solid #999",
          cursor: "pointer",
        }}
        onDoubleClick={() => setEditing(true)}
      >
        {/* Label for rectangle, circle, diamond */}
        {data.shape !== "triangle" && !editing && (
          <div style={{ transform: data.shape === "diamond" ? "rotate(-45deg)" : "none" }}>
            {label || "Unnamed Node"}
          </div>
        )}

        {/* Editable input */}
        {editing && (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => {
              data.label = label;
              setEditing(false);
            }}
            autoFocus
            style={{ width: "80%", border: "1px solid #ccc", borderRadius: 4 }}
          />
        )}
      </div>

      {data.shape !== "triangle" && (
        <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
      )}

      {/* Label for triangle (positioned above triangle) */}
      {data.shape === "triangle" && !editing && (
        <div style={{ position: "absolute", top: -30, width: "100%", textAlign: "center" }}>
          {label || "Unnamed Node"}
        </div>
      )}
    </div>
  );
};

export default EditableNode;
