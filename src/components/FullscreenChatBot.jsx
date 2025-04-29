"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Loader2, SendHorizonal } from "lucide-react";
import AiveeAvatar from "@/components/AiveeAvatar";

// Lazy load ForceGraph to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false });

const FullscreenChatBot = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ type: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<any>({});
  const graphRef = useRef(null);

  // Fetch knowledge graph
  useEffect(() => {
    axios.get("http://65.2.28.184:5000/get_knowledge_graph")
      .then((res) => setGraphData(res.data))
      .catch((err) => console.error("Graph load error", err));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setChatHistory(prev => [...prev, { type: "user", message: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://65.2.28.184:5000/query", { query: userMessage });
      setChatHistory(prev => [...prev, { type: "bot", message: response.data.response }]);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed inset-0 z-50 h-full w-full flex items-center justify-center overflow-hidden">

      {/* Background Graph Layer */}
      {graphData.nodes && (
        <div className="absolute inset-0 -z-10 opacity-20">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel="name"
            nodeAutoColorBy="label"
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
          />
        </div>
      )}

      {/* Chatbot UI */}
      <div className="max-w-[500px] w-full h-full flex flex-col bg-white/80 backdrop-blur-md rounded-lg relative p-4">
        <div className="flex justify-center items-center mb-4">
          <img
            src="https://242474912.fs1.hubspotusercontent-na2.net/hub/242474912/hubfs/Untitled%20design.gif?width=300&height=300"
            alt="3D Animation"
            className="w-[150px] h-[150px] object-contain"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-4">
          {chatHistory.map((chat, i) => (
            <div key={i} className={`p-2 rounded-md max-w-[90%] ${chat.type === "user" ? "bg-blue-100 self-end text-right" : "bg-gray-200 self-start"}`}>
              {chat.message}
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <input
            type="text"
            placeholder="Type your message..."
