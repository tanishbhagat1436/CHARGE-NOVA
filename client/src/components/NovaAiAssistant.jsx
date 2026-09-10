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
      
      {/* Launcher Badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 hover:bg-slate-800 transition-all cursor-pointer group active:scale-95"
        >
          <div className="p-1.5 bg-emerald-800 text-slate-100 rounded-xl border border-emerald-700">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-left pr-1">
            <div className="text-[10px] font-bold uppercase text-slate-400">Driver Assistant</div>
            <div className="text-xs font-bold text-slate-100">
              Ask Nova AI
            </div>
          </div>
        </button>
      )}

      {/* Chat Box Modal */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-[380px] h-[520px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-800 text-slate-100 rounded-xl border border-emerald-700 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Nova AI Assistant</span>
                  <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[9px] rounded font-mono">v2.0</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Route & Vehicle Aware</p>
              </div>
            </div>

            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsOpen(false);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="p-2 bg-slate-950 border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto text-[10px] font-bold text-slate-300">
            <button
              onClick={() => handleSendPrompt("Will my battery reach destination?")}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg whitespace-nowrap text-slate-200 flex items-center gap-1 shrink-0"
            >
              <Battery className="w-3 h-3 text-emerald-400" /> Can I reach?
            </button>
            <button
              onClick={() => handleSendPrompt("Where is the nearest fast charger?")}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg whitespace-nowrap text-slate-200 flex items-center gap-1 shrink-0"
            >
              <Zap className="w-3 h-3 text-emerald-400" /> Nearest Charger
            </button>
            <button
              onClick={() => handleSendPrompt("What is the traffic status?")}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg whitespace-nowrap text-slate-200 flex items-center gap-1 shrink-0"
            >
              <Radio className="w-3 h-3 text-blue-400" /> Traffic Info
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-slate-100 font-semibold rounded-br-none border border-emerald-700'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 font-bold flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Nova AI analyzing route...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Controls */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={handleStartVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
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
              placeholder={isListening ? "Listening..." : "Ask Nova AI driver question..."}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />

            <button
              onClick={() => handleSendPrompt()}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-bold rounded-xl transition-all border border-emerald-700"
            >
              <Send className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
