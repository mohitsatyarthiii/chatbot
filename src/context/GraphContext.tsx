// context/GraphContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface GraphContextType {
  highlightNodeId: string | null;
  setHighlightNodeId: (id: string | null) => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const GraphProvider = ({ children }: { children: React.ReactNode }) => {
  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);

  return (
    <GraphContext.Provider value={{ highlightNodeId, setHighlightNodeId }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraphContext must be used within a GraphProvider');
  }
  return context;
};
