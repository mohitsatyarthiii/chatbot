import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTimes, FaCheck, FaMicrophone } from 'react-icons/fa';
import iconImage from "/aiveee.jpg"


const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ type: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAIText, setPendingAIText] = useState('');
  const [animatedText, setAnimatedText] = useState('');
  const fgRef = useRef<any>(null);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(()=>{
    scrollToBottom()
  }, [chatHistory, isTyping])

  // Draggable state
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);


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
      const response = await axios.post('https://65.2.28.184:5000/query', { question });
      return response.data.answer || "I'm sorry, I didn't understand that.";
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return "Oops! Something went wrong. Please try again later.";
    }
  };


  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', text }]);
    setInputText('');
    setIsTyping(true);
    const [response] = await Promise.all([fetchChatResponse(text)]);
    setPendingAIText(response);
  };

  const startVoiceInput = () => recognition?.start();

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging && dragStartPos.current) {
      setPosition({ x: e.clientX - dragStartPos.current.x, y: e.clientY - dragStartPos.current.y });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    dragStartPos.current = null;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  const predefinedButtons = ['Tridiagonal', 'Agentic AI Solutions', 'Case Studies', 'Industries', 'Agentic Ai', 'Services'];

  return (
<div
  className="h-screen w-screen font-sans relative overflow-hidden"
  style={{ background: 'none' }} // <<-- Line 1: transparent background for iframe use
>
  {/* Floating Chat Icon */}
  {!isChatbotOpen && (
    <button
      onClick={() => setIsChatbotOpen(true)}
      className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      aria-label="Open chatbot"
    >
      <img
      src={iconImage}
      alt='chat icon'
      className='w-8 h-8 object-cover rounded-full'
      />
    </button>
  )}

  {/* Chatbot Section - draggable */}
  {isChatbotOpen && (
    <div
      className={`w-[360px] bg-white p-5 rounded-2xl shadow-xl cursor-move select-none flex flex-col transition-all duration-300 ease-in-out ${
        isMinimized ? 'h-14' : 'h-[450px]'
      }`}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 10000,
        border: '1px solid #ddd',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
      onMouseDown={onMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
        <div className="flex items-center font-semibold text-lg text-gray-900">
          <img 
          src={iconImage}
          alt='icon image'
          className='w-8 h-8 rounded-full object-cover mr-2'
          />
          Talk to Aivee
        </div>
        <button
          onClick={() => setIsChatbotOpen(false)}
          className="text-gray-500 hover:text-red-500 transition px-2 py-1 rounded"
          title="Close"
        >
          <FaTimes />
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 px-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-lg max-w-[85%] text-sm shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {msg.text}
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="p-4 rounded-lg bg-gray-100 text-gray-900 text-sm shadow-sm"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {animatedText}
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          <div className="flex flex-wrap gap-2 my-4 justify-center">
            {predefinedButtons.map((btn, idx) => (
              <button
                key={idx}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs shadow hover:bg-gray-300 transition"
                onClick={() => handleUserInput(btn)}
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ask Aivee..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUserInput(inputText)}
            />
            <button
              onClick={() => handleUserInput(inputText)}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg text-white shadow transition"
              aria-label="Send message"
            >
            <FaCheck />
            </button>
            <button
              onClick={startVoiceInput}
              className="bg-yellow-400 px-2 py-2 rounded-lg hover:bg-yellow-300 shadow transition text-white"
              aria-label="Start voice input"
            >
              <FaMicrophone />
            </button>
          </div>
        </>
      )}
    </div>
  )}
</div>
  )
}


export default App;
