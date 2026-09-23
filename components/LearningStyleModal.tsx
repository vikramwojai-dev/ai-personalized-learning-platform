'use client';

import React from 'react';
import { X, Eye, Lightbulb, Code2, MessageSquareCode, Check } from 'lucide-react';
import { LearningStyle } from '@/lib/types';

interface LearningStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: LearningStyle;
  onSelectStyle: (style: LearningStyle) => void;
}

export function LearningStyleModal({
  isOpen,
  onClose,
  currentStyle,
  onSelectStyle,
}: LearningStyleModalProps) {
  if (!isOpen) return null;

  const styles: { id: LearningStyle; title: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'VISUAL',
      title: 'Visual & Mental Models',
      desc: 'Focuses on 2D/3D projections, architectural topology diagrams, ASCII vector layouts, and spatial analogies.',
      icon: Eye,
      color: 'text-cyan-400',
    },
    {
      id: 'CONCEPTUAL',
      title: 'Conceptual & Mathematical Rigor',
      desc: 'Focuses on first-principles derivations, formal theorems, LaTeX mathematical formulations, and rigorous proofs.',
      icon: Lightbulb,
      color: 'text-amber-400',
    },
    {
      id: 'PRACTICE_HEAVY',
      title: 'Practice-Heavy & Hands-On Code',
      desc: 'Focuses on immediate executable code snippets, edge-case unit test suites, and practical failure debugging.',
      icon: Code2,
      color: 'text-emerald-400',
    },
    {
      id: 'SOCRATIC',
      title: 'Socratic Dialogue & Guided Inquiry',
      desc: 'Focuses on dialectic questions, counter-examples, and step-by-step hint escalation ladders.',
      icon: MessageSquareCode,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Personalized Learning Modality
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            SynapseAI adapts all lessons, quiz explanations, and tutor dialogues to your active style.
          </p>
        </div>

        <div className="space-y-3">
          {styles.map(item => {
            const Icon = item.icon;
            const isSelected = currentStyle === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectStyle(item.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
