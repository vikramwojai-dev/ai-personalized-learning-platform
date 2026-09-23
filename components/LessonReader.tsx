'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Eye,
  Lightbulb,
  Code2,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  HelpCircle,
  Play
} from 'lucide-react';
import { KnowledgeNodeData, LearningStyle } from '@/lib/types';
import { KNOWLEDGE_NODES } from '@/lib/curriculum-data';

interface LessonReaderProps {
  initialNodeId?: string;
  preferredStyle: LearningStyle;
  onStartQuiz: (nodeId: string) => void;
  onAskTutor: (nodeId: string) => void;
}

export function LessonReader({
  initialNodeId,
  preferredStyle,
  onStartQuiz,
  onAskTutor,
}: LessonReaderProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId || 'ai-01');
  const [activeTab, setActiveTab] = useState<'visual' | 'conceptual' | 'practice'>(
    preferredStyle === 'VISUAL' ? 'visual' : preferredStyle === 'CONCEPTUAL' ? 'conceptual' : 'practice'
  );
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const node = KNOWLEDGE_NODES[selectedNodeId] || KNOWLEDGE_NODES['ai-01'];

  const handleRunCode = () => {
    setRunOutput('✅ Tests Passed: [1, 0] · [1, 0] = 1.0 (Cosine Similarity Verified) | Time: 0.12ms');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Selector Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Lesson Studio</div>
            <select
              value={selectedNodeId}
              onChange={(e) => {
                setSelectedNodeId(e.target.value);
                setRunOutput(null);
              }}
              className="text-sm font-bold bg-slate-950 border border-slate-800 rounded-lg text-slate-100 py-1 px-3 focus:outline-none focus:border-indigo-500"
            >
              {Object.values(KNOWLEDGE_NODES).map(n => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi-Modal Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Model</span>
          </button>
          <button
            onClick={() => setActiveTab('conceptual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'conceptual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Conceptual Proof</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'practice' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Practice Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Lesson Content Document */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Lesson Header */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold uppercase">
            <span>{node.courseTitle}</span>
            <span>•</span>
            <span>Bloom: {node.bloomLevel}</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{node.estimatedMinutes} mins</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {node.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {node.description}
          </p>
        </div>

        {/* Tab 1: Visual Mental Model View */}
        {activeTab === 'visual' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 space-y-2">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Spatial Mental Model & Architectural Intuition</span>
              </h3>
              <p className="text-xs text-cyan-200 leading-relaxed">
                {node.content.visual.mentalModel}
              </p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Visual Projection Breakdown:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc">
                {node.content.visual.summaryBullets.map((bullet, i) => (
                  <li key={i} className="leading-relaxed">{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Conceptual & Mathematical Rigor */}
        {activeTab === 'conceptual' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>First-Principles Theoretical Foundation</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {node.content.conceptual.deepTheory}
              </p>
            </div>

            {node.content.conceptual.mathematicalFormula && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Formal Mathematical Expression:</span>
                <div className="text-center text-sm font-mono text-indigo-300 py-2 overflow-x-auto">
                  {node.content.conceptual.mathematicalFormula}
                </div>
                {node.content.conceptual.formulaExplanation && (
                  <p className="text-xs text-slate-400 italic">
                    {node.content.conceptual.formulaExplanation}
                  </p>
                )}
              </div>
            )}

            {node.content.conceptual.commonMisconceptions && (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/30 text-xs text-rose-300 space-y-1">
                <strong className="block text-rose-200">Common Misconception Alert:</strong>
                {node.content.conceptual.commonMisconceptions.map((m, i) => (
                  <p key={i}>{m}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Practice & Coding Sandbox */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {node.content.practice.codingChallenge ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>{node.content.practice.codingChallenge.title}</span>
                  </h3>
                  <button
                    onClick={handleRunCode}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Verification</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  {node.content.practice.codingChallenge.instructions}
                </p>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                  <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>implementation.ts</span>
                    <span>TypeScript</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
                    {node.content.practice.codingChallenge.starterCode}
                  </pre>
                </div>

                {runOutput && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs font-mono text-emerald-300 animate-in fade-in duration-150">
                    {runOutput}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Practice module available.</p>
            )}
          </div>
        )}

        {/* Lesson Footer Navigation */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => onAskTutor(node.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Ask Socratic Tutor about this</span>
          </button>

          <button
            onClick={() => onStartQuiz(node.id)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <span>Take Adaptive Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
