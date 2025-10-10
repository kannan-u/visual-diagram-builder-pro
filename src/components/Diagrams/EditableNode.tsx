// EditableNode.tsx
import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const EditableNode: React.FC<NodeProps> = ({ id, data }) => {
  const [label, setLabel] = useState(data.label);

  useEffect(() => {
    data.label = label; // update React Flow node data
  }, [label, data]);

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #333",
        borderRadius: 6,
        background: "#fff",
        minWidth: 100,
        textAlign: "center",
      }}
    >
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{ width: "100%", border: "none", outline: "none" }}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default EditableNode;
