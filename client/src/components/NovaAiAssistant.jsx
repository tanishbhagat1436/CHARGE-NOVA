import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, Send, X, Sparkles, Loader2, Battery, Zap, Radio } from 'lucide-react';
import { queryNovaAiAssistant } from '../services/aiKnowledgeService';

export default function NovaAiAssistant({
  vehicle,
  currentSoc,
  currentRangeKm,
  routeData,
  stops,
  totalChargeTimeMins,
  trafficData,
  sourceLocation,
  destLocation
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello Driver! I'm Nova AI, your intelligent EV Highway Assistant. Ask me anything about your battery, chargers, traffic, or savings!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleSendPrompt(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSendPrompt = async (promptToUse) => {
    const queryText = promptToUse || inputText;
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(async () => {
      const aiReply = await queryNovaAiAssistant({
        prompt: queryText,
        vehicle,
        currentSoc,
        currentRangeKm,
        routeData,
        stops,
        totalChargeTimeMins,
        trafficData,
        sourceLocation,
        destLocation
      });

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsThinking(false);
      speakText(aiReply);
    }, 500);
  };

  return (
    <div 
      className="fixed bottom-5 right-5 font-sans"
      style={{ zIndex: 9999 }}
    >
      
      {/* Launcher Badge - Clean Google Maps Floating Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white border border-[#dadce0] text-[#202124] px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2.5 hover:bg-slate-50 transition-all cursor-pointer group active:scale-95"
        >
          <div className="p-1.5 bg-blue-50 text-[#1a73e8] rounded-full border border-blue-200">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div className="text-left pr-1">
            <div className="text-[10px] font-bold uppercase text-[#5f6368]">Assistant</div>
            <div className="text-xs font-bold text-[#202124]">
              Ask Nova AI
            </div>
          </div>
        </button>
      )}

      {/* Chat Box Modal */}
      {isOpen && (
        <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-[380px] h-[520px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-[#202124]">
          
          {/* Header */}
          <div className="p-3.5 bg-white border-b border-[#dadce0] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200 font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202124] flex items-center gap-1.5">
                  <span>Nova AI Assistant</span>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-[#1a73e8] text-[9px] rounded font-mono font-semibold">v2.0</span>
                </h3>
                <p className="text-[10px] text-[#5f6368]">Route & Vehicle Aware</p>
              </div>
            </div>

            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsOpen(false);
              }}
              className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="p-2 bg-[#f8f9fa] border-b border-[#dadce0] flex items-center space-x-1.5 overflow-x-auto text-[10px] font-semibold text-[#5f6368]">
            <button
              onClick={() => handleSendPrompt("Will my battery reach destination?")}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#dadce0] rounded-full whitespace-nowrap text-[#3c4043] flex items-center gap-1 shrink-0 shadow-sm"
            >
              <Battery className="w-3 h-3 text-[#1e8e3e]" /> Can I reach?
            </button>
            <button
              onClick={() => handleSendPrompt("Where is the nearest fast charger?")}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#dadce0] rounded-full whitespace-nowrap text-[#3c4043] flex items-center gap-1 shrink-0 shadow-sm"
            >
              <Zap className="w-3 h-3 text-[#1a73e8]" /> Nearest Charger
            </button>
            <button
              onClick={() => handleSendPrompt("What is the traffic status?")}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#dadce0] rounded-full whitespace-nowrap text-[#3c4043] flex items-center gap-1 shrink-0 shadow-sm"
            >
              <Radio className="w-3 h-3 text-[#f9ab00]" /> Traffic Info
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#ffffff]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs font-normal leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#1a73e8] text-white font-medium rounded-br-none'
                      : 'bg-[#f1f3f4] border border-[#dadce0] text-[#202124] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-[#f1f3f4] border border-[#dadce0] p-2.5 rounded-2xl text-xs text-[#5f6368] font-medium flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1a73e8]" />
                  <span>Nova AI analyzing route...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Controls */}
          <div className="p-3 bg-white border-t border-[#dadce0] flex items-center space-x-2">
            <button
              onClick={handleStartVoiceInput}
              className={`p-2.5 rounded-full border transition-all ${
                isListening
                  ? 'bg-red-50 text-[#d93025] border-red-200 animate-pulse'
                  : 'bg-[#f8f9fa] text-[#5f6368] border-[#dadce0] hover:bg-slate-100'
              }`}
              title="Speak Voice Question"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder={isListening ? "Listening..." : "Ask a question..."}
              className="flex-1 bg-[#f8f9fa] border border-[#dadce0] rounded-full px-4 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
            />

            <button
              onClick={() => handleSendPrompt()}
              className="p-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-full transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
