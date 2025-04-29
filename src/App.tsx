import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';
import './App.css';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ type: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAIText, setPendingAIText] = useState('');
  const [animatedText, setAnimatedText] = useState('');
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const fgRef = useRef<any>(null);

  const recognition = (window as any).webkitSpeechRecognition
    ? new (window as any).webkitSpeechRecognition()
    : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript);
      };
    }
  }, []);

  useEffect(() => {
    if (pendingAIText) {
      setAnimatedText('');
      const words = pendingAIText.split(' ');
      let i = 0;
      const interval = setInterval(() => {
        setAnimatedText(prev => prev + words[i] + ' ');
        i++;
        if (i >= words.length) {
          clearInterval(interval);
          setChatHistory(prev => [...prev, { type: 'ai', text: pendingAIText }]);
          setPendingAIText('');
          setIsTyping(false);
        }
      }, 120);
      return () => clearInterval(interval);
    }
  }, [pendingAIText]);

  const fetchChatResponse = async (question: string) => {
    try {
      const response = await axios.post('http://65.2.28.184:5000/query', { question });
      return response.data.answer || "I'm sorry, I didn't understand that.";
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return "Oops! Something went wrong. Please try again later.";
    }
  };

  const fetchGraphData = async (keyword: string) => {
    try {
      const response = await axios.post(
        'http://65.2.28.184:7474/db/neo4j/tx/commit',
        {
          statements: [
            {
              statement:
                'MATCH (n)-[r]->(m) WHERE toLower(n.name) CONTAINS toLower($keyword) OR toLower(m.name) CONTAINS toLower($keyword) RETURN n, r, m',
              parameters: { keyword }
            }
          ]
        },
        {
          auth: {
            username: 'neo4j',
            password: 'tridiagonal'
          },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const nodesMap = new Map();
      const links: any[] = [];
      const results = response.data.results[0]?.data || [];

      results.forEach((row: any) => {
        const n = row.row[0];
        const r = row.row[1];
        const m = row.row[2];
        const nId = JSON.stringify(n);
        const mId = JSON.stringify(m);
        const nNode = { id: nId, name: n.name || 'Unnamed Node', label: n.label || 'Node' };
        const mNode = { id: mId, name: m.name || 'Unnamed Node', label: m.label || 'Node' };

        nodesMap.set(nNode.id, nNode);
        nodesMap.set(mNode.id, mNode);
        links.push({ source: nNode.id, target: mNode.id, label: r.type });
      });

      setGraphData({ nodes: Array.from(nodesMap.values()), links });

      setTimeout(() => {
        fgRef.current?.zoomToFit(400, 80);
      }, 300);
    } catch (err) {
      console.error('Graph fetch error:', err);
    }
  };

  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', text }]);
    setInputText('');
    setIsTyping(true);
    const [response] = await Promise.all([fetchChatResponse(text), fetchGraphData(text)]);
    setPendingAIText(response);
  };

  const handleNodeClick = (node: any) => {
    if (node?.name) {
      handleUserInput(node.name);
    }
  };

  const startVoiceInput = () => recognition?.start();

  const predefinedButtons = ['Tridiagonal', 'Agentic AI Solutions', 'Consulting', 'Case Studies', 'Industries'];

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden font-sans">
      {/* Chatbot Section */}
      <div className="lg:w-[28%] w-full h-[50vh] lg:h-full bg-gradient-to-b from-[#1e1e2f] to-[#2a2a3f] p-4 text-white flex flex-col">
        <div className="text-3xl font-bold text-center mb-4 glow-text">Talk to Aivee</div>

        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-[90%] text-base shadow-lg ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-black'
                }`}
              >
                {msg.text}
                <div className="text-xs text-white-400 mt-2">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-6 rounded-lg bg-white text-black text-base shadow-lg">
                {animatedText}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 my-3 justify-center">
          {predefinedButtons.map((btn, idx) => (
            <button
              key={idx}
              className="bg-gradient-to-r from-gray-100 to-gray-300 text-black px-3 py-1 rounded-full text-xs shadow hover:bg-gray-200 transition"
              onClick={() => handleUserInput(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg bg-[#3a3a4f] text-white focus:outline-none shadow-md"
            placeholder="Ask Aivee..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUserInput(inputText)}
          />
          <button
            onClick={() => handleUserInput(inputText)}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg shadow-md"
          >
            📤
          </button>
          <button
            onClick={startVoiceInput}
            className="bg-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-300 shadow-md"
          >
            🎙️
          </button>
        </div>
      </div>

      {/* Graph Section */}
      <div
        className="lg:w-[75%] w-full h-[50vh] lg:h-full relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://44712893.fs1.hubspotusercontent-na1.net/hubfs/44712893/AI%20Slider%20images/Tridiagonal.AO-1.gif')"
        }}
      >
        <div className="absolute inset-0 bg-opacity-0 z-0" />
        <div className="relative z-10 h-full w-full">
          <div className="text-center text-xl font-semibold text-white bg-black bg-opacity-50 py-2">
            Play With Knowledge Graph [Note:- Use keyword in chat to see Graphical View]
          </div>
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            onNodeClick={handleNodeClick}
            nodeAutoColorBy="label"
            nodeLabel="name"
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = (node as any).name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = 'black';
              ctx.fillText(label, (node as any).x! + 6, (node as any).y! + 6);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
