'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Brain,
  Eye,
  Lightbulb,
  Code2,
  MessageSquareCode,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Bot,
  User,
  Quote,
  CheckCircle2,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { KNOWLEDGE_NODES } from '@/lib/curriculum-data';
import { LearningStyle, TutorMessageData, UserProfileData } from '@/lib/types';
import { generateTutorResponse } from '@/lib/ai-tutor-service';

interface AITutorViewProps {
  initialNodeId?: string;
  userProfile: UserProfileData;
  onUpdateLearningStyle: (style: LearningStyle) => void;
  onStartQuiz: (nodeId: string) => void;
}

export function AITutorView({
  initialNodeId,
  userProfile,
  onUpdateLearningStyle,
  onStartQuiz,
}: AITutorViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId || 'ai-01');
  const [inputMessage, setInputMessage] = useState('');
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(1);
  const [activeStyle, setActiveStyle] = useState<LearningStyle>(userProfile.preferredStyle);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessageData[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello ${userProfile.name.split(' ')[0]}! I am your AI Socratic Tutor, calibrated for **${userProfile.preferredStyle}** learning.\n\nI won't just dump raw answers or write code for you to copy. Instead, I will ask guiding questions, provide step-by-step mental models, and help you arrive at first-principles mastery.\n\nWe are currently anchored to **${KNOWLEDGE_NODES[initialNodeId || 'ai-01']?.title || 'Foundations'}**. What part would you like to explore?`,
      hintEscalationLevel: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([
    'Give me a Level 1 Guiding Question',
    'Explain the geometric intuition with a diagram',
    'How does this prevent bugs in production?',
    'Show a practical code example',
  ]);

  const activeNode = KNOWLEDGE_NODES[selectedNodeId];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: TutorMessageData = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      hintEscalationLevel: currentHintLevel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateTutorResponse({
        message: textToSend,
        nodeId: selectedNodeId,
        hintLevel: currentHintLevel,
        learningStyle: activeStyle,
        history: messages.map(m => ({ role: m.role as any, content: m.content })),
      });

      const assistantMsg: TutorMessageData = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        hintEscalationLevel: response.hintLevel,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
      setSuggestedFollowUps(response.suggestedFollowUps);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalateHint = () => {
    const nextLevel = Math.min(4, currentHintLevel + 1);
    setCurrentHintLevel(nextLevel);
    handleSendMessage(`Please escalate to Socratic Hint Level ${nextLevel} for this topic.`);
  };

  const handleResetChat = () => {
    setCurrentHintLevel(1);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'assistant',
        content: `Session reset! I am ready to explore **${activeNode?.title}** with you. Where should we begin?`,
        hintEscalationLevel: 0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Controls & Persona Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        {/* Active Node Context */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Anchor:</span>
              <select
                value={selectedNodeId}
                onChange={(e) => {
                  setSelectedNodeId(e.target.value);
                  setCurrentHintLevel(1);
                }}
                className="text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 py-1 px-2.5 font-medium focus:outline-none focus:border-indigo-500"
              >
                {Object.values(KNOWLEDGE_NODES).map(node => (
                  <option key={node.id} value={node.id}>
                    {node.title}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400">
              Bloom Level: <span className="text-indigo-400 font-semibold">{activeNode?.bloomLevel}</span> • Est: {activeNode?.estimatedMinutes}m
            </p>
          </div>
        </div>

        {/* Learning Modality Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['VISUAL', 'CONCEPTUAL', 'PRACTICE_HEAVY', 'SOCRATIC'] as LearningStyle[]).map(style => (
            <button
              key={style}
              onClick={() => {
                setActiveStyle(style);
                onUpdateLearningStyle(style);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors capitalize ${
                activeStyle === style
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {style.toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[640px]">
        
        {/* Chat Header Toolbar */}
        <div className="px-6 py-3.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">Socratic Mentor Online</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400 font-mono">Current Hint Ladder: Level {currentHintLevel}/4</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleEscalateHint}
              disabled={currentHintLevel >= 4}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Escalate Hint
            </button>
            <button
              onClick={handleResetChat}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
              title="Reset Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3.5 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-600/20 border border-purple-500/30 text-purple-400'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Markdown / Plain Text rendering */}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content.split('\n\n').map((block, bIdx) => {
                    if (block.startsWith('```')) {
                      const cleanCode = block.replace(/```[a-z]*/g, '').trim();
                      return (
                        <pre key={bIdx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto my-2">
                          {cleanCode}
                        </pre>
                      );
                    }
                    if (block.startsWith('###')) {
                      return (
                        <h4 key={bIdx} className="font-bold text-slate-100 text-sm sm:text-base border-b border-slate-800 pb-1 mt-2">
                          {block.replace(/^###\s*/, '')}
                        </h4>
                      );
                    }
                    return <p key={bIdx}>{block}</p>;
                  })}
                </div>

                {/* RAG Context Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                    <div className="flex items-center space-x-1 font-semibold text-slate-300">
                      <Quote className="w-3 h-3 text-purple-400" />
                      <span>Retrieved Knowledge Chunk (pgvector RAG):</span>
                    </div>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="p-2 bg-slate-950/80 rounded-lg border border-slate-800 italic text-slate-400">
                        "{c.snippet}"
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-right font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-slate-400 italic">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
              <span>Synthesizing Socratic guidance and retrieving context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Follow-Ups */}
        {suggestedFollowUps.length > 0 && (
          <div className="px-6 py-2 bg-slate-900/40 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-semibold text-slate-500 shrink-0">Suggestions:</span>
            {suggestedFollowUps.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 whitespace-nowrap transition-colors flex items-center space-x-1 shrink-0"
              >
                <span>{suggestion}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask a question or explain your intuition for ${activeNode?.title}...`}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
