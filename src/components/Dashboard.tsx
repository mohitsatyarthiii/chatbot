// src/pages/index.tsx or wherever the chatbot is rendered
import { useState } from 'react';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  const [highlightNode, setHighlightNode] = useState('');

  const handleChatUpdate = async (question: string) => {
    const response = await fetch('/api/query-neo4j', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    if (data?.node?.name) {
      setHighlightNode(data.node.name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Chatbot onResponse={handleChatUpdate} />
      <div className="mt-8 w-full h-[500px]">
        <KnowledgeGraph highlightedNode={highlightNode} />
      </div>
    </div>
  );
}
