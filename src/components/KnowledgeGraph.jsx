import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

const KnowledgeGraph = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const nodes = [
      { id: 0, label: "Tridiagonal.AI", color: "#007bff" },
      { id: 1, label: "About" },
      { id: 2, label: "Services" },
      { id: 3, label: "Industries" },
      { id: 4, label: "Products" },
      { id: 5, label: "Pricing" },
    ];

    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 0, to: 5 },
    ];

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: "dot",
        size: 25,
        font: { size: 14, color: "#fff" },
      },
      edges: {
        arrows: "to",
        color: "#333",
      },
      layout: {
        improvedLayout: true,
      },
      physics: {
        enabled: true,
      },
    };

    new Network(containerRef.current, data, options);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        zIndex: -1,
        top: 0,
        left: 0,
        opacity: 0.1, // Adjust for visibility
      }}
    />
  );
};

export default KnowledgeGraph;
