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
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* Floating Trigger FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-3.5 bg-primary hover:bg-primary-700 text-white rounded-full shadow-card-lg transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
          title="Ask Nova EV Highway Copilot"
        >
          <Bot className="w-5 h-5" />
          <div className="absolute right-full mr-3 bg-ink text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-card">
            Ask Nova AI
          </div>
        </button>
      )}

      {/* Chat Box Modal */}
      {isOpen && (
        <div className="bg-white border border-surface-border rounded-2xl max-w-sm w-[380px] h-[500px] shadow-card-lg flex flex-col overflow-hidden text-ink animate-slide-down">
          
          {/* Header */}
          <div className="p-3.5 bg-white border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <span>Nova AI Assistant</span>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] rounded font-mono font-semibold">v2.0</span>
                </h3>
                <p className="text-[10px] text-ink-secondary">Route & Vehicle Aware</p>
              </div>
            </div>

            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsOpen(false);
              }}
              className="p-1.5 text-ink-tertiary hover:text-ink rounded-full hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="p-2 bg-surface-muted border-b border-surface-border flex items-center space-x-1.5 overflow-x-auto text-[10px] font-semibold text-ink-secondary">
            <button
              onClick={() => handleSendPrompt("Will my battery reach destination?")}
              className="px-2.5 py-1 bg-white hover:bg-primary/5 border border-surface-border rounded-full whitespace-nowrap text-ink flex items-center gap-1 shrink-0 shadow-card cursor-pointer"
            >
              <Battery className="w-3 h-3 text-success" /> Can I reach?
            </button>
            <button
              onClick={() => handleSendPrompt("Where is the nearest fast charger?")}
              className="px-2.5 py-1 bg-white hover:bg-primary/5 border border-surface-border rounded-full whitespace-nowrap text-ink flex items-center gap-1 shrink-0 shadow-card cursor-pointer"
            >
              <Zap className="w-3 h-3 text-primary" /> Nearest Charger
            </button>
            <button
              onClick={() => handleSendPrompt("What is the traffic status?")}
              className="px-2.5 py-1 bg-white hover:bg-primary/5 border border-surface-border rounded-full whitespace-nowrap text-ink flex items-center gap-1 shrink-0 shadow-card cursor-pointer"
            >
              <Radio className="w-3 h-3 text-warning" /> Traffic Info
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs font-normal leading-relaxed shadow-card ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white font-medium rounded-br-none'
                      : 'bg-surface-muted border border-surface-border text-ink rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-surface-muted border border-surface-border p-2.5 rounded-2xl text-xs text-ink-secondary font-medium flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Nova AI analyzing route...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Controls */}
          <div className="p-3 bg-white border-t border-surface-border flex items-center space-x-2">
            <button
              onClick={handleStartVoiceInput}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isListening
                  ? 'bg-danger/10 text-danger border-danger animate-pulse'
                  : 'bg-surface-muted text-ink-secondary border-surface-border hover:bg-surface-subtle'
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
              className="flex-1 bg-surface-muted border border-surface-border rounded-full px-4 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <button
              onClick={() => handleSendPrompt()}
              className="p-2.5 bg-primary hover:bg-primary-700 text-white font-bold rounded-full transition-all shadow-card cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
